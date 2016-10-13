import React from 'react';
import { Link } from 'react-router';


export default function(props) {
  return (
    <nav className="chart-menu">
      <ul>
        {props.metadata.map(metricMetadata => {
          return (
            <li key={`menu-${metricMetadata.id}`}>
              <Link to={`/chart/${metricMetadata.id}/`}>{metricMetadata.name}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
