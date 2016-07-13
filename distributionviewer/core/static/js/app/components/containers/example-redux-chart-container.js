import React from 'react';
import { connect } from 'react-redux';
import ExampleReduxChart from '../views/example-redux-chart';
import * as chartApi from '../../api/chart-api';


const ExampleReduxChartContainer = React.createClass({
  componentDidMount: function() {
    chartApi.getCharts();
  },
  render: function() {
    return (
      <ExampleReduxChart {...this.props} />
    );
  }
});

const mapStateToProps = function(store) {
  return {
    charts: store.chartState.charts
  };
}

export default connect(mapStateToProps)(ExampleReduxChartContainer);
