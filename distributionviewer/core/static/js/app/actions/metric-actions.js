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
