import React from 'react';


export default function(props) {
  return (
    <div className="sign-out-wrapper">
      <span className="email">{props.email}</span>
      <span className="button" onClick={props.signOut}>Sign Out</span>
    </div>
  );
}
