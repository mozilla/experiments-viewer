import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import MG from 'metrics-graphics';

import store from '../../store';
import * as metricApi from '../../api/metric-api';
import {
  getMetricSuccess, getMetricFailure
} from '../../actions/metric-actions';

import Fetching from './fetching';


export class Chart extends React.Component {
  constructor(props) {
    super(props);

    // Number of x-axis ticks on the chart list page.
    this.numXTicksSmall = 4;

    // After how many characters should the x-axis labels get ellipsised?
    this.xLabelsChopLength = 8;
  }

  componentWillMount() {
    axios.get(`${metricApi.endpoints.GET_METRIC}${this.props.chartId}/`).then(response => {
      this.metric = response.data.metric;
      this.type = response.data.type;
      this.pointsMeta = this.buildPointsMeta(response.data.points);

      this.injectChart();
      document.querySelector(`.chart-${this.props.chartId}`).classList.remove('is-fetching');

      store.dispatch(getMetricSuccess(response.data));
    }).catch(response => {
      console.error(response);
      store.dispatch(getMetricFailure(response.status));
    });
  }

  componentDidUpdate() {
    if (this.pointsMeta) {
      this.injectChart();
    }
  }

  render() {
    const chart = (
      <div className={`chart is-fetching chart-${this.props.chartId}`}>
        <Fetching />
        <p className="chart-rollover-container"><span /><span /></p>
      </div>
    );

    if (!this.props.isDetail) {
      return <Link className="chart-link" to={`/chart/${this.props.chartId}/`}>{chart}</Link>;
    } else {
      return chart;
    }
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

  injectChart() {
    const refLabels = {};
    const infoElm = document.querySelector(`.chart-${this.props.chartId} .chart-rollover-container`);
    const pointsMetaLength = this.pointsMeta.length;

    this.pointsMeta.map(chartItem => {
      refLabels['' + chartItem.x] = chartItem.label;
    });

    /* eslint-disable camelcase */
    const graphOptions = {
      target: '.chart-' + this.props.chartId,

      // Data
      data: this.pointsMeta,
      x_accessor: 'x',
      y_accessor: 'y',
      show_rollover_text: false,

      // General display
      title: this.metric,
      full_width: true,
      area: false,
      missing_is_hidden: true,

      // y-axis
      min_y: 0,
      max_y: 100,
      mouseover: data => {
        infoElm.classList.add('show');
        infoElm.querySelector('span').textContent = refLabels[data.x];
        infoElm.querySelector('span:last-child').textContent = `${data.p.toFixed(4)}%`;
      },
      mouseout: () => {
        infoElm.classList.remove('show');
      },
      yax_units: '%',
      yax_units_append: true
    };

    if (this.type === 'category') {
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

Chart.propTypes = {
  chartId: React.PropTypes.number.isRequired,
  chartName: React.PropTypes.string.isRequired,
  isDetail: React.PropTypes.bool.isRequired,
  showOutliers: React.PropTypes.bool.isRequired
};
