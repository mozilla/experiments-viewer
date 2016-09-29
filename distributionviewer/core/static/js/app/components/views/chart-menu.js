import React from 'react';


export default function(props) {
  return (
    <nav className="chart-menu">
      <ul>
        {props.items.map(metric => {
          return (
            <li key={`menu-${metric.id}`}>
              <a href={`/chart/${metric.id}/`}>{metric.name}</a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
