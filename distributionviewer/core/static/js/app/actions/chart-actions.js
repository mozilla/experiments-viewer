import * as types from './action-types';


export function getChartsSuccess(charts) {
  return {
    type: types.GET_CHARTS_SUCCESS,
    charts
  };
}
