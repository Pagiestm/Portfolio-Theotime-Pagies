import React from 'react';

const SectionPortfolio = () => {
  return (
    <section id="portfolio" className="flex flex-col justify-center items-center min-h-screen p-10 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
        <h1 className="md:text-4xl text-3xl lg:text-5xl font-bold text-center text-white relative z-20">
          Mes projets
        </h1>
        <div className="w-[40rem] h-40 relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
        <div className="bg-gray-800 p-5 rounded-md shadow-lg">
          <h3 className="text-2xl font-semibold mb-2">Projet 1</h3>
          <p className="text-sm text-gray-400">Description du projet ici...</p>
        </div>
      </div>
    </section>
  );
};

export default SectionPortfolio;