import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-10 py-4 bg-transparent z-50">
      <div className="text-2xl font-bold">MonPortfolio</div>
      <ul className="flex space-x-6">
        <li><a href="#home" className="hover:text-gray-400">Accueil</a></li>
        <li><a href="#about" className="hover:text-gray-400">À Propos</a></li>
        <li><a href="#portfolio" className="hover:text-gray-400">Portfolio</a></li>
        <li><a href="#contact" className="hover:text-gray-400">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
