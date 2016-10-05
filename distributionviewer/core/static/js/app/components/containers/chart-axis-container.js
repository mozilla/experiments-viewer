import React from 'react';
import * as d3Axis from 'd3-axis';
import * as d3Selection from 'd3-selection';
import * as d3Format from 'd3-format';

import ChartAxis from '../views/chart-axis';


export default class extends React.Component {
  componentDidMount() {
    let props = this.props;
    let axisGenerator = props.axisType === 'x' ? d3Axis.axisBottom : d3Axis.axisLeft;
    this.xLabelsChopLength = 8;

    let axis = axisGenerator(props.scale)
                .tickSizeInner(-props.size)
                .tickSizeOuter(0)
                .tickPadding(10);

    let axisElm = d3Selection.select(`.chart-${props.id} .${props.axisType}.axis`);

    if (props.axisType === 'x') {
      axis.ticks(3).tickFormat((d, i) => {
        if (i > 0) {
          return this._getShortLabel(props.refLabels[d]) || '';
        }
      });
      axisElm.attr('transform', `translate(0, ${props.size})`).call(axis);
    } else {
      axis.ticks(6, d3Format.format('.0%'));
      axisElm.call(axis);
    }
  }

  _getShortLabel(lbl) {
    if (lbl.length > this.xLabelsChopLength) {
      return `${lbl.substring(0, this.xLabelsChopLength - 1)}…`;
    }
    return lbl;
  }

  render() {
    return <ChartAxis axisType={this.props.axisType} />;
  }
}
