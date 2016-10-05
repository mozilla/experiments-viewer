import React from 'react';
import * as d3Array from 'd3-array';
import { select, mouse } from 'd3-selection';


export default class extends React.Component {
  componentDidMount() {
    let hoverElm = select(this.refs.rect);
    this.focusElm = select(`.chart-${this.props.id} .focus`);
    this.bisector = d3Array.bisector(d => d.x).left;

    // Terrible hack to bind an event in a way d3 prefers.
    // Normally this would be in the container and we'd pass it the event.
    hoverElm.on('mousemove', () => {
      this._handleMouseMove();
    });
  }
  _handleMouseMove() {
    let props = this.props;
    let x0 = props.xScale.invert(mouse(this.refs.rect)[0]);
    let i = this.bisector(props.data, x0, 1);
    let d0 = props.data[i - 1];
    let d1 = props.data[i] ? props.data[i] : props.data[i - 1];
    let d = x0 - d0.x > d1.x - x0 ? d1 : d0;

    this.focusElm.attr('transform', `translate(${props.xScale(d.x)}, ${props.yScale(d.y)})`);
    select(`.chart-${props.id} .tooltip`).text(`x: ${d.x} y: ${d.y}`);
  }
  render() {
    return (
      <rect
        ref="rect"
        className="hover-zone"
        width={this.props.size.innerWidth}
        height={this.props.size.innerHeight}
        onMouseOver={this.props.mOver}
        onMouseOut={this.props.mOut}
      />
    );
  }
}
