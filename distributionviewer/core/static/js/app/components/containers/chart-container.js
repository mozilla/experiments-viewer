import React from 'react';

import { Chart } from '../views/chart';


export class ChartContainer extends React.Component {
  render() {
    return (
      <Chart chartName={this.props.chartName} {...this.props} />
    );
  }
}

ChartContainer.propTypes = {
  chartId: React.PropTypes.number.isRequired,
  chartName: React.PropTypes.string.isRequired
};
