import React from 'react';
import ExampleChartContainer from '../containers/example-chart-container';

export default function(props) {
  var charts = [];

  for (var i = 0; i < props.numCharts; i++) {
    charts.push(<ExampleChartContainer key={i} width={350} height={250} link={true} />);
  }

  return (
    <section className="chart-list">
      {charts}
    </section>
  );
}
