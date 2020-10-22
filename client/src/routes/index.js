/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Switch } from 'react-router-dom';
import { AppRoute, PrivateRoute } from './AppRoute';
import routes from './routes';

const token = localStorage.getItem('token');

export default function AppRoutes() {
  let isAuthenticated = false;

  if (token) {
    isAuthenticated = true;
  }
  return (
    <Switch>
      {routes.map((route, i) => (
        route.guest
          ? <AppRoute isAuthenticated={isAuthenticated} key={i} {...route} />
          : <PrivateRoute isAuthenticated={isAuthenticated} key={i} {...route} />
      ))}
    </Switch>
  );
}
