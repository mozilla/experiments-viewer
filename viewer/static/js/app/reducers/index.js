import { combineReducers } from 'redux';

// Individual reducers
import metricMetadataReducer from './metric-metadata-reducer';
import metricReducer from './metric-reducer';
import datasetReducer from './dataset-reducer';
import urlReducer from './url-reducer';


var reducers = combineReducers({
  metricMetadataState: metricMetadataReducer,
  metricState: metricReducer,
  datasetState: datasetReducer,
  urlState: urlReducer,
});

export default reducers;
