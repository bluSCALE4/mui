import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom'

import MainContent from 'Components/MainContent';
import Header from 'Components/Header';

import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <MainContent />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
