import * as types from '../actions/action-types';


const initialState = {
  metrics: {},
};

const metricReducer = function(state = initialState, action) {
  switch(action.type) {
    case types.GET_METRIC_SUCCESS: {
      const newMetrics = Object.assign({}, state.metrics, {[action.metricId]: action.metric});
      return Object.assign({}, state, {metrics: newMetrics});
    }
  }

  return state;
};

export default metricReducer;
