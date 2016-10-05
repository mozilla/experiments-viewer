import React from 'react';
import { Link } from 'react-router';

import ChartContainer from '../containers/chart-container';


export default function(props) {
  return (
    <section className="chart-list">
      {props.metrics.map(metric => {
        return (
          <Link key={metric.id} className="chart-link" to={`/chart/${metric.id}/`}>
            <div>
              <h2 className="chart-list-name">{metric.metric}</h2>
              <ChartContainer
                id={metric.id}
                metric={metric.metric}
                points={metric.points}
                type={metric.type}
                isDetail={false}
                showOutliers={false}
              />
            </div>
          </Link>
        );
      })}
    </section>
  );
}
