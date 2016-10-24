import React from 'react';
import * as d3Shape from 'd3-shape';
import * as d3Selection from 'd3-selection';

import ChartLine from '../views/chart-line';


export default class extends React.Component {
  _drawLine() {
    let props = this.props;
    let line = d3Shape.line()
                .x(d => props.xScale(d.x))
                .y(d => props.yScale(d.y));

    d3Selection.select(`.chart-${props.metricId} .line`).datum(props.data).attr('d', line);
  }

  componentDidMount() {
    this._drawLine();
  }

  componentDidUpdate() {
    this._drawLine();
  }

  render() {
    return <ChartLine />;
  }
}
