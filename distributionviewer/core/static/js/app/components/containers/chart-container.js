import React from 'react';

import { Chart } from '../views/chart';


export class ChartContainer extends React.Component {
  render() {
    return (
      <Chart {...this.props} />
    );
  }
}

ChartContainer.propTypes = {
  chartId: React.PropTypes.number.isRequired,
};
