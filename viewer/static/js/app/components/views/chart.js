import React from 'react';

import Fetching from './fetching';
import ChartAxisContainer from '../containers/chart-axis-container';
import ChartLineContainer from '../containers/chart-line-container';
import ChartHoverContainer from '../containers/chart-hover-container';
import ChartFocus from './chart-focus';


export default class extends React.Component {
  /**
   * sortedPopulationsToShow often updates before populationData does. That is,
   * sortedPopulationsToShow often names populations that do not yet have
   * corresponding data in populationData.
   *
   * This component can't exactly do much when that happens. It can't exactly
   * render data that it doesn't have yet. So it's better off not re-rendering
   * at all. As soon as populationData is updated to have data for all of the
   * populations named in sortedPopulationsToShow, this test will pass and the
   * component will re-render.
   */
  shouldComponentUpdate(nextProps) {
    let shouldUpdate = true;

    for (let i = 0; i < nextProps.sortedPopulationsToShow.length; i++) {
      const populationName = nextProps.sortedPopulationsToShow[i];
      if (!nextProps.populationData.hasOwnProperty(populationName)) {
        shouldUpdate = false;
        break;
      }
    }

    return shouldUpdate;
  }

  render() {
    if (this.props.noData) {
      return (
        <div className={`chart chart-${this.props.metricId} no-data`}>
          <span className="warning">No data</span>
          <span>(try selecting different cohorts)</span>
        </div>
      );
    } else if (this.props.isFetching) {
      return (
        <div className={`chart is-fetching chart-${this.props.metricId}`}>
          <Fetching />
        </div>
      );
    } else {
      const reverseSortedPopulationsToShow = this.props.sortedPopulationsToShow.slice(0).reverse();

      return (
        <div className={`chart chart-${this.props.metricId}`}>
          <div className={this.props.tooltip ? 'tooltip-wrapper' : ''}>
            <h2 className={`chart-list-name ${this.props.tooltip ? 'tooltip-hover-target' : ''}`}>{this.props.name}</h2>
            {this.props.tooltip ? this.props.tooltip : ''}
          </div>
          <svg width={this.props.size.width} height={this.props.size.height}>
            <g transform={this.props.size.transform}>
              <ChartAxisContainer
                metricId={this.props.metricId}
                metricType={this.props.metricType}
                scale={this.props.xScale}
                axisType="x"
                refLabels={this.props.refLabels}
                size={this.props.size.innerHeight}
              />
              <ChartAxisContainer
                metricId={this.props.metricId}
                scale={this.props.yScale}
                axisType="y"
                refLabels={this.props.refLabels}
                size={this.props.size.innerWidth}
              />
              <g className="populations">
                {/*
                In SVG, the element that appears last in source order paints above
                everything it overlaps. It has the greatest "z-index", so to
                speak.

                sortedPopulationsToShow is an array of population names sorted
                by their visual importance. The first name in that array
                should be shown first in lists, for example, and the last name
                in the array should be shown last.

                As a result, we need to render these populations in reverse order.
                The line for the last population according to the original sort
                order is painted first, then the line for the second-to-last
                population, and so on. At the end of this process, the first
                population in the original sort order is painted last and has the
                highest z-index. Hooray!

                It goes without saying at this point, but we don't want to
                iterate over populationData, even though we ultimately use the
                data from that object, because object ordering is
                indeterminate.
                */}
                {reverseSortedPopulationsToShow.map(populationName => {
                  return (
                    <g key={this.props.metricId + populationName} className="population" data-population={populationName} data-population-id={this.props.populationIds[populationName]}>
                      <ChartLineContainer
                        populationName={populationName}
                        metricId={this.props.metricId}
                        xScale={this.props.xScale}
                        yScale={this.props.yScale}
                        data={this.props.populationData[populationName][this.props.activeDatasetName]}
                      />
                      <ChartFocus />
                    </g>
                  );
                })}
              </g>
              <ChartHoverContainer
                metricId={this.props.metricId}
                size={this.props.size}
                xScale={this.props.xScale}
                yScale={this.props.yScale}
                populations={this.props.populationData}
                activeDatasetName={this.props.activeDatasetName}
                hoverString={this.props.hoverString}
                refLabels={this.props.refLabels}
                metricType={this.props.metricType}
              />
            </g>
          </svg>
        </div>
      );
    }
  }
}
