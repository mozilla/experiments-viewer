import { combineReducers } from 'redux';

// Individual reducers
import chartReducer from './chart-reducer';

var reducers = combineReducers({
  chartState: chartReducer
});

export default reducers;
