import React from 'react';
import { connect } from 'react-redux';

import ChartConfig from '../views/chart-config';
import * as metricApi from '../../api/metric-api';


class ChartConfigContainer extends React.Component {
  constructor(props) {
    super(props);
    this.qmetrics = metricApi.getQueryMetrics(props.location.query);
  }

  componentDidMount() {
    metricApi.getMetrics();
  }

  _handleSubmit(e) {
    var metrics = Array.from(
      document.querySelectorAll('input[type="checkbox"]:checked'),
      input => input.value
    ).join(',');

    if (metrics) {
      window.location = '/?metrics=' + metrics;
    }
  }

  render() {
    return (
      <ChartConfig {...this.props} qmetrics={this.qmetrics} handleSubmit={this._handleSubmit} />
    );
  }
}

const mapStateToProps = function(store) {
  return {
    metadata: store.metricsMetadataState.metadata
  };
};

export default connect(mapStateToProps)(ChartConfigContainer);
