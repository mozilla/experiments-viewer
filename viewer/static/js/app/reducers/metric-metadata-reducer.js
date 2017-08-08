import * as types from '../actions/action-types';


const initialState = {
  isFetching: false,
  metadata: {},
  hoverStrings: {},
  status: 200
};

const getHoverStrings = (metadata) => {
  let strings = {};

  for (const id in metadata) {
    if (metadata.hasOwnProperty(id)) {
      var tooltip = metadata[id].tooltip;
      strings['id-' + id] = tooltip ? tooltip : '{pop}: x={x}, y={y}%, n={n}'
    }
  }

  return strings;
}

const metricMetadataReducer = function(state = initialState, action) {
  switch(action.type) {
    case types.GETTING_METRIC_METADATA:
      return Object.assign({}, state, {isFetching: true});
    case types.GET_METRIC_METADATA_SUCCESS: {
      const newMetadata = Object.assign({}, state.metadata, action.metadata);
      return Object.assign({}, state, {
        isFetching: false,
        metadata: newMetadata,
        hoverStrings: getHoverStrings(newMetadata),
        status: 200
      });
    }
    case types.GET_METRIC_METADATA_FAILURE:
      return Object.assign({}, state, {isFetching: false, status: action.status});
  }

  return state;
};

export default metricMetadataReducer;
