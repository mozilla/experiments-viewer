import * as types from '../actions/action-types';


const initialState = {
  charts: []
};

const chartReducer = function(state = initialState, action) {
  switch(action.type) {
    case types.GET_CHARTS_SUCCESS:
      return Object.assign({}, state, {charts: action.charts.charts});
  }

  return state;
};

export default chartReducer;
