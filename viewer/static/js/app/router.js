import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// Layouts
import MainLayout from './components/layouts/main-layout';

// Pages
import AppContainer from './components/containers/app-container';
import Home from './components/views/home';
import ChartDetailContainer from './components/containers/chart-detail-container';
import NotFound from './components/views/not-found';
import PermissionDenied from './components/views/permission-denied';


export default (
  <Router history={browserHistory}>
    <Route component={AppContainer}>
      <Route component={MainLayout}>
        <Route path="/" component={Home} />
        <Route path="/chart/:metricId" component={ChartDetailContainer} />
        <Route path="/permission-denied" component={PermissionDenied} />
        <Route path="*" component={NotFound} />
      </Route>
    </Route>
  </Router>
);
