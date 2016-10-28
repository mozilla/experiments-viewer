import React from 'react';
import { Link } from 'react-router';

import ChartContainer from '../containers/chart-container';
import DescriptionContainer from '../containers/description-container';


export default function(props) {
  return (
    <section className="chart-list">
      {props.metadata.map(metricMeta => {
        const tooltip = <DescriptionContainer rawDescription={metricMeta.description} asTooltip={true} />;
        return (
          <Link key={metricMeta.id} className="chart-link" to={`/chart/${metricMeta.id}/`}>
            <div>
              <ChartContainer
                metricId={metricMeta.id}
                isDetail={false}
                showOutliers={false}
                tooltip={tooltip}
              />
            </div>
          </Link>
        );
      })}
    </section>
  );
}
