import axios from 'axios';
import store from '../store';
import * as metricActions from '../actions/metric-actions';

const prodEndpoints = {
  GET_METRICS: `${location.origin}/metrics/`,
  GET_METRIC: `${location.origin}/metric/`
};

const mockEndpoints = {
  GET_METRICS: 'http://localhost:3009/metrics',
  GET_METRIC: 'http://localhost:3009/'
};

export const endpoints = process.env.NODE_ENV === 'production' ? prodEndpoints : mockEndpoints;

// Get metric IDs from query params
export function getQueryMetrics(query) {
  var qmetrics = [];
  if (query && query.metrics) {
    qmetrics = query.metrics.split(',').map(v => parseInt(v, 10));
  }
  return qmetrics;
}

// Get an array of all metrics
export function getMetrics(query) {
  store.dispatch(metricActions.gettingMetricsMetadata());

  return axios.get(endpoints.GET_METRICS).then(response => {
    var qmetrics = getQueryMetrics(query);
    var metricsMetadata = response.data.metrics;

    if (qmetrics.length) {
      metricsMetadata = metricsMetadata.filter(
        metric => qmetrics.indexOf(metric.id) > -1);
    }
    store.dispatch(metricActions.getMetricsMetadataSuccess(metricsMetadata));

    store.dispatch(metricActions.gettingMetrics());
    axios.all(metricsMetadata.map(metricData => getMetric(metricData.id)))
      .then(axios.spread(function(...metricData) {
        store.dispatch(metricActions.getMetricsSuccess(metricData));
      })).catch(error => {
        console.error(error);
        store.dispatch(metricActions.getMetricsFailure(error.response.status));
        return error;
      });

    return response;
  }).catch(error => {
    console.error(error);
    store.dispatch(metricActions.getMetricsMetadataFailure(error.response.status));
    return error;
  });
}

// Get a single metric
export function getMetric(chartId) {
  store.dispatch(metricActions.gettingMetric());

  return axios.get(`${endpoints.GET_METRIC}${chartId}/`).then(response => {
    store.dispatch(metricActions.getMetricSuccess(response.data));
    return response.data;
  }).catch(error => {
    console.error(error);
    store.dispatch(metricActions.getMetricFailure(error.response.status));
    return error;
  });
}
