import React from 'react';
import FilteredChartsContainer from './containers/filtered-charts-container';
import ChartListContainer from './containers/chart-list-container';


export default function(props) {
  return (
    <main>
      <FilteredChartsContainer>
        <ChartListContainer />
      </FilteredChartsContainer>
    </main>
  );
}
