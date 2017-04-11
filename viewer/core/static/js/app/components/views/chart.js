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

  renderSubgroups(props, subgroupData) {
    let renderings = [];

    for (let subgroupName in subgroupData) {
      if (subgroupData.hasOwnProperty(subgroupName)) {

        const currentSubgroup = subgroupData[subgroupName];

        renderings.push(
          <g key={props.metricId + subgroupName} className="subgroup" data-subgroup={subgroupName}>
            <ChartLineContainer
              subgroupName={subgroupName}
              metricId={props.metricId}
              xScale={props.xScale}
              yScale={props.yScale}
              data={currentSubgroup[props.activeDatasetName]}
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
      if (this.props.subgroupData['control']) {

        // ES6!
        //
        // This is equivalent the following:
        // const control = this.props.populdationData['control'];
        // const sdExcludingControl = this.props.populdationData[... everything else ...];
        // const sdOnlyControl = { 'control': control };
        ({'control': control, ...sdExcludingControl} = this.props.subgroupData);
        sdOnlyControl = { 'control': control }

      } else {
        sdExcludingControl = this.props.subgroupData;
      }

      return (
        <div className={`chart chart-${this.props.metricId}`}>
          <div className={this.props.tooltip ? 'tooltip-wrapper' : ''}>
            <h2 className={`chart-list-name ${this.props.tooltip ? 'tooltip-hover-target' : ''}`}>{this.props.name}</h2>
            {this.props.tooltip}
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
              <g className="subgroups">
                {/*
                In SVG, the elemenet that appears last in the markup has the
                greatest "z-index". We want the "control" subgroup to appear
                above other subgroups when they overlap, so we need to render
                it last.
                */}
                {this.renderSubgroups(this.props, sdExcludingControl)}
                {sdOnlyControl && this.renderSubgroups(this.props, sdOnlyControl)}
              </g>
              <ChartHoverContainer
                metricId={this.props.metricId}
                size={this.props.size}
                xScale={this.props.xScale}
                yScale={this.props.yScale}
                subgroups={this.props.subgroupData}
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
