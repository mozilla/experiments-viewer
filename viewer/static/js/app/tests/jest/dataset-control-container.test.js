import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';

import DatasetControlContainer from '../../components/containers/dataset-control-container';
import datasetReducer from '../../reducers/dataset-reducer';
import * as datasetActions from '../../actions/dataset-actions';

describe('DatasetControlContainer', () => {
  let store;

  /* eslint-disable camelcase */
  const fetchedDatasets = [
    {
      date: '2016-12-31',
      subgroups: ['Linux', 'All'],
      populations: {
        A: { total_clients: 100, total_pings: 200 },
        B: { total_clients: 1000, total_pings: 1100 },
        C: { total_clients: 2000, total_pings: 2100 },
      },
    },
    {
      date: '2017-01-01',
      subgroups: ['Linux', 'All'],
      populations: {
        A: { total_clients: 200, total_pings: 300 },
        B: { total_clients: 2000, total_pings: 2100 },
        C: { total_clients: 3000, total_pings: 3100 },
      },
    },
    {
      date: '2017-02-28',
      subgroups: ['Linux', 'All'],
      populations: {
        A: { total_clients: 300, total_pings: 400 },
        B: { total_clients: 3000, total_pings: 3100 },
        C: { total_clients: 4000, total_pings: 4100 },
      },
    },
    {
      date: '2017-04-30',
      subgroups: ['Linux', 'All'],
      populations: {
        A: { total_clients: 400, total_pings: 500 },
        B: { total_clients: 4000, total_pings: 4100 },
        C: { total_clients: 5000, total_pings: 5100 },
      },
    },
    {
      date: '2017-05-01',
      subgroups: ['Linux', 'All'],
      populations: {
        A: { total_clients: 500, total_pings: 600 },
        B: { total_clients: 5000, total_pings: 5100 },
        C: { total_clients: 6000, total_pings: 6100 },
      },
    },
    {
      date: '2017-07-31',
      subgroups: ['Linux', 'All'],
      populations: {
        A: { total_pings: 600 },
        B: {},
        C: { total_clients: 6000 },
      },
    },
    {
      date: '2017-08-01',
      subgroups: ['Linux', 'All'],
      populations: {
        A: {},
        B: {},
        C: {},
      },
    },
  ];
  /* eslint-enable camelcase */

  const reducers = combineReducers({
    datasetState: datasetReducer,
  });

  const props = {
    sortedAllPopulations: ['A', 'B', 'C'],
    sortedPopulationsToShow: ['A', 'B', 'C'],
  };

  beforeEach(() => {
    store = createStore(reducers);
    store.dispatch(datasetActions.getDatasetsSuccess(fetchedDatasets));
  });

  it('Client and ping counts are correct', () => {
    fetchedDatasets.forEach((fd) => {
      store.dispatch(datasetActions.changeDataset(fd));
      const dcc = mount(<Provider store={store}><DatasetControlContainer {...props} /></Provider>);

      for (let populationName in fd.populations) {
        if (fd.populations.hasOwnProperty(populationName)) {

          const countElm = dcc.find(`.switch-and-counts.${populationName} .cohort-counts`);
          const thisPopClients = fd.populations[populationName].total_clients || 0;
          const thisPopPings = fd.populations[populationName].total_pings || 0;

          expect(countElm.text()).toContain(thisPopClients.toLocaleString('en-US') + ' clients');
          expect(countElm.text()).toContain(thisPopPings.toLocaleString('en-US') + ' pings');

        }
      }

      dcc.unmount();
    });
  });
});
