import React from 'react';


export default function(props) {
  return (
    <div className="sign-in-wrapper">
      <h3>{props.email}</h3>
      <div className="button button-sign-out" onClick={props.signOut}>Sign Out</div>
    </div>
  );
}
