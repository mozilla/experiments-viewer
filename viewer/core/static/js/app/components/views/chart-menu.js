import React from 'react';
import { Link } from 'react-router';


export default function(props) {
  // We can't do anything until the metadata is loaded
  if (!props.metadata || Object.keys(props.metadata).length === 0) return null;

  // If the user intentionally selected no metrics (that is, if the ?metrics
  // query parameter is present but empty), honor that request. If the query
  // parameter is not present, show all metrics. Otherwise, show the metrics
  // they selected.
  let chartIdsToShow;
  if (props.intentionallySelectedNoMetrics) {
    chartIdsToShow = [];
  } else if (props.whitelistedMetricIds === undefined) {
    chartIdsToShow = Object.keys(props.metadata);
  } else {
    chartIdsToShow = props.whitelistedMetricIds;
  }

  return (
    <nav className="chart-menu">
      <ul>
        {chartIdsToShow.map(id => {
          const metricMetadata = props.metadata[id];
          return (
            <li key={`menu-${id}`}>
              <Link to={`/chart/${id}/`}>{metricMetadata.name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
