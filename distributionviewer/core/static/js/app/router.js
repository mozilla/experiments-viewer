import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import ReactGA from 'react-ga';

// Layouts
import MainLayout from './components/layouts/main-layout';

// Pages
import AppContainer from './components/containers/app-container';
import Home from './components/home';
import ChartDetailContainer from './components/containers/chart-detail-container';
import NotFound from './components/views/not-found';
import PermissionDenied from './components/views/permission-denied';


// Copied from:
// https://github.com/react-ga/react-ga#with-npm
ReactGA.initialize(process.env.TRACKING_ID);
function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

/**
 * If the path that's about to be loaded doesn't include some required query
 * parameters, add them with their default values.
 */
function addDefaultChartQPs(nextState, replace) {
  const defaultChartQPs = {
    pop: 'All',
    showOutliers: false,
    scale: 'linear',
  };

  let defaultsNeeded = false;
  for (const key in defaultChartQPs) {
    if (defaultChartQPs.hasOwnProperty(key)) {

      // If a required query parameter key is missing, we'll need to add it with
      // its default value further down. Note that this allows keys with empty
      // values. For example, if ?pop is present but has no value, there will
      // simply be nothing to show in the chart.
      //
      // For some reason nextState.location.query doesn't have Object.prototype
      // as its own prototype, so we need to call hasOwnProperty directly off
      // the Object prototype.
      if (!Object.prototype.hasOwnProperty.call(nextState.location.query, key)) {
        defaultsNeeded = true;
        break;
      }

    }
  }

  if (defaultsNeeded) {
    const nextChartQPs = Object.assign({}, defaultChartQPs, nextState.location.query);
    replace({
      pathname: nextState.location.pathname,
      query: nextChartQPs,
    });
  }
}

export default (
  <Router history={browserHistory} onUpdate={logPageView}>
    <Route component={AppContainer}>
      <Route component={MainLayout}>
        <Route path="/" component={Home} onEnter={addDefaultChartQPs} />
        <Route path="/chart/:metricId" component={ChartDetailContainer} onEnter={addDefaultChartQPs} />
        <Route path="/permission-denied" component={PermissionDenied} />
        <Route path="*" component={NotFound} />
      </Route>
    </Route>
  </Router>
);
