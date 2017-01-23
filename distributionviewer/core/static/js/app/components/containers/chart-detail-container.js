import React from 'react';
import { connect } from 'react-redux';
import * as d3Array from 'd3-array';

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
      selectedScale: 'linear',
    };

    this._toggleOutliers = this._toggleOutliers.bind(this);
    this._selectScale = this._selectScale.bind(this);
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

  _selectScale(event) {
    this.setState({selectedScale: event.target.value});
  }

  render() {
    if (this.state.got404) {
      return <NotFound />;
    } else if (!this.props.metric || !this.props.isMetaAvailable) {
      return <ChartDetail isFetching={true} metricId={this.metricId} />;
    } else {
      let offerScaleOption = false;
      let offerOutliersToggle = false;

      if (this.props.metric.type === 'numeric') {

        // The log of numbers <= 0 is undefined, so don't offer a logarithmic
        // scale option for datasets that include x-values <= 0.
        if (d3Array.min(this.props.metric.populations[0].points, d => d.b) > 0) {
          offerScaleOption = true;
        }

        if (this.props.metric.populations[0].points.length >= 100) {
          offerOutliersToggle = true;
        }
      }

      const rawDescription = this.props.metadata.find(e => e.id === this.metricId).description;

      return (
        <ChartDetail
          isFetching={false}
          metricId={this.metricId}
          rawDescription={rawDescription}

          offerOutliersToggle={offerOutliersToggle}
          toggleOutliers={this._toggleOutliers}
          showOutliers={this.state.showOutliers}

          offerScaleOption={offerScaleOption}
          selectScale={this._selectScale}
          selectedScale={this.state.selectedScale}
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
