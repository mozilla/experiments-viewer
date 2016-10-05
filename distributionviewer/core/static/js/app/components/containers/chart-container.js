import React from 'react';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';

import Chart from '../views/chart';


export default class extends React.Component {
  constructor(props) {
    super(props);

    let margin = {top: 20, right: 20, bottom: 30, left: 40};
    let width = 300;
    let height = 250;

    // width = size of the SVG
    // innerWidth = size of the contents of the SVG
    this.size = {
      width,
      height,
      innerWidth: width - margin.left - margin.right,
      innerHeight: height - margin.top - margin.bottom,
      transform: `translate(${margin.left}, ${margin.top})`
    };

    this.data = this._getFormattedData(this.props.points);

    this.xScale = d3Scale.scaleLinear()
                    .domain([0, d3Array.max(this.data, d => d.x)])
                    .range([0, this.size.innerWidth]);

    this.yScale = d3Scale.scaleLinear()
                    .domain([0, d3Array.max(this.data, d => d.y)])
                    .range([this.size.innerHeight, 0]);

    this.refLabels = [];
    this.data.map(item => {
      this.refLabels[item.x] = item.label;
    });
  }

  // Map metric points to new keys to be used by d3.
  _getFormattedData(dataPoints) {
    var formattedPoints = [];

    for (let i = 0; i < dataPoints.length; i++) {
      formattedPoints.push({
        x: dataPoints[i]['refRank'] || parseFloat(dataPoints[i]['b']),
        y: dataPoints[i]['c'],
        p: dataPoints[i]['p'],
        label: dataPoints[i]['b']
      });
    }

    return formattedPoints;
  }

  render() {
    return (
      <Chart
        id={this.props.id}
        size={this.size}
        xScale={this.xScale}
        yScale={this.yScale}
        refLabels={this.refLabels}
        data={this.data}
      />
    );
  }
}
