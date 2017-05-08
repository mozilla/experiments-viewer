import * as types from '../actions/action-types';


const initialState = {
  datasets: [],
  currentDataset: {
    id: 0,
    name: '',
    metrics: [],
    populations: [],
  },
};

const datasetReducer = function(state = initialState, action) {
  switch(action.type) {
    case types.GET_DATASETS_SUCCESS: {
      return Object.assign({}, state, {datasets: action.datasets});
    }
    case types.CHANGE_DATASET: {
      return Object.assign({}, state, {currentDataset: action.currentDataset});
    }
  }

  return state;
};

export default datasetReducer;
