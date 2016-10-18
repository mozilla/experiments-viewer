import React from 'react';
import { connect } from 'react-redux';

import ChartList from '../views/chart-list';
import * as metricApi from '../../api/metric-api';


class ChartListContainer extends React.Component {
  componentDidMount() {
    metricApi.getMetricMetadata(this.props.whitelistedMetricIds);
  }

  componentDidUpdate(prevProps) {
    // Navigating from a filtered dashboard to a non-filtered dashboard triggers
    // an update but not a re-mount of this component. Therefore, we need to
    // re-fetch metric metadata with the latest value of whitelistedMetricIds
    // when the component is updated.
    //
    // Fetching the metadata itself causes an update of this component, so we
    // check that the value of whitelistedMetricIds actually changed since the
    // last update to avoid an infinite loop.
    if (this.props.whitelistedMetricIds !== prevProps.whitelistedMetricIds) {
      metricApi.getMetricMetadata(this.props.whitelistedMetricIds);
    }
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
