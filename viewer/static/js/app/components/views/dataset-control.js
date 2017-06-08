import React from 'react';

import Switch from './switch';
import Button from './button';


/**
 * Sort an array of subgroups such that "All" is the first element of the array
 * and the rest appear in alphabetical order.
 */
function sortSubgroups(subgroups) {
  const sgCopy = subgroups.slice();
  const allIndex = sgCopy.indexOf('All');
  const all = sgCopy.splice(allIndex, 1);
  return all.concat(sgCopy.sort());
}

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
        <Button
          label="apply"
          isDisabled={props.isBtnDisabled}
          extraClasses={['alt', 'btn-small', 'apply-config']}
          handleClick={props.handleApplyButton}
        />
      </div>
      <div className="dataset-subgroups">
        <select className="dataset-subgroup-selection" value={props.subgroup} onChange={props.handleSubgroupSelection}>
          {sortSubgroups(props.currentDataset.subgroups).map(subgroup => {
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
