import React from 'react';

import Fetching from './fetching';
import ChartAxisContainer from '../containers/chart-axis-container';
import ChartLineContainer from '../containers/chart-line-container';
import ChartHoverContainer from '../containers/chart-hover-container';
import ChartFocus from './chart-focus';


export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPopulations(props, populationData) {
    let renderings = [];

    for (let populationName in populationData) {
      if (populationData.hasOwnProperty(populationName)) {

        const currentPopulation = populationData[populationName];

        renderings.push(
          <g key={props.metricId + populationName} className="population" data-population={populationName}>
            <ChartLineContainer
              populationName={populationName}
              metricId={props.metricId}
              xScale={props.xScale}
              yScale={props.yScale}
              data={currentPopulation[props.activeDatasetName]}
            />
            <ChartFocus />
          </g>
        );
      }
    }

    return renderings;
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
      var control, sdExcludingControl, sdOnlyControl;
      if (this.props.populationData['control']) {

        // ES6!
        //
        // This is equivalent the following:
        // const control = this.props.populdationData['control'];
        // const sdExcludingControl = this.props.populdationData[... everything else ...];
        // const sdOnlyControl = { 'control': control };
        ({'control': control, ...sdExcludingControl} = this.props.populationData);
        sdOnlyControl = { 'control': control }

      } else {
        sdExcludingControl = this.props.populationData;
      }

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
                In SVG, the elemenet that appears last in the markup has the
                greatest "z-index". We want the "control" population to appear
                above other populations when they overlap, so we need to render
                it last.
                */}
                {this.renderPopulations(this.props, sdExcludingControl)}
                {sdOnlyControl && this.renderPopulations(this.props, sdOnlyControl)}
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
