import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import {
  SignUp, SignIn, Header, Footer, Main, AddAnimal, UpdateAnimal, Profile, UpdateProfile, ResetPassword, ChangePassword, ViewAnimal,
} from './components';
import { ScrollToTop } from './containers';
import './assets/styles/styles.css';
import { isAuthenticated } from './utils/helper';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Route path="/" component={Header} />
      <Route
        exact
        path="/"
        render={() => (
          isAuthenticated()
            ? <Redirect to="/home" />
            : <Redirect to="/register" />
        )}
      />
      <Route path="/register" component={SignUp} />
      <Route path="/login" component={SignIn} />
      <Route exact path="/resetpassword" component={ResetPassword} />
      <Route path="/resetpassword/:token" component={ChangePassword} />
      <Route path="/home" component={Main} />
      <Route path="/profile" component={Profile} />
      <Route path="/add" component={AddAnimal} />
      <Route path="/update/:id" component={UpdateAnimal} />
      <Route path="/view/:id" component={ViewAnimal} />
      <Route path="/updateprofile" component={UpdateProfile} />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
