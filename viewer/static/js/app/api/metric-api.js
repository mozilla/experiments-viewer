import axios from 'axios';

import store from '../store';
import * as metricActions from '../actions/metric-actions';


export const endpoints = {
  GET_METRICS: `${location.origin}/metrics/`,
  GET_METRIC: `${location.origin}/metric/`,
};

// Return an object of metric metadata indexeded by metric ID. If a dataset is
// passed, only include metadata about metrics in that dataset. If an array of
// metricIDs is passed, only include metadata about those specific metrics.
// Otherwise, include metadata about all published metrics.
export function getMetricMetadata(dataset, metricIds) {
  store.dispatch(metricActions.gettingMetricMetadata());

  return axios.get(`${endpoints.GET_METRICS}?ds=${dataset}`).then(response => {
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
 * @param {Array} [pops] Optionally, an array of populations that should be
 *                       fetched. For example:
 *                       ['control', 'variation1', 'variation2']
 *                       If ommitted, all populations will be fetched.
 */
export function getMetric(dataset, metricId, pops, subgroup) {
  const qp = {};
  qp['ds'] = dataset;

  // If populations were not defined, don't included the pop query parameter.
  // When the pop query parameter is absent, all populations are fetched.
  if (pops) {
    qp['pop'] = pops.join(',');
  }

  if (subgroup) {
    qp['sg'] = subgroup;
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
