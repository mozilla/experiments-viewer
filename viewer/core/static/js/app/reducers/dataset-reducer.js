import * as types from '../actions/action-types';
import store from '../store';


const initialState = {
  datasets: [],
  currentDataset: {
    id: 0,
    name: '',
    populations: []
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
