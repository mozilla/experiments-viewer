import React from 'react';
//import { Link } from 'react-router';

import ChartContainer from '../containers/chart-container';
import DescriptionContainer from '../containers/description-container';
import ConfigurationContainer from '../containers/configuration-container';
import Legend from '../views/legend';
import DatasetControlContainer from '../containers/dataset-control-container';
import * as utils from '../../utils';


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
      maybeTooltip = <DescriptionContainer rawDescription={thisMetricMetadata.description} asTooltip={true} keepLinebreaks={true} />;
    }

    chartLinks.push(
      // Temporarily disabling the links. See https://github.com/mozilla/experiments-viewer/issues/72
      // <Link key={id} className="chart-link" to={`/chart/${id}/?pop=${props.location.query.pop}&showOutliers=${props.location.query.showOutliers}`}>
      //  <div>
        <div key={id}>
          <ChartContainer
            {...props}

            metricId={id}
            isDetail={false}
            showOutliers={showOutliers}
            tooltip={maybeTooltip}
            xunit={thisMetricMetadata.units}
          />
        </div>
      // </Link>
    );
  });

  return (
    <article id="chart-list">
      <section className="chart-config">
        <DatasetControlContainer {...props} />
        <a className="configuration-link" onClick={utils.toggleConfigurationModal}>
          <img src="data:image/png;base64,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" />
        </a>
        <ConfigurationContainer
          {...props}

          configureOutliers={true}
          configurePopulations={true}
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
