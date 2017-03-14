import React from 'react';

import ChartContainer from '../containers/chart-container';
import DescriptionContainer from '../containers/description-container';
import ConfigurationContainer from '../containers/configuration-container';
import Legend from '../views/legend';


export default function(props) {
  let maybeLegend;
  if (props.whitelistedPopulations.length > 1) {
    maybeLegend = (
      <Legend
        whitelistedPopulations={props.whitelistedPopulations}
      />
    );
  }

  return (
    <div id="chart-detail" className="chart-detail">
      <ConfigurationContainer
        configurePopulations={true}
        configureOutliers={props.configurableOutliers}
        configureScale={props.configurableScale}

        whitelistedPopulations={props.whitelistedPopulations}

        showOutliers={props.showOutliers}
        scale={props.scale}

        location={props.location}
      />
      {maybeLegend}
      <ChartContainer
        metricId={props.metricId}
        isDetail={true}

        whitelistedPopulations={props.whitelistedPopulations}
        showOutliers={props.showOutliers}
        scale={props.scale}
      />
      <DescriptionContainer
        rawDescription={props.rawDescription}
        asTooltip={false}
      />
    </div>
  );
}
