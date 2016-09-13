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
    body: new URLSearchParams('token=' + user.token)});
  window.fetch(req).then(function (response) {
    if (response.status === 200) {
      window.location.pathname = document.querySelector('html').dataset.logintarget;
    } else {
      response.text().then(function (txt) {
        document.querySelector('body').appendChild(new Text(txt))
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut()
      });
    }
  });
}
