import React from 'react';
import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import SectionAbout from './components/SectionAbout';
import SectionPortfolio from './components/SectionPortfolio';
import SectionContact from './components/SectionContact';
import './index.css'
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-sans bg-gray-900 text-white">
      <Navbar />
      <HeroSection />
      <SectionAbout />
      <SectionPortfolio />
      <SectionContact />
      <Footer />
    </div>
  );
}

export default App;