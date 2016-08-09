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
      x: data[i]['refRank'],
      y: data[i]['c'] * 100,
      label: data[i]['b']
    });
  }
  return result;
}

function generateChart(name, chart, width, height) {
  var refLabels = {};
  var formattedData = formatData(chart);

  formattedData.map(chartItem => {
    refLabels['' + chartItem.x] = chartItem.label;
  });

  /* eslint-disable camelcase */
  MG.data_graphic({
    target: '.' + name,

    // Data
    data: formattedData,
    x_accessor: 'x',
    y_accessor: 'y',

    // General display
    title: chart.metric,
    width,
    height,
    area: false,
    missing_is_hidden: true,
    axes_not_compact: false,

    // x-axis
    x_mouseover: data => `x: ${refLabels[data.x]}`,
    xax_format: d => refLabels[d],
    xax_count: formattedData.length,

    // y-axis
    max_y: 100,
    y_mouseover: data => `   y: ${data.y.toFixed(4)}%`,
  });
  /* eslint-enable camelcase */
}

export class Chart extends React.Component {
  componentDidMount() {
    // TODO: We need to do more here about managing isFetching.
    axios.get(`${metricApi.endpoints.GET_METRIC}${this.props.chartName}/`).then(response => {
      generateChart(this.props.chartName, response.data, this.props.width, this.props.height);
    });
  }

  render() {
    var chart = <div className={this.props.chartName} />;

    if (this.props.link) {
      return <Link to={`/metric/${this.props.chartName}/`}>{chart}</Link>
    } else {
      return chart;
    }
  }
}

Chart.propTypes = {
  chartName: React.PropTypes.string.isRequired,
  height: React.PropTypes.number.isRequired,
  isDataReady: React.PropTypes.bool.isRequired,
  item: React.PropTypes.object.isRequired,
  link: React.PropTypes.bool.isRequired,
  width: React.PropTypes.number.isRequired,
}
