import React from 'react';

import Switch from './switch';


export default function(props) {
  return (
    <div className="dataset-config-content">
      <select className="dataset-selection">
        {props.datasets.map(dataset => {
          return (
            <option key={dataset.id} value={dataset.id}>{dataset.name}</option>
          );
        })}
      </select>
      <div className="dataset-cohorts">
        {props.currentDataset.populations.map(cohort => {
          return (
            <Switch key={cohort} label={cohort} />
          );
        })}
      </div>
      <button className="button btn-small apply-config" onClick={props.handleDatasetChange}>apply</button>
    </div>
  );
}
