import React from 'react';


export default function(props) {
  let maybeDataFieldset, maybePopulationsFieldset, maybeChartsFieldset;

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

  if (props.configurePopulations) {
    maybePopulationsFieldset = (
      <fieldset className={`${props.configurePopulationsClass} checkbox-list`} onChange={props.handleModifyPopulations}>
        <legend>Populations</legend>
        {props.populationObjects.map(p => {
          const checked = props.whitelistedPopulations && props.whitelistedPopulations.indexOf(p.key) > -1;
          return (
            <label key={p.key}>
              <input type="checkbox" className="cb-pops" defaultChecked={checked} name="pops" value={p.key} />
              {p.name}
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

        {Object.keys(props.metricMetadata).map(id => {
          const metricMeta = props.metricMetadata[id];

          let checkedByDefault = false;

          // When the ?metrics query parameter is empty but not present, we know
          // that the user intentionally chose to show no metrics. Don't check
          // any checkboxes as checked to illustrate this.
          if (props.intentionallySelectedNoMetrics) {
            checkedByDefault = false;

          // When the ?metrics query parameter is not present, all charts are
          // shown. Show all chart checkboxes as checked to illustrate this.
          } else if (!props.whitelistedMetricIds) {
            checkedByDefault = true;

          // Otherwise, only show a checkbox as checked if the corresponding
          // metric ID *is* whitelisted in the ?metrics query parameter
          } else if (props.whitelistedMetricIds.indexOf(Number(id)) > -1) {
            checkedByDefault = true;
          }

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
        {maybeDataFieldset}
        {maybePopulationsFieldset}
        {maybeChartsFieldset}
      </form>
    </details>
  );
}
