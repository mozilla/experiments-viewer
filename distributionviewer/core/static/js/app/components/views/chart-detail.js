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
    if (this.props.item.type === 'numeric' && this.props.item.points.length >= 100) {
      outliersToggle = <label className="show-outliers"><input type="checkbox" defaultChecked={this.state.showOutliers} onChange={this.handleChange} />Show outliers</label>
    }

    return (
      <div className="chart-detail">
        {outliersToggle}
        <ChartContainer isDetail={true} chartId={this.props.params.chartId} chartName={this.props.params.metricName} showOutliers={this.state.showOutliers} />
      </div>
    );
  }
}

ChartDetail.propTypes = {
  item: React.PropTypes.object.isRequired,
  params: React.PropTypes.object.isRequired
};
