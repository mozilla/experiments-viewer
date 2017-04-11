import React from 'react';
import { connect } from 'react-redux';

import * as metricApi from '../../api/metric-api';


/**
 * A container that does groundwork needed by several other components, like
 * processing URL parameters.
 */
class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this._processProps(props);

    this.datasetId = metricApi.getDatasetId(props.location);
    metricApi.getSubgroups(this.datasetId);
  }

  componentWillUpdate(nextProps) {
    this._processProps(nextProps);
  }

  _processProps(props) {
    this.whitelistedMetricIds = metricApi.getWhitelistedMetricIds(props.location);
    this.whitelistedSubgroups = metricApi.getWhitelistedSubgroups(props.location);

    this.subgroups = props.subgroups;

    // If the ?metrics query parameter is present but empty, the user must have
    // intentionally chosen that no metrics be shown.
    //
    // It's going to be pretty rare that a user will intentionally deselect all
    // metrics, but we need to honor that choice because the alternative
    // (showing all metrics when they deselect everything) is even more jarring.
    this.intentionallySelectedNoMetrics = false;
    if (Object.prototype.hasOwnProperty.call(props.location.query, 'metrics') && props.location.query.metrics === '') {
      this.intentionallySelectedNoMetrics = true;
    }

    switch(props.location.query.scale) {
      case 'linear':
      case 'log':
        this.scale = props.location.query.scale;
    }

    // Below, '=== "true"' is used to quickly validate the input.
    //
    // If the URL contains ?showOutliers=true, this.showOutliers will be true
    // If the URL contains ?showOutliers=false, this.showOutliers will be false
    // If the URL doesn't contain either of the above, this.showOutliers will be false
    this.showOutliers = props.location.query.showOutliers === 'true';
  }

  render() {
    // Pass some props to the child component
    return React.cloneElement(this.props.children, {
      whitelistedMetricIds: this.whitelistedMetricIds,
      whitelistedSubgroups: this.whitelistedSubgroups,
      datasetId: this.datasetId,
      subgroups: this.subgroups,
      intentionallySelectedNoMetrics: this.intentionallySelectedNoMetrics,
      scale: this.scale,
      showOutliers: this.showOutliers,
    });
  }
}

const mapStateToProps = function(store, ownProps) {
  return {
    subgroups: store.subgroupsState.subgroups,
  };
};

export default connect(mapStateToProps)(AppContainer);
