import * as types from '../actions/action-types';


const initialState = {
  isFetching: false,
  subgroups: [],
  status: 200
};

const subgroupsReducer = function(state = initialState, action) {
  switch(action.type) {
    case types.GETTING_SUBGROUPS:
      return Object.assign({}, state, {isFetching: true});
    case types.GET_SUBGROUPS_SUCCESS:
      return Object.assign({}, state, {isFetching: false, subgroups: action.subgroups, status: 200});
    case types.GET_SUBGROUPS_FAILURE:
      return Object.assign({}, state, {isFetching: false, status: action.status});
  }

  return state;
};

export default subgroupsReducer;
