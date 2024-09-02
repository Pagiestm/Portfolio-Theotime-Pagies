import React from 'react';
import { SparklesCore } from "./ui/sparkles";

const SectionPortfolio = () => {
  return (
    <section id="portfolio" className="flex flex-col justify-center items-center min-h-screen p-10 bg-gray-900">
      <div className="bg-gray-900 w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
        <h1 className="md:text-4xl text-3xl lg:text-5xl font-bold text-center text-white relative z-20">
          Mes projets
        </h1>
        <div className="w-[40rem] h-40 relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />

          <div className="absolute inset-0 bg-gray-900 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
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
