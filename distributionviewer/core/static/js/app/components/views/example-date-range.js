import React from 'react';

export default function ExampleDateRange(props) {
  return (
    <span className="date-range">
      <time dateTime={props.from}>{props.from}</time> to <time dateTime={props.to}>{props.to}</time>
    </span>
  );
}

ExampleDateRange.propTypes = {
  from: React.PropTypes.string.isRequired,
  to: React.PropTypes.string.isRequired,
};
