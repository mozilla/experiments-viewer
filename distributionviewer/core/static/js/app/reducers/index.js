import { combineReducers } from 'redux';

// Individual reducers
import metricsMetadataReducer from './metrics-metadata-reducer';
import metricsReducer from './metrics-reducer';
import metricReducer from './metric-reducer';

var reducers = combineReducers({
  metricsMetadataState: metricsMetadataReducer,
  metricsState: metricsReducer,
  metricState: metricReducer,
});

export default reducers;
