import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import DatasetDateContainer from '../../components/containers/dataset-date-container';
import datasetReducer from '../../reducers/dataset-reducer';
import * as datasetActions from '../../actions/dataset-actions';


describe('DatasetDateContainer', () => {
  let store, ddc;

  const fetchedDatasets = [
    { date: '2016-12-31' },
    { date: '2017-01-01' },
    { date: '2017-02-28' },
    { date: '2017-04-30' },
    { date: '2017-05-01' },
  ];

  const reducers = combineReducers({
    datasetState: datasetReducer,
  });

  beforeEach(() => {
    store = createStore(reducers);
    store.dispatch(datasetActions.getDatasetsSuccess(fetchedDatasets));
    store.dispatch(datasetActions.changeDataset(fetchedDatasets[0]));
    ddc = mount(<Provider store={store}><DatasetDateContainer /></Provider>);
  });

  it('Date is parsed correctly', () => {
    const dateElm = ddc.find('.dataset-date');

    expect(dateElm.text()).toBe('December 31, 2016');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[1]));
    expect(dateElm.text()).toBe('January 1, 2017');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[2]));
    expect(dateElm.text()).toBe('February 28, 2017');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[3]));
    expect(dateElm.text()).toBe('April 30, 2017');

    store.dispatch(datasetActions.changeDataset(fetchedDatasets[4]));
    expect(dateElm.text()).toBe('May 1, 2017');
  });
});
