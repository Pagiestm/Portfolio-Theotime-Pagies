import React from 'react';
import { CardSpotlight } from "./ui/card-spotlight";
import { FaVuejs, FaReact, FaSymfony, FaNodeJs } from 'react-icons/fa';
import { SiTailwindcss, SiExpress, SiPrisma, SiPostgresql, SiNestjs, SiFlutter, SiSass } from 'react-icons/si';
import { DiMysql } from 'react-icons/di';


const SectionAbout = () => {

  return (
    <section id="about" className="flex flex-col justify-center items-center min-h-screen p-6 bg-gray-800">
      <div className="bg-gray-800 w-full flex flex-col items-center justify-center overflow-hidden rounded-md mb-6 mt-10">
        <h1 className="md:text-4xl text-3xl lg:text-5xl font-bold text-center text-white relative z-20">
          À PROPOS
        </h1>
        <div className="w-[40rem] h-10 relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center justify-center w-full px-4 md:px-16">
        <div className="text-left w-full lg:w-1/2 mb-10 md:mb-0">
          <h3 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-8">
            Théotime Pagies
          </h3>
          <p className="text-lg max-w-2xl text-[#ffffffcc] mt-6 font-rubik mb-8 lg:mr-12">
            Je suis passionné par le développement web, l'innovation digitale et la gestion de projet. <br />
            <br />Titulaire d'un <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">BTS SIO « Services Informatiques aux Organisations »</span> en option <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">SLAM « Solution Logicielles et Applications Métiers » </span>que j'ai obtenu au lycée Dampierre à Valenciennes. Pendant cette période, j'ai pu réaliser deux stages à la CAF du Nord.<br />
            <br />J'ai poursuivi mes études avec un <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Bachelor Développeur Web | TP - Concepteur Développeur d'Applications de niveau 6 (BAC+3/4)</span>. J'ai eu l'opportunité de faire une alternance chez Yoozly de juillet 2023 à août 2024.<br />
            <br />Actuellement, je suis étudiant en <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">MBA Développeur Full Stack "Manager de projet web digital" de niveau 7 (BAC+5)</span>.<br />
            Je suis également en alternance chez Ailoop, où j'acquiers une expérience professionnelle précieuse en développement web et gestion de projets digitaux.
          </p>
        </div>
        <CardSpotlight className="h-96 w-80 flex flex-col items-center justify-center">
          <div className="grid grid-cols-3 gap-4 mt-4 z-20">
            <div className="bg-gradient-to-r from-[#42b883] to-green-600 p-4 rounded-full flex items-center justify-center">
              <FaVuejs className="text-white text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#58c4dc] to-blue-600 p-4 rounded-full flex items-center justify-center">
              <FaReact className="text-white text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-4 rounded-full flex items-center justify-center">
              <FaSymfony className="text-white text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#38bdf8] to-teal-600 p-4 rounded-full flex items-center justify-center">
              <SiTailwindcss className="text-white text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#84ba64] to-green-700 p-4 rounded-full flex items-center justify-center">
              <FaNodeJs className="text-white text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#000000] to-gray-800 p-4 rounded-full flex items-center justify-center">
              <SiExpress className="text-white text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#2f265f] to-blue-700 p-4 rounded-full flex items-center justify-center">
              <SiPrisma className="text-white text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 rounded-full flex items-center justify-center">
              <DiMysql className="text-white text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#699eca] to-blue-800 p-4 rounded-full flex items-center justify-center">
              <SiPostgresql className="text-white text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#ea2845] to-red-700 p-4 rounded-full flex items-center justify-center">
              <SiNestjs className="text-white text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#02569B] to-blue-600 p-4 rounded-full flex items-center justify-center">
              <SiFlutter className="text-white text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#CF649A] to-pink-600 p-4 rounded-full flex items-center justify-center">
              <SiSass className="text-white text-4xl" />
            </div>
          </div>
        </CardSpotlight>
      </div>
    </section>
  );
};

export default SectionAbout;