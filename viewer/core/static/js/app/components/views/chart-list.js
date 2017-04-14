import React from 'react';
import { Link } from 'react-router';

import ChartContainer from '../containers/chart-container';
import DescriptionContainer from '../containers/description-container';
import ConfigurationContainer from '../containers/configuration-container';
import Legend from '../views/legend';
import DatasetControlContainer from '../containers/dataset-control-container';


export default function(props) {
  let chartLinks = [];

  props.metricIdsToShow.map(id => {
    const thisMetricMetadata = props.metricMetadata[id];
    let showOutliers = props.showOutliers;

    // Always show outliers in categorical charts. Outlying categories don't make
    // charts unreadable in the same way that outlying data points do.
    if (thisMetricMetadata.type === 'categorical') {
      showOutliers = true;
    }

    let maybeTooltip;
    if (thisMetricMetadata.description) {
      maybeTooltip = <DescriptionContainer rawDescription={thisMetricMetadata.description} asTooltip={true} />;
    }

    chartLinks.push(
      <Link key={id} className="chart-link" to={`/chart/${id}/?sg=${props.location.query.sg}&showOutliers=${props.location.query.showOutliers}`}>
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
