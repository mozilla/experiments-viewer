import React from 'react';


export default function(props) {
  return (
    <section className="legend">
      <ul>
        {props.subgroupsToShow.map(subgroupName => {
          return (
            <li key={subgroupName}>
              <svg className="example-line" data-subgroup={subgroupName} width="50" height="5">
                <line x1="0" y1="5" x2="50" y2="5" strokeWidth="5" />
              </svg>
              <span className="name">
                {subgroupName}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
