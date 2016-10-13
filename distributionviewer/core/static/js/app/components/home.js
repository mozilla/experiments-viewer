import React from 'react';

import ChartListContainer from './containers/chart-list-container';
import ChartMenuContainer from './containers/chart-menu-container';
import * as metricApi from '../api/metric-api';


export default function(props) {
  return (
    <main>
      <ChartMenuContainer />
      <ChartListContainer whitelistedMetricIds={metricApi.getWhitelistedMetricIds(props.location)} />
    </main>
  );
}
