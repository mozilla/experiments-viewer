import { combineReducers } from 'redux';

// Individual reducers
import metricMetadataReducer from './metric-metadata-reducer';
import metricReducer from './metric-reducer';

var reducers = combineReducers({
  metricMetadataState: metricMetadataReducer,
  metricState: metricReducer,
});

export default reducers;
