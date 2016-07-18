import React from 'react';
import ChartList from './containers/chart-list-container';
import ExampleReduxChartContainer from './containers/example-redux-chart-container';


export default function(props) {
  return (
    <div>
      <ChartList />
      <ExampleReduxChartContainer />
    </div>
  );
}
