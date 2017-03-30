import React from 'react';


export default function(props) {
  return (
    <section className="legend">
      <ul>
        {props.whitelistedPopulations.map(populationKey => {
          return (
            <li key={populationKey}>
              <svg className="example-line" data-population={populationKey} width="50" height="5">
                <line x1="0" y1="5" x2="50" y2="5" strokeWidth="5" />
              </svg>
              <span className="name">
                {populationKey}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
