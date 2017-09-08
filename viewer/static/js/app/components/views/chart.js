import React from 'react';

import Fetching from './fetching';
import ChartAxisContainer from '../containers/chart-axis-container';
import ChartLineContainer from '../containers/chart-line-container';
import ChartHoverContainer from '../containers/chart-hover-container';
import ChartFocus from './chart-focus';


export default class extends React.Component {
  _populationComponents(populations) {
    const props = this.props;
    const populationComponents = [];

   /**
    * populations is an array of population names sorted by their visual
    * importance. The first name in that array should be shown first in lists,
    * for example, and the last name in the array should be shown last.
    *
    * In SVG, the element that appears last in source order paints above
    * everything it overlaps. It has the greatest "z-index", so to speak.
    *
    * So we need to render these populations in reverse order. We use a reverse
    * loop to achieve this. The line for the last population according to the
    * original sort order is queued up first, then the line for the
    * second-to-last population, and so on. At the end of this process, the
    * first population in the original sort order is last and has the highest
    * z-index. Hooray!
    *
    * It goes without saying, but we don't want to iterate over populationData,
    * even though we ultimately use the data from that object, because object
    * ordering is indeterminate.
    */
    for (let i = populations.length - 1; i >= 0; i--) {
      const currentPopulationName = populations[i];

      // populations updates before populationData does. So it sometimes
      // contains populations that don't have any corresponding data yet.
      //
      // If there is no data for this population, don't attempt to render it.
      if (!props.populationData[currentPopulationName]) continue;

      populationComponents.push(
        <g key={props.metricId + currentPopulationName} className="population" data-population={currentPopulationName} data-population-id={props.populationIds[currentPopulationName]}>
          <ChartLineContainer
            populationName={currentPopulationName}
            metricId={props.metricId}
            xScale={props.xScale}
            yScale={props.yScale}
            metricType={props.metricType}
            data={props.populationData[currentPopulationName]['data'][props.activeDatasetName]}
          />
          <ChartFocus />
        </g>
      );
    }

    return populationComponents;
  }

  render() {
    const props = this.props;
    if (props.noData) {
      return (
        <div className={`chart chart-${props.metricId} no-data`}>
          <span className="warning">No data</span>
          <span>(try selecting different cohorts)</span>
        </div>
      );
    } else if (props.isFetching) {
      return (
        <div className={`chart is-fetching chart-${props.metricId}`}>
          <Fetching />
        </div>
      );
    } else {
      return (
        <div className={`chart chart-${props.metricId}`}>
          <div className={props.tooltip ? 'tooltip-wrapper' : ''}>
            <h2 className={`chart-list-name ${props.tooltip ? 'tooltip-hover-target' : ''}`}>{props.name}</h2>
            {props.tooltip ? props.tooltip : ''}
          </div>
          <svg width={props.size.width} height={props.size.height}>
            <g transform={props.size.transform}>
              <ChartAxisContainer
                metricId={props.metricId}
                metricType={props.metricType}
                scale={props.xScale}
                axisType="x"
                refLabels={props.refLabels}
                size={props.size.innerHeight}
                height={props.size.height}
                width={props.size.width}
                xunit={props.xunit}
              />
              <ChartAxisContainer
                metricId={props.metricId}
                scale={props.yScale}
                axisType="y"
                refLabels={props.refLabels}
                size={props.size.innerWidth}
                height={props.size.height}
                width={props.size.width}
              />
              <g className="populations">
                {this._populationComponents(props.sortedPopulationsToShow)}
              </g>
              <ChartHoverContainer
                metricId={props.metricId}
                size={props.size}
                xScale={props.xScale}
                yScale={props.yScale}
                populations={props.populationData}
                activeDatasetName={props.activeDatasetName}
                hoverString={props.hoverString}
                refLabels={props.refLabels}
                metricType={props.metricType}
                xunit={props.xunit}
              />
            </g>
          </svg>
        </div>
      );
    }
  }
}
