import React from 'react';


export default function(props) {
  return (
    <div id="chart-config">
      <h2>Dashboard Configuration</h2>
      <p>Choose metrics to display:</p>
      {props.metadata.map(metric => {
        var checked = props.qmetrics.indexOf(metric.id) > -1;
        return (
          <label key={metric.id}><input type="checkbox" defaultChecked={checked} name="metrics" value={metric.id} />{metric.name}: {metric.description}</label>
        );
      })}
      <button onClick={props.handleSubmit}>Go!</button>
    </div>
  );
}
