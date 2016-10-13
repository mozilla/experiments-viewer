import React from 'react';
import { Link } from 'react-router';

import ChartContainer from '../containers/chart-container';


export default function(props) {
  return (
    <section className="chart-list">
      {props.metadata.map(metricMeta => {
        return (
          <Link key={metricMeta.id} className="chart-link" to={`/chart/${metricMeta.id}/`}>
            <div>
              <ChartContainer
                metricId={metricMeta.id}
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
