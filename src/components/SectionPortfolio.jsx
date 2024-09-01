import React from 'react';

const SectionPortfolio = () => {
  return (
    <section id="portfolio" className="flex flex-col justify-center items-center min-h-screen p-10 bg-gray-900">
      <h2 className="text-4xl font-bold mb-6 text-white relative">
        <span className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 opacity-20 blur-md rounded-lg"></span>
        <span className="relative text-shadow-lg">Mes projets</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-5 rounded-md shadow-lg">
          <h3 className="text-2xl font-semibold mb-2">Projet 1</h3>
          <p className="text-sm text-gray-400">Description du projet ici...</p>
        </div>
      </div>
    </section>
  );
};

export default SectionPortfolio;
