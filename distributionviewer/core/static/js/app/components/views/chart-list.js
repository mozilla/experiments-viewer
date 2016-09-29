import React from 'react';

import ChartContainer from '../containers/chart-container';


export default function(props) {
  return (
    <section className="chart-list">
      {props.items.map(chart => {
        return (
          <ChartContainer key={chart.name} isDetail={false} chartId={chart.id} chartName={chart.name} showOutliers={false} />
        );
      })}
    </section>
  );
}
