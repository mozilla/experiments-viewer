import React from 'react';

import { ChartContainer } from '../containers/chart-container';


export class ChartList extends React.Component {
  render() {
    return (
      <section className="chart-list">
        {this.props.items.map(chart => {
          return (
            <ChartContainer key={chart.name} isDetail={false} chartId={chart.id} chartName={chart.name} showOutliers={false} />
          );
        })}
      </section>
    );
  }
}
