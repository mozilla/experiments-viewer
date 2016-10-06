import React from 'react';
import { connect } from 'react-redux';

import ChartDetail from '../views/chart-detail';
import NotFound from '../views/not-found';
import * as metricApi from '../../api/metric-api';


class ChartDetailContainer extends React.Component {
  constructor(props) {
    super(props);
    this.chartId = parseInt(this.props.params.chartId, 10);
  }

  componentDidMount() {
    metricApi.getMetric(this.chartId);
  }

  render() {
    if (this.props.status === 404) {
      return <NotFound />;
    } else {
      return (
        <ChartDetail
          id={this.chartId}
          metric={this.props.metric.metric}
          points={this.props.metric.points}
          type={this.props.metric.type}
        />
      );
    }
  }
}

const mapStateToProps = function(store) {
  return {
    metric: store.metricState.metric,
    status: store.metricState.status,
  };
};

export default connect(mapStateToProps)(ChartDetailContainer);
