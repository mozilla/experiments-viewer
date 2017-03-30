import React from 'react';
import { select, selectAll } from 'd3-selection';

import ChartHover from '../views/chart-hover.js';


export default class extends React.Component {
  constructor(props) {
    super(props);
    this._handleMouseOver = this._handleMouseOver.bind(this);
    this._handleMouseOut = this._handleMouseOut.bind(this);
  }

  _handleMouseOver(evt) {
    // Traversing the DOM tree avoids the perf issue of passing a .bind(this)

    // Chart line focus circle (.focus element)
    selectAll(`.chart-${this.props.metricId} .focus`).style('display', 'block');

    // Chart hover tooltip element.
    select('.secondary-menu-content').style('display', 'flex');
  }
  _handleMouseOut(evt) {
    selectAll(`.chart-${this.props.metricId} .focus`).style('display', 'none');
    select('.secondary-menu-content').style('display', 'none');
  }
  render() {
    return (
      <ChartHover
        mOver={this._handleMouseOver}
        mOut={this._handleMouseOut}
        {...this.props}
      />
    );
  }
}
