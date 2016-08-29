import axios from 'axios';
import store from '../store';
import {
  gettingMetrics, getMetricsSuccess, getMetricsFailure
} from '../actions/metric-actions';

const prodEndpoints = {
  GET_METRICS: `${location.origin}/metrics/`,
  GET_METRIC: `${location.origin}/metric/`
};

const mockEndpoints = {
  GET_METRICS: 'http://localhost:3009/metrics',
  GET_METRIC: 'http://localhost:3009/'
};

export const endpoints = process.env.NODE_ENV === 'production' ? prodEndpoints : mockEndpoints;

// Fetch list of metrics.
export function getMetrics() {
  store.dispatch(gettingMetrics());

  return axios.get(endpoints.GET_METRICS).then(response => {
    store.dispatch(getMetricsSuccess(response.data.metrics));
    return response;
  }).catch(response => {
    console.error(response);
    store.dispatch(getMetricsFailure(response.status));
    return response;
  });
}
