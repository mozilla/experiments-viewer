import React from 'react';
import { connect } from 'react-redux';

import ChartDetail from '../views/chart-detail';
import NotFound from '../views/not-found';
import * as metricApi from '../../api/metric-api';


class ChartDetailContainer extends React.Component {
  constructor(props) {
    super(props);
    this.metricId = parseInt(props.params.metricId, 10);
    this.state = {
      showOutliers: false,
      got404: false,
    };

    this._toggleOutliers = this._toggleOutliers.bind(this);
  }

  componentDidMount() {
    // Fetch metadata if needed for hoverStrings and descriptions
    if (!this.props.isMetaAvailable) {
      metricApi.getMetricMetadata();
    }
    metricApi.getMetric(this.metricId).then(result => {
      if (result && result.response && result.response.status === 404) {
        this.setState({got404: true});
      }
    });
  }

  _toggleOutliers(event) {
    this.setState({showOutliers: event.target.checked});
  }

  render() {
    if (this.state.got404) {
      return <NotFound />;
    } else if (!this.props.metric || !this.props.isMetaAvailable) {
      return <ChartDetail isFetching={true} metricId={this.metricId} />;
    } else {
      let offerOutliersToggle = false;
      if (this.props.metric.type === 'numeric' && this.props.metric.numPoints >= 100) {
        offerOutliersToggle = true;
      }

      const rawDescription = this.props.metadata.find(e => e.id === this.metricId).description;

      return (
        <ChartDetail
          isFetching={false}
          metricId={this.metricId}
          offerOutliersToggle={offerOutliersToggle}
          toggleOutliers={this._toggleOutliers}
          showOutliers={this.state.showOutliers}
          rawDescription={rawDescription}
        />
      );
    }
  }
}

const mapStateToProps = function(store, ownProps) {
  return {
    metric: store.metricState.metrics[parseInt(ownProps.params.metricId, 10)],
    isMetaAvailable: !!store.metricMetadataState.metadata.length,
    metadata: store.metricMetadataState.metadata,
  };
};

export default connect(mapStateToProps)(ChartDetailContainer);
