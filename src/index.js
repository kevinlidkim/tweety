import React from 'react';  
import { Provider } from 'react-redux';
import { render } from 'react-dom';  
import { Router, browserHistory } from 'react-router';  
import routes from './routes';
import configureStore from './store/configureStore';

import {loadCats} from './actions/CatActions';
import {loginUser} from './actions/LoginActions';

const store = configureStore();

// store.dispatch(loadCats());
store.dispatch(loginUser('kev', 'li'));

render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('app')
);