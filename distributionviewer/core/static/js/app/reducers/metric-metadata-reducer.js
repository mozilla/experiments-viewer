import * as types from '../actions/action-types';


const initialState = {
  isFetching: false,
  metadata: [],
  hoverStrings: {},
  status: 200
};

const getHoverStrings = (metadata) => {
  let strings = {};

  metadata.map(metric => {
    strings['id-' + metric.id] = metric.tooltip;
  });

  return strings;
}

const metricMetadataReducer = function(state = initialState, action) {
  switch(action.type) {
    case types.GETTING_METRIC_METADATA:
      return Object.assign({}, state, {isFetching: true});
    case types.GET_METRIC_METADATA_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        metadata: action.metadata,
        hoverStrings: getHoverStrings(action.metadata),
        status: 200
      });
    case types.GET_METRIC_METADATA_FAILURE:
      return Object.assign({}, state, {isFetching: false, status: action.status});
  }

  return state;
};

export default metricMetadataReducer;
