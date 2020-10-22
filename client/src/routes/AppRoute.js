/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const AppRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => <Component {...props} />}
  />
);

const PrivateRoute = ({ isAuthenticated, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />)}
  />
);

export {
  AppRoute,
  PrivateRoute,
};
