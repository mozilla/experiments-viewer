import { combineReducers } from 'redux';

// Individual reducers
import subgroupsReducer from './subgroups-reducer';
import metricMetadataReducer from './metric-metadata-reducer';
import metricReducer from './metric-reducer';
import datasetReducer from './dataset-reducer';


var reducers = combineReducers({
  subgroupsState: subgroupsReducer,
  metricMetadataState: metricMetadataReducer,
  metricState: metricReducer,
  datasetState: datasetReducer,
});

export default reducers;
