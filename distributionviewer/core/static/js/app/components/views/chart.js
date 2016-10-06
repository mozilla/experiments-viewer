import React from 'react';
import { Link } from 'react-router';
import MG from 'metrics-graphics';

import Fetching from './fetching';


export default class extends React.Component {
  constructor(props) {
    super(props);

    this.chartLoaded = false;

    // Number of x-axis ticks on the chart list page.
    this.numXTicksSmall = 4;

    // After how many characters should the x-axis labels get ellipsised?
    this.xLabelsChopLength = 8;
  }

  componentDidMount() {
    // On the chart detail page, points are loaded after the component mounts
    if (this.props.points) {
      this.loadChart();
    }
  }

  componentWillUpdate(nextProps) {
    // Load the chart if it can be loaded and hasn't been already. Otherwise,
    // it just needs to be updated.
    if (!this.chartLoaded && nextProps.points) {
      this.loadChart(nextProps);
    } else if (this.chartLoaded) {
      this.insertOrUpdateChart();
    }
  }

  render() {
    const chart = (
      <div className={`chart is-fetching chart-${this.props.id}`}>
        <Fetching />
        <table className="chart-rollover-table">
          <tbody>
            <tr>
              <th>x</th>
              <td className="value-x" />
            </tr>
            <tr>
              <th>y</th>
              <td className="value-y" />
            </tr>
            <tr>
              <th>proportion</th>
              <td className="value-p" />
            </tr>
          </tbody>
        </table>
      </div>
    );

    if (!this.props.isDetail) {
      return <Link className="chart-link" to={`/chart/${this.props.id}/`}>{chart}</Link>;
    } else {
      return chart;
    }
  }

  loadChart(props = this.props) {
    this.pointsMeta = this.buildPointsMeta(props.points);
    this.insertOrUpdateChart();
    document.querySelector(`.chart-${props.id}`).classList.remove('is-fetching');
    this.chartLoaded = true;
  }

  buildPointsMeta(dataPoints) {
    var pointsMeta = [];

    for (let i = 0; i < dataPoints.length; i++) {
      pointsMeta.push({
        x: dataPoints[i]['refRank'] || parseFloat(dataPoints[i]['b']),
        y: dataPoints[i]['c'] * 100,
        p: dataPoints[i]['p'] * 100,
        label: dataPoints[i]['b']
      });
    }

    return pointsMeta;
  }

  getShortLabel(lbl) {
    if (lbl.length > this.xLabelsChopLength) {
      return `${lbl.substring(0, this.xLabelsChopLength - 1)}…`;
    }
    return lbl;
  }

  insertOrUpdateChart() {
    const refLabels = {};
    const infoElm = document.querySelector(`.chart-${this.props.id} .chart-rollover-table`);
    const pointsMetaLength = this.pointsMeta.length;

    this.pointsMeta.map(chartItem => {
      refLabels['' + chartItem.x] = chartItem.label;
    });

    /* eslint-disable camelcase */
    const graphOptions = {
      target: '.chart-' + this.props.id,

      // Data
      data: this.pointsMeta,
      x_accessor: 'x',
      y_accessor: 'y',
      show_rollover_text: false,

      // General display
      title: this.props.metric,
      full_width: true,
      area: false,
      missing_is_hidden: true,

      // y-axis
      min_y: 0,
      max_y: 100,
      yax_count: 5,
      mouseover: data => {
        infoElm.classList.add('show');
        infoElm.querySelector('.value-x').textContent = refLabels[data.x];
        infoElm.querySelector('.value-y').textContent = `${data.y.toFixed(4)}%`;
        infoElm.querySelector('.value-p').textContent = `${data.p.toFixed(4)}%`;
      },
      mouseout: () => {
        infoElm.classList.remove('show');
      },
      yax_units: '%',
      yax_units_append: true
    };

    if (this.props.type === 'category') {
      graphOptions.xax_format = d => this.getShortLabel(refLabels[d]);
      graphOptions.xax_count = this.props.isDetail ? pointsMetaLength : this.numXTicksSmall;
    }

    if (!this.props.isDetail) {
      graphOptions.height = 250;
    } else {
      graphOptions.full_height = true;
    }

    if (this.props.showOutliers) {
      graphOptions.min_x = this.pointsMeta[0].x;
      graphOptions.max_x = this.pointsMeta[pointsMetaLength - 1].x;
    } else {
      graphOptions.min_x = this.pointsMeta[Math.max(Math.round(pointsMetaLength * 0.005) - 1, 0)].x;
      graphOptions.max_x = this.pointsMeta[Math.min(Math.round(pointsMetaLength * 0.995) - 1, pointsMetaLength - 1)].x;
    }

    MG.data_graphic(graphOptions);
    /* eslint-enable camelcase */
  }
}
