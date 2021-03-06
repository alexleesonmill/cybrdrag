import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Dashboard from '../Dashboard/Dashboard';
import Performers from '../performers/Performers';
import PerformersById from '../performer/PerformersById';
import PrivateRoute from '../routing/PrivateRoute';
import PerformersHistoryById from '../performerHistory/PerformerHistory';
import UserProfile from '../users/UserProfile';

const Routes = (props) => {
  return (
    <section className='container'>
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <PrivateRoute exact path='/performers' component={Performers} />
        <PrivateRoute exact path='/performers/:id' component={PerformersById} />
        <PrivateRoute
          exact
          path='/performers/history/:id'
          component={PerformersHistoryById}
        />
        <PrivateRoute exact path='/profile' component={UserProfile} />
      </Switch>
    </section>
  );
};

export default Routes;
