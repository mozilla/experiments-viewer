import * as types from '../actions/action-types';


const initialState = {
  datasets: [],
  selectedDatasetId: 0,
  subgroup: '',

  currentDataset: {
    id: 0,
    name: '',
    metrics: [],
    populations: [],
    subgroups: []
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
    case types.SELECT_DATASET_UI: {
      return Object.assign({}, state, {selectedDatasetId: action.selectedDatasetId});
    }
    case types.CHANGE_SUBGROUP: {
      return Object.assign({}, state, {subgroup: action.subgroup});
    }
  }

  return state;
};

export default datasetReducer;
