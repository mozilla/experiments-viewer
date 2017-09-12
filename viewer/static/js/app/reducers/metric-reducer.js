import * as types from '../actions/action-types';
import store from '../store';


const initialState = {
  metrics: {},
};

const metricReducer = function(state = initialState, action) {
  switch(action.type) {
    case types.GET_METRIC_SUCCESS: {
      let metric = action.metric;
      const endpoint = action.endpoint;
      metric.hoverString = store.getState().metricMetadataState.hoverStrings['id-' + action.metricId];

      const metricObject = { content: metric, endpoint: endpoint };
      const newMetrics = Object.assign({}, state.metrics, {[action.metricId]: metricObject});
      return Object.assign({}, state, {metrics: newMetrics});
    }
  }

  return state;
};

export default metricReducer;
