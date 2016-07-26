import React from 'react';
import ChartList from '../views/chart-list';

export class ChartListContainer extends React.Component {

  // numCharts is updated and provided to ChartList just for demonstration
  // purposes, and so that ChartList doesn't just have to include <ExampleChart />
  // 30 times in its source.

  constructor(props) {
    super(props);
    this.state = {numCharts: 0};
  }

  componentWillMount() {
    this.setState({numCharts: 30});
  }

  render() {
    return (
      <ChartList numCharts={this.state.numCharts} />
    );
  }
}
