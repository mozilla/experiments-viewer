import React from 'react';


export default function(props) {
  return (
    <section className="legend">
      <ul>
        {props.whitelistedSubgroups.map(subgroupKey => {
          return (
            <li key={subgroupKey}>
              <svg className="example-line" data-subgroup={subgroupKey} width="50" height="5">
                <line x1="0" y1="5" x2="50" y2="5" strokeWidth="5" />
              </svg>
              <span className="name">
                {subgroupKey}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
