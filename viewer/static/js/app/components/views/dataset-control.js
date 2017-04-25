import React from 'react';

import Switch from './switch';


export default function(props) {
  return (
    <section className="dataset-control-wrapper">
      <div className="dataset-config-content">
        <select className="dataset-selection" value={props.currentDatasetId} onChange={props.handleDatasetSelection}>
          {props.datasets.map(dataset => {
            return (
              <option key={dataset.id} value={dataset.id}>{dataset.name}</option>
            );
          })}
        </select>
        <button className="button btn-small apply-config" onClick={props.handleApplyButton}>apply</button>
      </div>
      <div className="dataset-cohorts">
        {props.currentDataset.populations.map(cohort => {
          const isActive = props.subgroupsToShow.includes(cohort);
          return (
            <Switch key={cohort} label={cohort} onClick={props.handleCohortSwitch} active={isActive} />
          );
        })}
      </div>
    </section>
  );
}
