import React from 'react';

import Switch from './switch';
import { bumpSort } from '../../utils';


export default function(props) {
  const sortedSubgroups = bumpSort(props.currentDataset.subgroups, 'All');

  let maybeSubgroupSelector = null;
  if (sortedSubgroups.length > 1) {
    maybeSubgroupSelector = (
      <div className="dataset-subgroups">
        <select className="dataset-subgroup-selection" value={props.subgroup} onChange={props.handleSubgroupSelection}>
          {sortedSubgroups.map(subgroup => {
            return (
              <option key={subgroup} value={subgroup}>{subgroup}</option>
            );
          })}
        </select>
      </div>
    );
  }

  return (
    <section className="dataset-control-wrapper">
      <div className="dataset-config-content">
        <select className="dataset-selection" defaultValue={props.currentDataset.slug} onChange={props.handleDatasetSelection}>
          {props.datasets.map((dataset, index) => {
            return (
              <option key={index} value={dataset.slug}>{dataset.name || dataset.slug}</option>
            );
          })}
        </select>
      </div>
      {maybeSubgroupSelector}
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

          return (
            <Switch
                key={cohort}

                label={cohort}
                cohort={cohort}
                numClients={numClients}
                numPings={numPings}

                onClick={props.handleCohortSwitch}
                active={isActive}
            />
          );
        })}
      </div>
    </section>
  );
}
