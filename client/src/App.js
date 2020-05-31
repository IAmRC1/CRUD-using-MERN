import React from 'react';
import Header from './defaults/header';
import Footer from './defaults/footer';
import Main from './components/main';
import Addanimal from './components/addanimal';
import Updateanimal from './components/updateanimal';
import './styles/animals.css';
import { BrowserRouter, Route } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Header />
        <Route path="/" exact component={Main} />
        <Route path="/add" component={Addanimal} />
        <Route path="/update/:id" component={Updateanimal} />
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
