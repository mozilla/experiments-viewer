import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';

import MG from 'metrics-graphics';
import * as metricApi from '../../api/metric-api';
import Fetching from './fetching';


// Number of x-axis ticks on the chart list page.
const numTicks = 4;
// After how many characters should the x-axis labels get ellipsised?
const xLabelsChopLength = 11;

function formatData(item) {
  var result = [];
  var data = item.points;

  for (let i = 0; i < data.length; i++) {
    result.push({
      x: data[i]['refRank'] || data[i]['b'],
      y: data[i]['c'] * 100,
      p: data[i]['p'] * 100,
      label: data[i]['b']
    });
  }
  return result;
}

function getShortLabel(lbl) {
  if (lbl.length > xLabelsChopLength) {
    return `${lbl.substring(0, xLabelsChopLength - 1)}…`;
  }
  return lbl;
}

function generateChart(name, isDetail, chart) {
  var refLabels = {};
  var formattedData = formatData(chart);

  formattedData.map(chartItem => {
    refLabels['' + chartItem.x] = chartItem.label;
  });

  var infoElm = document.querySelector(`.${name} .chart-rollover-container`);

  /* eslint-disable camelcase */
  const graphOptions = {
    target: '.' + name,

    // Data
    data: formattedData,
    x_accessor: 'x',
    y_accessor: 'y',
    show_rollover_text: false,

    // General display
    title: chart.metric,
    full_width: true,
    area: false,
    missing_is_hidden: true,

    // y-axis
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
    yax_units_append: true,
  };

  if (chart.type === 'category') {
    graphOptions['xax_format'] = d => getShortLabel(refLabels[d]);
    graphOptions['xax_count'] = isDetail ? formatData.length : numTicks;
  }

  if (!isDetail) {
    graphOptions.height = 250;
  } else {
    graphOptions.full_height = true;
  }

  MG.data_graphic(graphOptions);
  /* eslint-enable camelcase */
}

export class Chart extends React.Component {
  componentDidMount() {
    axios.get(`${metricApi.endpoints.GET_METRIC}${this.props.chartName}/`).then(response => {
      generateChart(this.props.chartName, this.props.isDetail, response.data);
      document.querySelector(`.${this.props.chartName}`).classList.remove('is-fetching');
    });
  }

  render() {
    var chart = (
      <div className={`chart is-fetching ${this.props.chartName}`}>
        <Fetching />
        <p className="chart-rollover-container"><span /><span /></p>
      </div>
    );

    if (!this.props.isDetail) {
      return <Link className="chart-link" to={`/metric/${this.props.chartName}/`}>{chart}</Link>
    } else {
      return chart;
    }
  }
}

Chart.propTypes = {
  chartName: React.PropTypes.string.isRequired,
  item: React.PropTypes.object.isRequired,
  isDetail: React.PropTypes.bool.isRequired,
}
