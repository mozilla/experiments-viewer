import React from 'react';

import ChartContainer from '../containers/chart-container';
import DescriptionContainer from '../containers/description-container';
import ConfigurationContainer from '../containers/configuration-container';
import Legend from '../views/legend';


export default function(props) {
  return (
    <div id="chart-detail" className="chart-detail">
      <ConfigurationContainer
        configurePopulations={true}
        configureOutliers={props.configurableOutliers}
        configureScale={props.configurableScale}

        {...props}
      />
      <Legend {...props} />
      <ChartContainer isDetail={true} {...props} />
      <DescriptionContainer asTooltip={false} {...props} />
    </div>
  );
}
