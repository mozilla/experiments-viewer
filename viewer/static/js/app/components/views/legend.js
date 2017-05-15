import React from 'react';


export default function(props) {
  return (
    <section className="legend">
      <ul>
        {props.sortedPopulationsToShow.map(populationName => {
          return (
            <li key={populationName} data-population={populationName} data-population-id={props.populationIds[populationName]}>
              <svg className="example-line" width="50" height="5">
                <line x1="0" y1="5" x2="50" y2="5" strokeWidth="5" />
              </svg>
              <span className="name">
                {populationName}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
