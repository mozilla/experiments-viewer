import React from 'react';

import ChartContainer from '../containers/chart-container';


export default function(props) {
  let outliersToggle = '';
  if (props.offerOutliersToggle) {
    outliersToggle = <label className="show-outliers"><input type="checkbox" defaultChecked={props.showOutliers} onChange={props.toggleOutliers} />Show outliers</label>
  }

  return (
    <div id="chart-detail" className="chart-detail">
      {outliersToggle}
      <ChartContainer isDetail={true} showOutliers={props.showOutliers} metricId={props.metricId} />
    </div>
  );
}
