import React from 'react';


export default function LogoutButton(props) {
  return (
    <div className="sign-in-wrapper">
      <h3>{props.email}</h3>
      <div className="button button-sign-out" onClick={props.signOut}>Sign Out</div>
    </div>
  );
}

LogoutButton.propTypes = {
  email: React.PropTypes.string.isRequired,
  signOut: React.PropTypes.string.isRequired,
};
