import axios from 'axios';
import store from '../store';
import { getChartsSuccess } from '../actions/chart-actions';

const mockEndpoints = {
  GET_CHARTS: 'http://localhost:3009/charts'
};

const prodEndpoints = {
  // TODO: Likely subject to change.
  GET_CHARTS: 'https://moz-distribution-viewer.herokuapp.com/charts'
}

// TODO: Check node environment to set this.
const endpoints = mockEndpoints;

// Fetch list of charts.
export function getCharts() {
  return axios.get(endpoints.GET_CHARTS).then(response => {
    store.dispatch(getChartsSuccess(response.data));
    return response;
  }).catch(err => {
    console.error(err);
    return err;
  });
}
