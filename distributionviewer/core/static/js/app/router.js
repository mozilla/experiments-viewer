import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// Layouts
import MainLayout from './components/layouts/main-layout';

// Pages
import Home from './components/home';
import ChartDetailContainer from './components/containers/chart-detail-container';
import { NotFoundContainer } from './components/containers/not-found-container';

export default (
  <Router history={browserHistory}>
    <Route component={MainLayout}>
      <Route path="/" component={Home} />
      <Route path="/chart/:chartId" component={ChartDetailContainer} />
      <Route path="*" component={NotFoundContainer} />
    </Route>
  </Router>
);
