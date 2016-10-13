import React from 'react';
import { select } from 'd3-selection';

import ChartHover from '../views/chart-hover.js';


export default class extends React.Component {
  _handleMouseOver(evt) {
    // These are less readable by traversing the DOM tree but avoid
    // the perf issue of passing a .bind(this)

    // Chart line focus circle (.focus element)
    select(evt.target.previousSibling).style('display', 'block');

    // Chart tooltip div (.tooltip element)
    select(evt.target.parentNode.parentNode.previousSibling).style('display', 'block');
  }
  _handleMouseOut(evt) {
    select(evt.target.previousSibling).style('display', 'none');
    select(evt.target.parentNode.parentNode.previousSibling).style('display', 'none');
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
