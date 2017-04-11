import React from 'react';


export default function(props) {
  return (
    <div className="dataset-config-content">
      <select className="dataset-selection">
        <option key="1" value="1">Experiment 1</option>
        <option key="2" value="2">Experiment 2</option>
      </select>
      <button className="button btn-small apply-config">apply</button>
    </div>
  );
}

/*
<div className="dataset-cohorts">
  {props.datasets.populations.map(dataset => {
    return (
      <span>{dataset.name}</span>
    );
  })}
</div>
*/
