import React from 'react';

import LogoutButton from '../views/logout-button';


export default class extends React.Component {
  _doSignOut() {
    window.gapi.auth2.getAuthInstance().signOut().then(() => {
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_token');
      window.location.pathname = '/accounts/logout/';
    });
  }

  componentWillMount() {
    window.gapi.load('auth2', () => {
      var clientElm = document.querySelector('meta[name=google-signin-client_id]');
      if (!clientElm) {
        console.error('No google auth client ID metadata found in root HTML document.');
        return;
      }
      window.auth2 = window.gapi.auth2.init({
        'client_id': clientElm.getAttribute('content')
      });
    });
  }

  render() {
    return (
      <LogoutButton email={localStorage.getItem('user_email')} signOut={this._doSignOut} />
    );
  }
}
