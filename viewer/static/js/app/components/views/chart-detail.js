import React from 'react';

import ChartContainer from '../containers/chart-container';
import DescriptionContainer from '../containers/description-container';
import ConfigurationContainer from '../containers/configuration-container';
import LegendContainer from '../containers/legend-container';


export default function(props) {
  return (
    <div id="chart-detail" className="chart-detail">
      <ConfigurationContainer
        configurePopulations={true}
        configureOutliers={props.configurableOutliers}
        configureScale={props.configurableScale}

        {...props}
      />
      <LegendContainer {...props} />
      <ChartContainer isDetail={true} {...props} />
      <DescriptionContainer asTooltip={false} keepLinebreaks={true} {...props} />
    </div>
  );
}
