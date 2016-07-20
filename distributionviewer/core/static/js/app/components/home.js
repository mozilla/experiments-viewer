import React from 'react';
import { ChartListContainer } from './containers/chart-list-container';
import ExampleReduxChartContainer from './containers/example-redux-chart-container';

export default function(props) {
  return (
    <main>
      <ChartListContainer />
      <ExampleReduxChartContainer />
    </main>
  );
}
