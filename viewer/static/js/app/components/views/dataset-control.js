import React from 'react';

import Switch from './switch';
import Button from './button';
import { bumpSort } from '../../utils';


export default function(props) {
  const sortedSubgroups = bumpSort(props.currentDataset.subgroups, 'All');

  return (
    <section className="dataset-control-wrapper">
      <div className="dataset-config-content">
        <select className="dataset-selection" value={props.selectedDataset} onChange={props.handleDatasetSelection}>
          {props.datasets.map(dataset => {
            return (
              <option key={dataset.name} value={dataset.name}>{dataset.name}</option>
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
          return (
            <Switch key={cohort} label={cohort} onClick={props.handleCohortSwitch} active={isActive} />
          );
        })}
      </div>
    </section>
  );
}
