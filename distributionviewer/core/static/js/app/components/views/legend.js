import React from 'react';


export default function(props) {
  if (!props.metric) return null;

  return (
    <section className="legend">
      <ul>
        {props.metric.populations.map((population, index) => {
          return (
            <li key={index}>
              <svg className="example-line" data-population={population.name} width="50" height="5">
                <line x1="0" y1="5" x2="50" y2="5" strokeWidth="5" />
              </svg>
              <span className="name">
                {population.name}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
