import React from 'react';  
import { Route } from 'react-router';  
import App from './components/App';  
import Home from './components/Home';

import Login from './components/Login';
import SignUp from './components/SignUp';

import Profile from './components/user/Profile';
import OtherUsers from './components/user/OtherUsers';

export default (  
  <Route component={App}>
    <Route path="/" component={Home} />
    <Route path="/cats" component={Home} >
      <Route path="/cats/:id" component={Home} />
    </Route>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={SignUp} />
    <Route path="/profile" component={Profile} />
    <Route path="/user" component={OtherUsers} />
  </Route>
);