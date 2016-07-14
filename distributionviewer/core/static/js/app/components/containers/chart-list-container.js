import React from 'react';
import ChartList from '../views/chart-list';

// numCharts is updated and provided to ChartList just for demonstration
// purposes, and so that ChartList doesn't just have to include <ExampleChart />
// 30 times in its source.
const ChartListContainer = React.createClass({
  getInitialState: function() {
    return {
      numCharts: 0
    }
  },

  componentDidMount: function() {
    this.setState({numCharts: 30})
  },

  render: function() {
    return (
      <ChartList numCharts={this.state.numCharts} />
    );
  }
});

export default ChartListContainer;
