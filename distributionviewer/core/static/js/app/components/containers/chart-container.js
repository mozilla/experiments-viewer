import React from 'react';
import { connect } from 'react-redux';

import { Chart } from '../views/chart';


class ChartContainer extends React.Component {
  render() {
    return (
      <Chart isDataReady={this.props.isDataReady} chartName={this.props.chartName} {...this.props} />
    );
  }
}

ChartContainer.propTypes = {
  chartName: React.PropTypes.string.isRequired,
  isDataReady: React.PropTypes.bool.isRequired,
  item: React.PropTypes.object.isRequired,
}

const mapStateToProps = function(store) {
  return {
    isDataReady: store.metricState.isDataReady,
    isFetching: store.metricState.isFetching,
    item: store.metricState.item,
    status: store.metricState.status
  };
}

export default connect(mapStateToProps)(ChartContainer);
