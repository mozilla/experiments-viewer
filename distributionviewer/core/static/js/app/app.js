import React from 'react';
import ReactDOM from 'react-dom';
import router from './router';
import { Provider } from 'react-redux';
import store from './store';


ReactDOM.render(
  <Provider store={store}>{router}</Provider>,
  document.getElementById('root')
);
