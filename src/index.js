import React from 'react';  
import { Provider } from 'react-redux';
import { render } from 'react-dom';  
import { Router, browserHistory } from 'react-router';  
import routes from './routes';
import configureStore from './store/configureStore';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';


const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

render(
  <Provider store={store}>
    <Router routes={routes} history={history} />
  </Provider>,
  document.getElementById('app')
);