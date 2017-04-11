import { combineReducers } from 'redux';

// Individual reducers
import subgroupsReducer from './subgroups-reducer';
import metricMetadataReducer from './metric-metadata-reducer';
import metricReducer from './metric-reducer';

var reducers = combineReducers({
  subgroupsState: subgroupsReducer,
  metricMetadataState: metricMetadataReducer,
  metricState: metricReducer,
});

export default reducers;
