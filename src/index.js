import React from 'react';  
import { Provider } from 'react-redux';
import { render } from 'react-dom';  
import { Router, browserHistory } from 'react-router';  
import routes from './routes';
// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import configureStore from './store/configureStore';

import {loadCats} from './actions/catActions';

const store = configureStore();

store.dispatch(loadCats());

render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('app')
);