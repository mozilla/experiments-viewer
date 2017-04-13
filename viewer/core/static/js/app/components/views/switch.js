import React from 'react';


function toggleSwitch(evt) {
  if (evt.target.classList.contains('switch')) {
    evt.target.classList.toggle('active');
  } else {
    evt.target.parentNode.classList.toggle('active');
  }
}

export default function(props) {
  return (
    <div className="switch-wrapper" onClick={toggleSwitch}>
      <span className={props.active ? 'switch active' : 'switch'}>
        <b className="handle" />
      </span>
      {props.label ? props.label : ''}
    </div>
  );
}
