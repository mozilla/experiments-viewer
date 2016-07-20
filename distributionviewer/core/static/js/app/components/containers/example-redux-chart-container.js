import React from 'react';
import { connect } from 'react-redux';
import ExampleReduxChart from '../views/example-redux-chart';
import * as chartApi from '../../api/chart-api';


class ExampleReduxChartContainer extends React.Component {
  componentDidMount() {
    chartApi.getCharts();
  }

  render() {
    return (
      <ExampleReduxChart {...this.props} />
    );
  }
}

const mapStateToProps = function(store) {
  return {
    charts: store.chartState.charts
  };
}

export default connect(mapStateToProps)(ExampleReduxChartContainer);
