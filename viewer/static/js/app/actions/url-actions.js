import * as types from './action-types';


export function addMissingQueryParameters(currentQueryParameters) {
  return {
    type: types.ADD_MISSING_QUERY_PARAMETERS,
    currentQueryParameters,
  };
}

export function updateQueryParameter(key, newValue) {
  return {
    type: types.UPDATE_QUERY_PARAMETER,
    key,
    newValue,
  };
}
