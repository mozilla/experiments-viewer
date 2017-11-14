import React from 'react';

import ChartContainer from '../containers/chart-container';
import DescriptionContainer from '../containers/description-container';
import LegendContainer from '../containers/legend-container';
import DatasetControlContainer from '../containers/dataset-control-container';
import * as urlApi from '../../api/url-api';


export default function(props) {
  let charts = [];

  props.metricIdsToShow.map(id => {
    const thisMetricMetadata = props.metricMetadata[id];

    // Don't show anything if we don't have metadata for this metric ID yet
    if (!thisMetricMetadata) return;

    let maybeTooltip;
    if (thisMetricMetadata.description) {
      maybeTooltip = <DescriptionContainer rawDescription={thisMetricMetadata.description} asTooltip={true} keepLinebreaks={true} />;
    }

    charts.push(
      <div key={id}>
        <ChartContainer
          {...props}

          metricId={id}
          isDetail={false}
          tooltip={maybeTooltip}
          xunit={thisMetricMetadata.units}
        />
      </div>
    );
  });

  const _handleModifyOutliers = event => {
    // Force window refresh with updated query params (modern browser suppport only).
    if ('URLSearchParams' in window) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('showOutliers', event.target.checked);
      window.location.search = searchParams.toString();
    } else {
      urlApi.updateQueryParameter('showOutliers', event.target.checked);
    }
  }

  return (
    <article id="chart-list">
      <section className="chart-config">
        <DatasetControlContainer {...props} />
        <div className="configure-outliers">
          <label>
            <input type="checkbox" defaultChecked={props.showOutliers} onChange={_handleModifyOutliers} />
            show outliers
          </label>
        </div>
        <LegendContainer {...props} />
      </section>
      <section className="charts">{charts}</section>
    </article>
  );
}
