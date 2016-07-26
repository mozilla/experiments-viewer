import React from 'react';


export default function ExampleReduxChart(props) {
  return (
    <section className="redux-chart-list">
      {props.charts.map(chart => {
        return (<p>{chart.name}</p>);
      })}
    </section>
  );
}

ExampleReduxChart.propTypes = {
  charts: React.PropTypes.node.isRequired,
}
