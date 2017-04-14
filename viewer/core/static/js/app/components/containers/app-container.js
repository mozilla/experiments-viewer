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

    // Defaults
    this.metricIdsToShow = this.allSubgroups = [];
  }

  _isALL(qpKey) {
    return qpKey && qpKey === 'ALL';
  }

  _processProps(props) {
    this.datasetId = metricApi.getDatasetId(props.location);

    const showAllMetrics = this._isALL(props.location.query.metrics);
    const showAllSubgroups = this._isALL(props.location.query.sg);

    this.allMetricIds = Object.keys(props.metricMetadata);
    if (showAllMetrics) {
      this.metricIdsToShow = this.allMetricIds;
    } else {
      this.metricIdsToShow = metricApi.getSpecifiedMetricIds(props.location);
    }
    this.metricIdsToShow = this.metricIdsToShow.map(id => parseInt(id, 10));

    this.allSubgroups = props.subgroups;
    if (showAllSubgroups) {
      this.subgroupsToShow = this.allSubgroups;
    } else {
      this.subgroupsToShow = metricApi.getSpecifiedSubgroups(props.location);
    }

    // Validate input
    switch(props.location.query.scale) {
      case 'linear':
      case 'log':
        this.scale = props.location.query.scale;
    }

    // Validate input and convert to boolean
    //
    // If the URL contains...  |  this.showOutliers is...
    // --------------------------------------------------
    // showOutliers=true       |  true
    // showOutliers=false      |  false
    // Anything else           |  false
    this.showOutliers = props.location.query.showOutliers === 'true';
  }

  componentDidMount() {
    metricApi.getMetricMetadata();
    metricApi.getSubgroups(this.datasetId);
  }

  componentWillUpdate(nextProps) {
    this._processProps(nextProps);
  }

  render() {
    // If we don't have the names of all subgroups yet, we can't render any
    // charts. We could in theory temporarily show the "No data" message until
    // the subgroup names come through, but that would look odd.
    if (this.props.subgroups.length === 0) return null;

    // Pass some props to the child component
    return React.cloneElement(this.props.children, {
      datasetId: this.datasetId,
      scale: this.scale,
      showOutliers: this.showOutliers,

      metricMetadata: this.props.metricMetadata,

      metricIdsToShow: this.metricIdsToShow,
      subgroupsToShow: this.subgroupsToShow,

      allMetricIds: this.allMetricIds,
      allSubgroups: this.allSubgroups,
    });
  }
}

const mapStateToProps = function(store, ownProps) {
  return {
    subgroups: store.subgroupsState.subgroups,
    metricMetadata: store.metricMetadataState.metadata,
  };
};

export default connect(mapStateToProps)(AppContainer);
