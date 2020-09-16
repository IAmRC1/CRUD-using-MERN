import React from 'react';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import SignUp from './components/signup';
import SignIn from './components/signin';
import Header from './defaults/header';
import Footer from './defaults/footer';
import Main from './components/main';
import Addanimal from './components/addanimal';
import Updateanimal from './components/updateanimal';
import './assets/styles/styles.css';

function App () {
  return (
    <BrowserRouter>
      <Route path="/" component={Header} />
      <Route path="/register" component={SignUp} />
      <Route path="/login" component={SignIn} />
      <Route path="/home" component={Main} />
      <Route path="/add" component={Addanimal} />
      <Route path="/update/:id" component={Updateanimal} />
      <Redirect to="/home" />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
