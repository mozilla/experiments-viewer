import * as types from '../actions/action-types';


const initialState = {
  isFetching: false,
  item: {},
  items: [],
  status: 200
};

const metricReducer = function(state = initialState, action) {
  switch(action.type) {
    case types.GETTING_METRICS:
      return Object.assign({}, state, {isFetching: true});
    case types.GET_METRICS_SUCCESS:
      return Object.assign({}, state, {isFetching: false, items: action.items});
    case types.GET_METRICS_FAILURE:
      return Object.assign({}, state, {isFetching: false, status: action.status});
  }

  return state;
};

export default metricReducer;
