import { combineReducers } from 'redux';

// Individual reducers
import metricReducer from './metric-reducer';

var reducers = combineReducers({
  metricState: metricReducer
});

export default reducers;
