import React from 'react';
import { browserHistory } from 'react-router';

import LogoutButton from '../views/logout-button';


export class LogoutButtonContainer extends React.Component {
  _doSignOut() {
    gapi.auth2.getAuthInstance().signOut().then(() => {
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_token');

      console.log('sign out finished...');
      browserHistory.push('/');
    });
  }

  componentWillMount() {
    gapi.load('auth2', () => {
      var clientElm = document.querySelector('meta[name=google-signin-client_id]');
      if (!clientElm) {
        console.error('No google auth client ID metadata found in root HTML document.');
        return;
      }
      window.auth2 = gapi.auth2.init({
        client_id: clientElm.getAttribute('content')
      });
    });
  }

  render() {
    return (
      <LogoutButton email={localStorage.getItem('user_email')} signOut={this._doSignOut} />
    );
  }
}
