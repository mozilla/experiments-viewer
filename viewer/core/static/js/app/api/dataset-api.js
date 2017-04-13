import axios from 'axios';

import store from '../store';
import * as datasetActions from '../actions/dataset-actions';


const endpoints = {
  GET_DATASETS: `${location.origin}/datasets/`
}

export function getDatasets() {
  store.dispatch(datasetActions.gettingDatasets());

  return axios.get(endpoints.GET_DATASETS).then(response => {
    let datasets = response.data.datasets;
    store.dispatch(datasetActions.getDatasetsSuccess(datasets));
    return datasets;
  }).catch(error => {
    console.error(error);
    store.dispatch(datasetActions.getDatasetsFailure(error.status));
    return error;
  });
}
