import React from 'react';

import Fetching from './fetching';


export default function(props) {
  let classes = ['button'];

  if (props.isFetching) {
    classes.push('is-fetching');
  }
  if (props.extraClasses.length) {
    classes = classes.concat(props.extraClasses);
  }

  return (
    <button
      disabled={props.isDisabled ? 'disabled' : false}
      onClick={props.handleClick}
      className={classes.join(' ')}>
        {props.label}
        <Fetching />
    </button>
  );
}
