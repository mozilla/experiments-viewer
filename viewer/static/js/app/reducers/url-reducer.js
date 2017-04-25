import * as types from '../actions/action-types';
import { browserHistory } from 'react-router';


const defaultQueryParameters = {
  ds: 1,
  metrics: 'ALL',
  scale: 'linear',
  pop: 'ALL',
  showOutliers: false,
};

const initialState = {
  queryParameters: {},
};

function useQueryParameters(newQuery) {
  browserHistory.push({
    query: newQuery,
  });
}

const urlReducer = function(state = initialState, action) {
  switch(action.type) {
    case types.ADD_MISSING_QUERY_PARAMETERS: {
      const nextQP = Object.assign({}, defaultQueryParameters, action.currentQueryParameters);
      useQueryParameters(nextQP);
      return Object.assign({}, state, {queryParameters: nextQP});
    }
    case types.UPDATE_QUERY_PARAMETER: {
      const nextQP = Object.assign({}, state.queryParameters, {[action.key]: action.newValue});
      useQueryParameters(nextQP);
      return Object.assign({}, state, {queryParameters: nextQP});
    }
  }

  return state;
};

export default urlReducer;
