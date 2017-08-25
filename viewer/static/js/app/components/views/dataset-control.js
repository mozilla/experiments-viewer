import React from 'react';

import Switch from './switch';
import Button from './button';
import { bumpSort } from '../../utils';


export default function(props) {
  const sortedSubgroups = bumpSort(props.currentDataset.subgroups, 'All');

  return (
    <section className="dataset-control-wrapper">
      <div className="dataset-config-content">
        <select className="dataset-selection" defaultValue={props.currentDataset.name} onChange={props.handleDatasetSelection}>
          {props.datasets.map((dataset, index) => {
            return (
              <option key={index} value={dataset.name}>{dataset.name}</option>
            );
          })}
        </select>
        <Button
          label="apply"
          isDisabled={props.isBtnDisabled}
          extraClasses={['alt', 'btn-small', 'apply-config']}
          handleClick={props.handleApplyButton}
        />
      </div>
      <div className="dataset-subgroups">
        <select className="dataset-subgroup-selection" value={props.subgroup} onChange={props.handleSubgroupSelection}>
          {sortedSubgroups.map(subgroup => {
            return (
              <option key={subgroup} value={subgroup}>{subgroup}</option>
            );
          })}
        </select>
      </div>
      <div className="dataset-cohorts">
        {props.sortedAllPopulations.map(cohort => {
          const isActive = props.sortedPopulationsToShow.includes(cohort);
          const cohortMeta = props.currentDataset.populations[cohort];

          let numClients = 0;
          if (cohortMeta.total_clients) {
            numClients = cohortMeta.total_clients.toLocaleString('en-US');
          }

          let numPings = 0;
          if (cohortMeta.total_pings) {
            numPings = cohortMeta.total_pings.toLocaleString('en-US');
          }

          let maybeCounts = null;
          if (numClients !== 0 && numPings !== 0) {
              maybeCounts = (
                <span className="cohort-counts">({numClients} clients / {numPings} pings)</span>
              );
          }

          return (
            <div key={cohort} className={`switch-and-counts ${cohort}`}>
              <Switch key={cohort} label={cohort} onClick={props.handleCohortSwitch} active={isActive} />
              {maybeCounts}
            </div>
          );
        })}
      </div>
    </section>
  );
}
