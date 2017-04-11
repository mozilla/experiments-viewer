import React from 'react';

import ChartContainer from '../containers/chart-container';
import DescriptionContainer from '../containers/description-container';
import ConfigurationContainer from '../containers/configuration-container';
import Legend from '../views/legend';


export default function(props) {
  let maybeLegend;
  if (props.whitelistedSubgroups.length > 1) {
    maybeLegend = (
      <Legend {...props} />
    );
  }

  return (
    <div id="chart-detail" className="chart-detail">
      <ConfigurationContainer
        configureSubgroups={true}
        configureOutliers={props.configurableOutliers}
        configureScale={props.configurableScale}

        {...props}
      />
      {maybeLegend}
      <ChartContainer isDetail={true} {...props} />
      <DescriptionContainer asTooltip={false} {...props} />
    </div>
  );
}
