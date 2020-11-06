import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './pages/Home';
import Player from './pages/Player';

const Routes = () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/player" exact component={Player} />
  </Switch>
);

export default Routes;
