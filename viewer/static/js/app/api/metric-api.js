import axios from 'axios';

import store from '../store';
import * as metricActions from '../actions/metric-actions';


export const endpoints = {
  GET_SUBGROUPS: `${location.origin}/datasets/`,
  GET_METRICS: `${location.origin}/metrics/`,
  GET_METRIC: `${location.origin}/metric/`,
};

// Given a location object, return the specified dataset ID.
export function getDatasetId(location) {
  if (location.query && location.query.ds) {
    return parseInt(location.query.ds, 10);
  }
}

// Given a location object, return an array of all metric IDs specified in the
// ?metrics query parameter.
export function getSpecifiedMetricIds(location) {
  if (location.query && location.query.metrics) {
    return location.query.metrics.split(',').map(s => parseInt(s, 10));
  } else {
    return [];
  }
}

// Given a location object, return an array of all subgroups specified in the
// ?sg query parameter.
export function getSpecifiedSubgroups(location) {
  if (location.query && location.query.sg) {
    return location.query.sg.split(',');
  } else {
    return [];
  }
}

// Return an array of valid subgroups for the given dataset. For example:
// ['control', 'variation1', 'variation2']
export function getSubgroups(datasetId) {
  store.dispatch(metricActions.gettingSubgroups());
  return axios.get(endpoints.GET_SUBGROUPS).then(response => {
    const activeDatasetMeta = response.data.datasets.find(ds => {
      return ds.id === datasetId;
    });

    const subgroups = activeDatasetMeta.populations;
    store.dispatch(metricActions.getSubgroupsSuccess(subgroups));
    return subgroups;
  }).catch(error => {
    console.error(error);
    store.dispatch(metricActions.getSubgroupsFailure(error.status));
    return error;
  });
}

// Return an object of metric metadata indexed by metric ID. If an array of
// metricIds is passed, only include metadata about those metrics. Otherwise,
// include metadata about all published metrics.
export function getMetricMetadata(metricIds) {
  store.dispatch(metricActions.gettingMetricMetadata());

  return axios.get(endpoints.GET_METRICS).then(response => {
    let metricMetadata = response.data.metrics;
    const metricMetadataObject = {};

    if (metricIds) {
      metricMetadata = metricMetadata.filter(m => metricIds.indexOf(m.id) > -1);
    }

    metricMetadata.forEach(mm => {
      metricMetadataObject[mm.id] = mm;
    });

    store.dispatch(metricActions.getMetricMetadataSuccess(metricMetadataObject));
    return metricMetadata;
  }).catch(error => {
    console.error(error);
    store.dispatch(metricActions.getMetricMetadataFailure(error.status));
    return error;
  });
}

/**
 * Get a single metric
 *
 * @param metricId
 * @param {Array} [subgroups] Optionally, an array of subgroups that should be
 *                            fetched. For example:
 *                            ['control', 'variation1', 'variation2']
 *                            If ommitted, all subgroups will be fetched.
 */
export function getMetric(datasetId, metricId, subgroups) {
  const qp = {};
  qp['ds'] = datasetId;

  // If subgroups were not defined, don't included the pop query parameter. When
  // the pop query parameter is absent, all subgroups are fetched.
  if (subgroups) {
    qp['pop'] = subgroups.join(',');
  }

  let queryString = '';
  let i = 0;
  for (let key in qp) {
    if (qp.hasOwnProperty(key)) {
      if (i > 0) {
        queryString += '&';
      }
      queryString += `${key}=${qp[key]}`;
      i++;
    }
  }

  return axios.get(`${endpoints.GET_METRIC}${metricId}/?${queryString}`).then(response => {
    store.dispatch(metricActions.getMetricSuccess(metricId, response.data));
    return response.data;
  }).catch(error => {
    console.error(error);
    return error;
  });
}
