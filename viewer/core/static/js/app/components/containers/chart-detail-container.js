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
      got404: false,
    };
  }

  componentDidMount() {
    metricApi.getMetric(this.props.datasetId, this.metricId, this.props.subgroupsToShow).then(result => {
      if (result && result.response && result.response.status === 404) {
        this.setState({got404: true});
      }
    });
  }

  render() {
    if (this.state.got404) {
      return <NotFound />;
    } else if (!this.props.metric || !this.props.isMetaAvailable) {
      return (
        <ChartDetail
          isFetching={true}
          metricId={this.metricId}

          {...this.props}
        />
      );
    } else {
      let configurableOutliers = false;
      let configurableScale = false;

      if (this.props.metric.type === 'numerical') {
        if (this.props.metric.populations[0].points.length >= 100) {
          configurableOutliers = true;
        }

        // The log of numbers <= 0 is undefined, so don't offer a logarithmic
        // scale option for datasets that include x-values <= 0.
        if (d3Array.min(this.props.metric.populations[0].points, d => d.b) > 0) {
          configurableScale = true;
        }
      }

      const rawDescription = this.props.metricMetadata[this.metricId].description;

      return (
        <ChartDetail
          {...this.props}

          isFetching={false}
          metricId={this.metricId}
          rawDescription={rawDescription}

          configurableOutliers={configurableOutliers}
          configurableScale={configurableScale}
        />
      );
    }
  }
}

const mapStateToProps = function(store, ownProps) {
  return {
    metric: store.metricState.metrics[parseInt(ownProps.params.metricId, 10)],
  };
};

export default connect(mapStateToProps)(ChartDetailContainer);
