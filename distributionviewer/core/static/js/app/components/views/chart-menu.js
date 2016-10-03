import React from 'react';


export default function(props) {
  return (
    <nav className="chart-menu">
      <ul>
        {props.metadata.map(metricMetadata => {
          return (
            <li key={`menu-${metricMetadata.id}`}>
              <a href={`/chart/${metricMetadata.id}/`}>{metricMetadata.name}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
