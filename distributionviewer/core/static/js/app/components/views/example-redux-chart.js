import React from 'react';


export default function(props) {
  return (
    <section className="redux-chart-list">
      {props.charts.map(chart => {
        return (<p>{chart.name}</p>);
      })}
    </section>
  );
};
