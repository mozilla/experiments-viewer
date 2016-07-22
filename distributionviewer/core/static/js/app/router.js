import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// Layouts
import MainLayout from './components/layouts/main-layout';

// Pages
import Home from './components/home';
import ExampleChartDetailContainer from './components/containers/example-chart-detail-container';

export default (
  <Router history={browserHistory}>
    <Route component={MainLayout}>
      <Route path="/" component={Home} />
      <Route path="/chart/:chartId" component={ExampleChartDetailContainer} />
    </Route>
  </Router>
);
