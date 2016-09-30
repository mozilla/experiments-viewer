import * as types from '../actions/action-types';


const initialState = {
  isFetching: false,
  metrics: [],
  status: 200
};

const metricsReducer = function(state = initialState, action) {
  switch(action.type) {
    case types.GETTING_METRICS:
      return Object.assign({}, state, {isFetching: true});
    case types.GET_METRICS_SUCCESS:
      return Object.assign({}, state, {isFetching: false, metrics: action.metrics, status: 200});
    case types.GET_METRICS_FAILURE:
      return Object.assign({}, state, {isFetching: false, status: action.status});
  }

  return state;
};

export default metricsReducer;
