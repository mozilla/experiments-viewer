import React from 'react';

export default function(props) {
  let maybeName = <span className="experiment-name">{props.name || props.slug}</span>;

  let maybeDate = null;
  if (props.date) {
    maybeDate = (
      <span className="experiment-date">Imported on {props.date}</span>
    );
  }

  let maybeNumClients = null;
  if (props.numClients) {
    maybeNumClients = (
      <span className="experiment-num-clients">
        {props.numClients.toLocaleString('en-US')} clients
      </span>
    );
  }

  let maybeNumPings = null;
  if (props.numPings) {
    maybeNumPings = (
      <span className="experiment-num-pings">
        {props.numPings.toLocaleString('en-US')} pings
      </span>
    );
  }

  return (
    <div id="experiment-metadata" className="experiment-metadata">
      {maybeName}
      {maybeDate}
      {maybeNumClients}
      {maybeNumPings}
    </div>
  );
}
