import React from 'react';


export default function(props) {
  if (props.currentDataset.name) {
    return <h2>{props.currentDataset.name}</h2>;
  }
  return <h2></h2>;
}
