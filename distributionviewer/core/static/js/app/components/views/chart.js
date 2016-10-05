import React from 'react';

import ChartAxisContainer from '../containers/chart-axis-container';
import ChartLineContainer from '../containers/chart-line-container';
import ChartHoverContainer from '../containers/chart-hover-container';
import ChartFocus from './chart-focus';
import ChartTooltip from './chart-tooltip';


export default function(props) {
  return (
    <div className={`chart chart-${props.id}`}>
      <ChartTooltip />
      <svg width={props.size.width} height={props.size.height}>
        <g transform={props.size.transform}>
          <ChartAxisContainer
            id={props.id}
            scale={props.xScale}
            axisType="x"
            refLabels={props.refLabels}
            size={props.size.innerHeight}
          />
          <ChartAxisContainer
            id={props.id}
            scale={props.yScale}
            axisType="y"
            refLabels={props.refLabels}
            size={props.size.innerWidth}
          />
          <ChartLineContainer
            id={props.id}
            xScale={props.xScale}
            yScale={props.yScale}
            data={props.data}
          />
          <ChartFocus />
          <ChartHoverContainer
            id={props.id}
            size={props.size}
            xScale={props.xScale}
            yScale={props.yScale}
            data={props.data}
          />
        </g>
      </svg>
    </div>
  );
}
