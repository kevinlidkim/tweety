import React from 'react';  
import { Route } from 'react-router';  
import App from './components/App';  
import Home from './components/Home';

import CatsPage from './components/cats/CatsPage';  
import CatPage from './components/cats/CatPage';

export default (  
  <Route component={App}>
    <Route path="/" component={Home} />
    <Route path="/cats" component={CatsPage} >
      <Route path="/cats/:id" component={CatPage} />
    </Route>
  </Route>
);