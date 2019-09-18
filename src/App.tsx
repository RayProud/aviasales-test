import React from 'react';
import './App.css';
import Layovers from './components/layovers/layovers';
import Tickets from './components/tickets/tickets';
import Header from './components/header/header';

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <Layovers />
      <Tickets />
    </div>
  );
}

export default App;
