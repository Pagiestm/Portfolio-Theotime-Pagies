import React from 'react';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/index.scss';
import Background from './components/Background';

const App = () => {
  return (
    <div className="app">
      <Header />
      <Home />
      <Background />
      <Footer />
    </div>
  );
};

export default App;

