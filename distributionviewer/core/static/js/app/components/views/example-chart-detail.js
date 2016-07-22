import React from 'react';
import ExampleChartContainer from '../containers/example-chart-container';

export default function(props) {
  return (
    <div className="chart-detail">
      <ExampleChartContainer width={980} height={700} link={false} />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur at odio egestas, molestie velit ac, sodales nisi. In faucibus quis nunc ac sagittis.</p>
      <p>Praesent at placerat nisi. Etiam consectetur quis erat id tempus. Nulla tincidunt sapien sit amet accumsan suscipit. Donec leo sem, scelerisque et vehicula vehicula, fermentum vitae nulla. Quisque neque dui, pharetra quis purus sed, semper finibus mauris. Suspendisse potenti.</p>
    </div>
  );
}
