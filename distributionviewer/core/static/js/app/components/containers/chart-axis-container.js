import React from 'react';
import * as d3Axis from 'd3-axis';
import * as d3Selection from 'd3-selection';
import * as d3Format from 'd3-format';

import ChartAxis from '../views/chart-axis';


export default class extends React.Component {
  _drawAxis() {
    let props = this.props;
    let axisGenerator = props.axisType === 'x' ? d3Axis.axisBottom : d3Axis.axisLeft;
    this.xLabelsChopLength = 8;

    let axis = axisGenerator(props.scale)
                .tickSizeInner(-props.size)
                .tickSizeOuter(0)
                .tickPadding(10);

    let axisElm = d3Selection.select(`.chart-${props.metricId} .${props.axisType}.axis`);

    if (props.axisType === 'x') {
      if (props.metricType === 'categorical') {
        axis.ticks(3).tickFormat((d, i) => {
          if (i >= 0) {
            return this._getShortLabel(props.refLabels[d]);
          }
        });
      } else {
        axis.ticks(3, ',d');
      }
      axisElm.attr('transform', `translate(0, ${props.size})`).call(axis);
    } else {
      axis.ticks(6, d3Format.format('.0%'));
      axisElm.call(axis);
    }
  }

  _getShortLabel(lbl) {
    if (!lbl) lbl = '';

    if (lbl.length > this.xLabelsChopLength) {
      return `${lbl.substring(0, this.xLabelsChopLength - 1)}…`;
    }
    return lbl;
  }

  componentDidMount() {
    this._drawAxis();
  }

  componentDidUpdate() {
    this._drawAxis();
  }

  render() {
    return <ChartAxis axisType={this.props.axisType} />;
  }
}
