/* eslint no-unused-vars: "off", no-undef: "off" */
function performSignIn(googleUser) {
  var user = {};
  user.name = googleUser.getBasicProfile().getName();
  user.email = googleUser.getBasicProfile().getEmail();
  user.token = googleUser.getAuthResponse().id_token;
  localStorage.setItem('user_name', user.name);
  localStorage.setItem('user_email', user.email);
  localStorage.setItem('user_token', user.token);

  var req = new Request('/verify_google_token/', {
    method: 'POST',
    credentials: 'same-origin',
    mode: 'same-origin',
    body: new URLSearchParams('token=' + user.token)
  });

  window.fetch(req).then(response => {
    if (response.status === 200) {
      // We want the URL to exactly equal the contents of data-logintarget. If
      // we set window.location.pathname here instead, the ?next query parameter
      // would persist. We don't want that.
      window.location = document.querySelector('html').dataset.logintarget;
    } else {
      var auth2 = gapi.auth2.getAuthInstance();
      auth2.signOut();
      window.location.pathname = '/accounts/login/?status=' + response.status;
    }
  });
}
