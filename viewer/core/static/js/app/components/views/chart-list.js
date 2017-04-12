import React from 'react';
import { Link } from 'react-router';

import ChartContainer from '../containers/chart-container';
import DescriptionContainer from '../containers/description-container';
import ConfigurationContainer from '../containers/configuration-container';
import Legend from '../views/legend';
import DatasetControlContainer from '../containers/dataset-control-container';


export default function(props) {
  // We can't do anything until the metadata is loaded
  if (!props.metadata || Object.keys(props.metadata).length === 0) return null;

  let chartLinks = [];

  // If the user intentionally selected no metrics (that is, if the ?metrics
  // query parameter is present but empty), honor that request. If the query
  // parameter is not present, show all metrics. Otherwise, show the metrics
  // they selected.
  let chartIdsToShow;
  if (props.intentionallySelectedNoMetrics) {
    chartIdsToShow = [];
  } else if (props.whitelistedMetricIds === undefined) {
    chartIdsToShow = Object.keys(props.metadata);
  } else {
    chartIdsToShow = props.whitelistedMetricIds;
  }

  chartIdsToShow.map(id => {
    const metricMeta = props.metadata[id];
    let showOutliers = props.showOutliers;

    // Always show outliers in categorical charts. Outlying categories don't make
    // charts unreadable in the same way that outlying data points do.
    if (metricMeta.type === 'categorical') {
      showOutliers = true;
    }

    let maybeTooltip;
    if (metricMeta.description) {
      maybeTooltip = <DescriptionContainer rawDescription={metricMeta.description} asTooltip={true} />;
    }

    chartLinks.push(
      <Link key={id} className="chart-link" to={`/chart/${id}/?sg=${props.whitelistedSubgroups.join(',')}&showOutliers=${props.showOutliers}`}>
        <div>
          <ChartContainer
            {...props}

            metricId={id}
            isDetail={false}
            showOutliers={showOutliers}
            tooltip={maybeTooltip}
          />
        </div>
      </Link>
    );
  });

  return (
    <article id="chart-list">
      <section className="chart-config">
        <DatasetControlContainer />
        <ConfigurationContainer
          {...props}

          configureOutliers={true}
          configureSubgroups={true}
          configureCharts={true}
        />
      </section>
      <Legend {...props} />
      <section className="charts">
        {chartLinks}
      </section>
    </article>
  );
}
