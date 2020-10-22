import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Header, Footer } from './components';
import { ScrollToTop } from './containers';
import './assets/styles/styles.css';
import AppRoutes from './routes';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Route path="/" component={Header} />
      <AppRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
