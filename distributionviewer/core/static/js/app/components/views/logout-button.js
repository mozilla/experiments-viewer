import React from 'react';


export default function LogoutButton(props) {
  return (
    <div className="sign-out-wrapper">
      <span>{props.email}</span>
      <a href="#" onClick={props.signOut}>Sign Out</a>
    </div>
  );
}

LogoutButton.propTypes = {
  email: React.PropTypes.string.isRequired,
  signOut: React.PropTypes.string.isRequired,
};
