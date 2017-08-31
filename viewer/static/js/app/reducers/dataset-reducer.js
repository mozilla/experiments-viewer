import * as types from '../actions/action-types';


const initialState = {
  datasets: [],
  selectedDataset: '',
  subgroup: '',

  currentDataset: {
    id: 0,
    name: '',
    slug: '',
    date: '',
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
      return Object.assign({}, state, {selectedDataset: action.selectedDataset});
    }
    case types.CHANGE_SUBGROUP: {
      return Object.assign({}, state, {subgroup: action.subgroup});
    }
  }

  return state;
};

export default datasetReducer;
