import React from 'react';

import Switch from './switch';
import { bumpSort, getCountString } from '../../utils';


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
      <div className="dataset-populations">
        {props.sortedAllPopulations.map(populationName => {
          const isActive = props.sortedPopulationsToShow.includes(populationName);
          const populationMeta = props.currentDataset.populations[populationName];
          const countString = getCountString(populationMeta.total_clients, populationMeta.total_pings);

          return (
            <Switch
                key={populationName}

                label={populationName}
                populationName={populationName}
                countString={countString}

                onClick={props.handleCohortSwitch}
                active={isActive}
            />
          );
        })}
      </div>
    </section>
  );
}
