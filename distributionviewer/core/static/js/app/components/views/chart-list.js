import React from 'react';
import { Link } from 'react-router';

import ChartContainer from '../containers/chart-container';
import DescriptionContainer from '../containers/description-container';
import LegendContainer from '../containers/legend-container';


export default function(props) {
  let chartLinks = [];
  let firstMetricId;

  props.metadata.map(metricMeta => {
    if (firstMetricId === undefined) firstMetricId = metricMeta.id;

    // Always show outliers in categorical charts. Outlying categories don't make
    // charts unreadable in the same way that outlying data points do.
    //
    // For all other chart types, we want outliers to be hidden in chart
    // listings by default.
    const showOutliers = metricMeta.type === 'categorical';

    const tooltip = <DescriptionContainer rawDescription={metricMeta.description} asTooltip={true} />;
    chartLinks.push(
      <Link key={metricMeta.id} className="chart-link" to={`/chart/${metricMeta.id}/?pop=${props.whitelistedPopulations.join(',')}`}>
        <div>
          <ChartContainer
            metricId={metricMeta.id}
            isDetail={false}
            showOutliers={showOutliers}
            tooltip={tooltip}
            whitelistedPopulations={props.whitelistedPopulations}
          />
        </div>
      </Link>
    );
  });

  let maybeLegendContainer;
  if (firstMetricId && props.whitelistedPopulations.length > 1) {
    maybeLegendContainer = (
      <LegendContainer
        // In chart listings, all charts show the same populations, so it
        // doesn't really matter which one the legend subscribes to.
        metricId={firstMetricId}

        whitelistedPopulations={props.whitelistedPopulations}
      />
    );
  }

  return (
    <article id="chart-list">
      {maybeLegendContainer}
      <section className="charts">
        {chartLinks}
      </section>
    </article>
  );
}
