import React from 'react';

import { getCountString } from '../../utils';


export default function(props) {
  return (
    <section className="legend">
      <ul>
        {props.sortedPopulationsToShow.map(populationName => {
          const populationMeta = props.populations[populationName];
          const countString = getCountString(populationMeta.total_clients, populationMeta.total_pings);

          return (
            <li key={populationName} title={countString} data-population={populationName} data-population-id={props.populationIds[populationName]}>
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
