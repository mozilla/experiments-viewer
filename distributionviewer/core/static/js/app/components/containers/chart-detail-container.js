import React from 'react';
import { connect } from 'react-redux';

import ChartDetail from '../views/chart-detail';
import NotFound from '../views/not-found';
import * as metricApi from '../../api/metric-api';


class ChartDetailContainer extends React.Component {
  constructor(props) {
    super(props);
    this.metricId = parseInt(props.params.metricId, 10);
    this.state = {got404: false};
  }

  componentDidMount() {
    metricApi.getMetric(this.metricId).then(result => {
      if (result && result.response && result.response.status === 404) {
        this.setState({got404: true});
      }
    });
  }

  render() {
    if (this.state.got404) {
      return <NotFound />;
    } else if (!this.props.metric) {
      return <ChartDetail isFetching={true} metricId={this.metricId} />;
    } else {
      return (
        <ChartDetail
          isFetching={false}
          metricId={this.metricId}
          type={this.props.metric.type}
          numPoints={this.props.metric.points.length}
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
