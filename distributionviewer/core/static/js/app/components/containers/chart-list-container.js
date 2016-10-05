import React from 'react';
import { connect } from 'react-redux';

import ChartList from '../views/chart-list';
import * as metricApi from '../../api/metric-api';


class ChartListContainer extends React.Component {
  componentDidMount() {
    metricApi.getMetrics(this.props.query);
  }

  render() {
    return (
      <ChartList {...this.props} />
    );
  }
}

const mapStateToProps = function(store) {
  return {
    metrics: store.metricsState.metrics
  };
};

export default connect(mapStateToProps)(ChartListContainer);
