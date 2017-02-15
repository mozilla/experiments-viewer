import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// Layouts
import MainLayout from './components/layouts/main-layout';

// Pages
import AppContainer from './components/containers/app-container';
import Home from './components/home';
import ChartConfigContainer from './components/containers/chart-config-container';
import ChartDetailContainer from './components/containers/chart-detail-container';
import NotFound from './components/views/not-found';
import PermissionDenied from './components/views/permission-denied';


/**
 * If the path that's about to be loaded doesn't include a ?pop query parameter,
 * add ?pop=All.
 */
function addPopAll(nextState, replace) {
  if (!nextState.location.query.pop) {
    replace(nextState.location.pathname + '?pop=All');
  }
}

export default (
  <Router history={browserHistory}>
    <Route component={AppContainer}>
      <Route component={MainLayout}>

        {/* Add ?pop=All if no populations are specified */}
        <Route path="/" component={Home} onEnter={addPopAll} />

        <Route path="/chart/:metricId" component={ChartDetailContainer} />
        <Route path="/configure" component={ChartConfigContainer} />
        <Route path="/permission-denied" component={PermissionDenied} />
        <Route path="*" component={NotFound} />
      </Route>
    </Route>
  </Router>
);
