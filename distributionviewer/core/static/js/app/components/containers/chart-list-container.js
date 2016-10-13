import React from 'react';
import { connect } from 'react-redux';

import ChartList from '../views/chart-list';
import * as metricApi from '../../api/metric-api';


class ChartListContainer extends React.Component {
  componentDidMount() {
    metricApi.getMetricMetadata(this.props.whitelistedMetricIds);
  }

  render() {
    return (
      <ChartList {...this.props} />
    );
  }
}

const mapStateToProps = function(store) {
  return {
    metadata: store.metricMetadataState.metadata,
  };
};

export default connect(mapStateToProps)(ChartListContainer);
