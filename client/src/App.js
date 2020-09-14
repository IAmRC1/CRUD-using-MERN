import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
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
      <Route path="/" exact component={SignUp} />
      <Route path="/signin" component={SignIn} />
      <Route path="/main" component={Main} />
      <Route path="/add" component={Addanimal} />
      <Route path="/update/:id" component={Updateanimal} />
      <Footer />
      
    </BrowserRouter>
  );
}

export default App;
