import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

import Users from './user/pages/Users';
import NewFootballer from './footballers/pages/NewFootballer';

const App = () => {
  return (
    <Router>
      <Switch> 
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/footballers/new" exact>
          <NewFootballer />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
