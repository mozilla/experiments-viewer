import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// Layouts
import MainLayout from './components/layouts/main-layout';

// Pages
import Home from './components/home';
import ChartConfigContainer from './components/containers/chart-config-container';
import ChartDetailContainer from './components/containers/chart-detail-container';
import NotFound from './components/views/not-found';
import PermissionDenied from './components/views/permission-denied';

export default (
  <Router history={browserHistory}>
    <Route component={MainLayout}>
      <Route path="/" component={Home} />
      <Route path="/chart/:metricId" component={ChartDetailContainer} />
      <Route path="/configure" component={ChartConfigContainer} />
      <Route path="/permission-denied" component={PermissionDenied} />
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
);
