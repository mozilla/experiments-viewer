import React from 'react';

import Fetching from './fetching';
import ChartAxisContainer from '../containers/chart-axis-container';
import ChartLineContainer from '../containers/chart-line-container';
import ChartHoverContainer from '../containers/chart-hover-container';
import ChartFocus from './chart-focus';


export default function(props) {
  if (props.isFetching) {
    return (
      <div className={`chart is-fetching chart-${props.metricId}`}>
        <Fetching />
      </div>
    );
  } else {
    return (
      <div className={`chart chart-${props.metricId} ${props.tooltip ? 'tooltip-wrapper' : ''}`}>
        <h2 className={`chart-list-name ${props.tooltip ? 'tooltip-hover-target' : ''}`}>{props.name}</h2>
        {props.tooltip}
        <svg width={props.size.width} height={props.size.height}>
          <g transform={props.size.transform}>
            <ChartAxisContainer
              metricId={props.metricId}
              metricType={props.metricType}
              scale={props.xScale}
              axisType="x"
              refLabels={props.refLabels}
              size={props.size.innerHeight}
            />
            <ChartAxisContainer
              metricId={props.metricId}
              scale={props.yScale}
              axisType="y"
              refLabels={props.refLabels}
              size={props.size.innerWidth}
            />
            <ChartLineContainer
              metricId={props.metricId}
              xScale={props.xScale}
              yScale={props.yScale}
              data={props.data}
            />
            <ChartFocus />
            <ChartHoverContainer
              metricId={props.metricId}
              size={props.size}
              xScale={props.xScale}
              yScale={props.yScale}
              hoverString={props.hoverString}
              refLabels={props.refLabels}
              metricType={props.metricType}
              data={props.data}
            />
          </g>
        </svg>
      </div>
    );
  }
}
