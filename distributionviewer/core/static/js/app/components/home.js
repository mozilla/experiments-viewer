import React from 'react';
import FilteredChartsContainer from './containers/filtered-charts-container';
import { ChartListContainer } from './containers/chart-list-container';
import ExampleReduxChartContainer from './containers/example-redux-chart-container';

export default function(props) {
  return (
    <main>
      <FilteredChartsContainer>
        <ChartListContainer />
        <ExampleReduxChartContainer />
      </FilteredChartsContainer>
    </main>
  );
}
