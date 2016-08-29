import React from 'react';

import { ChartContainer } from '../containers/chart-container';


export class ChartDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {showOutliers: false};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({showOutliers: event.target.checked});
  }

  render() {
    // Only show the "Show outliers" toggle when it would have an effect
    let outliersToggle = '';
    if (this.props.item.type === 'log' && this.props.item.points.length >= 100) {
      outliersToggle = <label className="show-outliers"><input type="checkbox" defaultChecked={this.state.showOutliers} onChange={this.handleChange} />Show outliers</label>
    }

    return (
      <div className="chart-detail">
        {outliersToggle}
        <ChartContainer isDetail={true} chartName={this.props.params.metricName} showOutliers={this.state.showOutliers} />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at odio egestas, molestie velit ac, sodales nisi. In faucibus quis nunc ac sagittis.</p>
        <p>Praesent at placerat nisi. Etiam consectetur quis erat id tempus. Nulla tincidunt sapien sit amet accumsan suscipit. Donec leo sem, scelerisque et vehicula vehicula, fermentum vitae nulla. Quisque neque dui, pharetra quis purus sed, semper finibus mauris. Suspendisse potenti.</p>
      </div>
    );
  }
}

ChartDetail.propTypes = {
  item: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired,
}
