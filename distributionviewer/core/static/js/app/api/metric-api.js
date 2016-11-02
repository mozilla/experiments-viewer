import axios from 'axios';
import store from '../store';
import * as metricActions from '../actions/metric-actions';

export const endpoints = {
  GET_METRICS: `${location.origin}/metrics/`,
  GET_METRIC: `${location.origin}/metric/`
};

// Given a location object, return an array of all metric IDs specified in the
// ?metrics query parameter.
export function getWhitelistedMetricIds(location) {
  if (location.query && location.query.metrics) {
    return location.query.metrics.split(',').map(s => parseInt(s, 10));
  }
}

// Return an object of metric metadata indexed by metric ID. If an array of
// metricIds is passed, only include metadata about those metrics. Otherwise,
// include metadata about all published metrics.
export function getMetricMetadata(metricIds) {
  store.dispatch(metricActions.gettingMetricMetadata());

  return axios.get(endpoints.GET_METRICS).then(response => {
    let metricMetadata = response.data.metrics;

    if (metricIds) {
      metricMetadata = metricMetadata.filter(m => metricIds.indexOf(m.id) > -1);
    }

    store.dispatch(metricActions.getMetricMetadataSuccess(metricMetadata));
    return metricMetadata;
  }).catch(error => {
    console.error(error);
    store.dispatch(metricActions.getMetricMetadataFailure(error.status));
    return error;
  });
}

// Get a single metric
export function getMetric(metricId) {
  return axios.get(`${endpoints.GET_METRIC}${metricId}/`).then(response => {
    store.dispatch(metricActions.getMetricSuccess(metricId, response.data));
    return response.data;
  }).catch(error => {
    console.error(error);
    return error;
  });
}
