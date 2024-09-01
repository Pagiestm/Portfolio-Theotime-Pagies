import React from 'react';

const SectionPortfolio = () => {
  return (
    <section id="portfolio" className="flex flex-col justify-center items-center min-h-screen p-10 bg-gray-900">
      <h2 className="text-4xl font-bold mb-6">Mes Projets</h2>
      {/* Liste des projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Exemple de carte de projet */}
        <div className="bg-gray-800 p-5 rounded-md shadow-lg">
          <h3 className="text-2xl font-semibold mb-2">Projet 1</h3>
          <p className="text-sm text-gray-400">Description du projet ici...</p>
        </div>
        {/* Ajouter plus de cartes de projet */}
      </div>
    </section>
  );
};

export default SectionPortfolio;
