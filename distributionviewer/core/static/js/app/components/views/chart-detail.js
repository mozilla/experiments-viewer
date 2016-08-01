import React from 'react';
import ChartContainer from '../containers/chart-container';

export class ChartDetail extends React.Component {
  render() {
    return (
      <div className="chart-detail">
        <ChartContainer link={false} chartName={this.props.params.metricName} />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at odio egestas, molestie velit ac, sodales nisi. In faucibus quis nunc ac sagittis.</p>
        <p>Praesent at placerat nisi. Etiam consectetur quis erat id tempus. Nulla tincidunt sapien sit amet accumsan suscipit. Donec leo sem, scelerisque et vehicula vehicula, fermentum vitae nulla. Quisque neque dui, pharetra quis purus sed, semper finibus mauris. Suspendisse potenti.</p>
      </div>
    );
  }
}

ChartDetail.propTypes = {
  params: {
    metricName: React.PropTypes.string.isRequired
  }
}
