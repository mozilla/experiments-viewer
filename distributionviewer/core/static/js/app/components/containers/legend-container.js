import React from 'react';
import { connect } from 'react-redux';

import Legend from '../views/legend';
import * as metricApi from '../../api/metric-api';


class LegendContainer extends React.Component {
  componentDidMount() {
    metricApi.getMetric(this.props.metricId, this.props.whitelistedPopulations);
  }

  render() {
    return (
      <Legend {...this.props} />
    );
  }
}

const mapStateToProps = function(store, ownProps) {
  return {
    metric: store.metricState.metrics[ownProps.metricId],
  };
};

export default connect(mapStateToProps)(LegendContainer);
