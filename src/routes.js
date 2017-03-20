import React from 'react';  
import { Route } from 'react-router';  
import App from './components/App';  
import Home from './components/Home';

import CatsPage from './components/cats/CatsPage';  
import CatPage from './components/cats/CatPage';

import Login from './components/Login';
import SignUp from './components/SignUp';

export default (  
  <Route component={App}>
    <Route path="/" component={Home} />
    <Route path="/cats" component={Home} >
      <Route path="/cats/:id" component={Home} />
    </Route>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={SignUp} />
  </Route>
);