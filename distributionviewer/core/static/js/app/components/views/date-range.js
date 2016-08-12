import React from 'react';


export default function DateRange(props) {
  return (
    <span className="date-range">
      <time dateTime={props.from}>{props.from}</time> to <time dateTime={props.to}>{props.to}</time>
    </span>
  );
}

DateRange.propTypes = {
  from: React.PropTypes.string.isRequired,
  to: React.PropTypes.string.isRequired,
};
