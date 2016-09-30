import React from 'react';

import ChartContainer from '../containers/chart-container';


export default function(props) {
  return (
    <section className="chart-list">
      {props.metrics.map(metric => {
        return (
          <ChartContainer
            key={metric.id}

            id={metric.id}
            metric={metric.metric}
            points={metric.points}
            type={metric.type}

            isDetail={false}
            showOutliers={false}
          />
        );
      })}
    </section>
  );
}
