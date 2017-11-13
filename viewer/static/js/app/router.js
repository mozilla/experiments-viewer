import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import ReactGA from 'react-ga';

// Layouts
import MainLayout from './components/layouts/main-layout';

// Pages
import AppContainer from './components/containers/app-container';
import Home from './components/views/home';
import NotFound from './components/views/not-found';
import PermissionDenied from './components/views/permission-denied';


// Copied from:
// https://github.com/react-ga/react-ga#with-npm
ReactGA.initialize(process.env.TRACKING_ID);
function logPageView() {
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
}

export default (
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route component={AppContainer}>
      <Route component={MainLayout}>
        <Route path="/" component={Home} />
        <Route path="/permission-denied" component={PermissionDenied} />
        <Route path="*" component={NotFound} />
      </Route>
    </Route>
  </Router>
);
