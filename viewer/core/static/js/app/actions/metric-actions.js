import * as types from './action-types';


export function gettingSubgroups() {
  return {
    type: types.GETTING_SUBGROUPS,
  };
}

export function getSubgroupsSuccess(subgroups) {
  return {
    type: types.GET_SUBGROUPS_SUCCESS,
    subgroups,
  };
}

export function getSubgroupsFailure(status) {
  return {
    type: types.GET_SUBGROUPS_FAILURE,
    status,
  };
}

export function gettingMetricMetadata() {
  return {
    type: types.GETTING_METRIC_METADATA
  };
}

export function getMetricMetadataSuccess(metadata) {
  return {
    type: types.GET_METRIC_METADATA_SUCCESS,
    metadata
  };
}

export function getMetricMetadataFailure(status) {
  return {
    type: types.GET_METRIC_METADATA_FAILURE,
    status
  };
}

export function getMetricSuccess(metricId, metric) {
  return {
    type: types.GET_METRIC_SUCCESS,
    metricId,
    metric,
  };
}
