import * as types from './action-types';


export function gettingMetrics() {
  return {
    type: types.GETTING_METRICS
  };
}

export function getMetricsSuccess(items) {
  return {
    type: types.GET_METRICS_SUCCESS,
    items
  };
}

export function getMetricsFailure(status) {
  return {
    type: types.GET_METRICS_FAILURE,
    status
  };
}

export function getMetricSuccess(item) {
  return {
    type: types.GET_METRIC_SUCCESS,
    item
  };
}

export function getMetricFailure(status) {
  return {
    type: types.GET_METRIC_FAILURE,
    status
  };
}
