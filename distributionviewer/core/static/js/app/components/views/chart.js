import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';

import MG from 'metrics-graphics';
import * as metricApi from '../../api/metric-api';


function formatData(item) {
  var result = [];
  var data = item.points;

  for (let i = 0; i < data.length; i++) {
    result.push({
      x: data[i]['refRank'] || data[i]['b'],
      y: data[i]['c'] * 100,
      label: data[i]['b']
    });
  }
  return result;
}

function generateChart(name, chart) {
  var refLabels = {};
  var formattedData = formatData(chart);

  formattedData.map(chartItem => {
    refLabels['' + chartItem.x] = chartItem.label;
  });

  /* eslint-disable camelcase */
  const graphOptions = {
    target: '.' + name,

    // Data
    data: formattedData,
    x_accessor: 'x',
    y_accessor: 'y',

    // General display
    title: chart.metric,
    full_width: true,
    full_height: true,
    area: false,
    missing_is_hidden: true,
    axes_not_compact: false,

    // x-axis
    x_mouseover: data => `x: ${refLabels[data.x]}`,

    // y-axis
    max_y: 100,
    y_mouseover: data => `   y: ${data.y.toFixed(4)}%`,
  };

  if (chart.type === 'category') {
    graphOptions['xax_format'] = d => refLabels[d];
    graphOptions['xax_count'] = formattedData.length;
  }

  MG.data_graphic(graphOptions);
  /* eslint-enable camelcase */
}

export class Chart extends React.Component {
  componentDidMount() {
    // TODO: We need to do more here about managing isFetching.
    axios.get(`${metricApi.endpoints.GET_METRIC}${this.props.chartName}/`).then(response => {
      generateChart(this.props.chartName, response.data);
    });
  }

  render() {
    var chart = <div className={`chart ${this.props.chartName}`} />;

    if (this.props.link) {
      return <Link className="chart-link" to={`/metric/${this.props.chartName}/`}>{chart}</Link>
    } else {
      return chart;
    }
  }
}

Chart.propTypes = {
  chartName: React.PropTypes.string.isRequired,
  isDataReady: React.PropTypes.bool.isRequired,
  item: React.PropTypes.object.isRequired,
  link: React.PropTypes.bool.isRequired,
}
