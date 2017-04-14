import React from 'react';


export default function(props) {
  let maybeDataFieldset, maybeSubgroupsFieldset, maybeChartsFieldset;

  if (props.configureOutliers || props.configureScale) {
    maybeDataFieldset = (
      <fieldset className="configure-data">
        <legend>Data</legend>

        {props.configureOutliers &&
          <div className="configure-outliers">
            <label>
              <input type="checkbox" defaultChecked={props.showOutliers} onChange={props.handleModifyOutliers} />
              Show outliers
            </label>
          </div>
        }

        {props.configureScale &&
          <div className="configure-scale radio-list">
            <span>Scale</span>
            <label><input className="linear" type="radio" name="scale" value="linear" checked={props.scale === 'linear'} onChange={props.handleModifyScale} />Linear</label>
            <label><input className="log" type="radio" name="scale" value="log" checked={props.scale === 'log'} onChange={props.handleModifyScale} />Log</label>
          </div>
        }

      </fieldset>
    );
  }

  if (props.configureSubgroups) {
    maybeSubgroupsFieldset = (
      <fieldset className={`${props.configureSubgroupsClass} checkbox-list`} onChange={props.handleModifySubgroups}>
        <legend>Cohorts</legend>
        {props.allSubgroups.map(sg => {
          const checked = props.subgroupsToShow && props.subgroupsToShow.indexOf(sg) > -1;
          return (
            <label key={sg}>
              <input type="checkbox" className="cb-subgroups" defaultChecked={checked} name="subgroups" value={sg} />
              {sg}
            </label>
          );
        })}
      </fieldset>
    );
  }

  if (props.configureCharts) {
    maybeChartsFieldset = (
      <fieldset className={`${props.configureChartsClass} checkbox-list`} onChange={props.handleModifyCharts}>
        <legend>Charts</legend>

        {props.allMetricIds.map(id => {
          const metricMeta = props.metricMetadata[id];
          const checkedByDefault = props.metricIdsToShow.indexOf(parseInt(id, 10)) > -1;

          return (
            <label key={id}>
              <input type="checkbox" className="cb-metrics" defaultChecked={checkedByDefault} name="metrics" value={id} />
              {metricMeta.name}{metricMeta.description ? `: ${metricMeta.description}` : ''}
            </label>
          );
        })}
      </fieldset>
    );
  }

  return (
    <details className="configuration">
      <summary>Configuration</summary>
      <form>
        {maybeSubgroupsFieldset}
        {maybeDataFieldset}
        {maybeChartsFieldset}
      </form>
    </details>
  );
}
