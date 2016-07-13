import React from 'react';


export default function(props) {
  return (
    <div>
      {props.charts.map(chart => {
        return (<p>{chart.name}</p>);
      })}
    </div>
  );
};
