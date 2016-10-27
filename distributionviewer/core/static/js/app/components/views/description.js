import React from 'react';


export default function(props) {
  return (
    <p className="description" dangerouslySetInnerHTML={{__html: props.safeDescription}} />
  );
}
