import React from 'react';


export default function(props) {
  return (
    <p className={`description ${props.asTooltip ? 'tooltip' : ''}`} dangerouslySetInnerHTML={{__html: props.safeDescription}} />
  );
}
