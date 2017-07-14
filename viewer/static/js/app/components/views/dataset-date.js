import React from 'react';


export default function(props) {
  if (props.date) {
    return <span className="dataset-date">{props.date}</span>;
  }
  return <span />;
}
