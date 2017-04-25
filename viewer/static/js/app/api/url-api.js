import store from '../store';
import * as urlActions from '../actions/url-actions';


/**
 * Given a location object, return the specified dataset ID
 */
export function getDatasetId(location) {
  if (location.query && location.query.ds) {
    return parseInt(location.query.ds, 10);
  }
}

/**
 * Given a location object, return an array of all metric IDs specified by the
 * ?metrics query parameter
 */
export function getMetricIds(location) {
  if (location.query && location.query.metrics) {
    return location.query.metrics.split(',').map(s => parseInt(s, 10));
  } else {
    return [];
  }
}

/**
 * Given a location object, return an array of all populations specified by the
 * ?pop query parameter.
 */
export function getPopulationNames(location) {
  if (location.query && location.query.pop) {
    return location.query.pop.split(',');
  } else {
    return [];
  }
}

export function addMissingQueryParameters(currentQueryParameters) {
  store.dispatch(urlActions.addMissingQueryParameters(currentQueryParameters));
}

export function updateQueryParameter(key, newValue) {
  store.dispatch(urlActions.updateQueryParameter(key, newValue));
}
