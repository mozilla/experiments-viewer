import React from 'react';

import ChartContainer from '../containers/chart-container';
import DescriptionContainer from '../containers/description-container';


export default function(props) {
  let outliersToggle = '';
  let scaleOption = '';

  if (props.offerOutliersToggle) {
    outliersToggle = <label className="show-outliers"><input type="checkbox" defaultChecked={props.showOutliers} onChange={props.toggleOutliers} />Show outliers</label>;
  }

  if (props.offerScaleOption) {
    scaleOption = (
      <div className="scale">
        <label><input type="radio" name="scale" value="linear" checked={props.selectedScale === 'linear'} onChange={props.selectScale} />Linear</label>
        <label><input type="radio" name="scale" value="log" checked={props.selectedScale === 'log'} onChange={props.selectScale} />Log</label>
      </div>
    );
  }

  return (
    <div id="chart-detail" className="chart-detail">
      <div className="options">
        {outliersToggle}
        {scaleOption}
      </div>
      <ChartContainer isDetail={true} showOutliers={props.showOutliers} selectedScale={props.selectedScale} metricId={props.metricId} />
      <DescriptionContainer rawDescription={props.rawDescription} asTooltip={false} />
    </div>
  );
}
