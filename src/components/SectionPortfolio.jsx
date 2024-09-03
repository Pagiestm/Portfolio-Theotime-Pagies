import React, { useState } from 'react';
import TripModal from './TripModal';
import CodeEditor from './CodeEditor';
import { motion } from "framer-motion";
import { FaSymfony } from 'react-icons/fa';
import { Button } from './ui/moving-border';
import { SiJavascript, SiTailwindcss, } from 'react-icons/si';
import { DiMysql } from 'react-icons/di';

const SectionPortfolio = () => {
  const initialScript = `function greet(name) {
    return 'Bonjour, ' + name + '!';
  }
  
  console.log(greet('tout le monde'));`;

  const [code, setCode] = useState(initialScript);
  const [output, setOutput] = useState('');
  const [projectsToShow, setProjectsToShow] = useState(3);

  const executeCode = () => {
    try {
      const consoleLog = [];
      const console = {
        log: (msg) => consoleLog.push(msg),
      };
      eval(code);
      setOutput(consoleLog.join('\n'));
    } catch (error) {
      setOutput(error.message);
    }
  };

  // Liste de tous mes projets dans mon portfolio
  const allProjects = [
    {
      title: "Click'n Party",
      description: "Clik'n Party est une plateforme dédiée à la location d'espaces événementiels uniques, où les utilisateurs peuvent proposer leurs biens pour divers types d'événements.",
      cardImage: "/images/projets/Click-n-party.png",
      modalTitle: "Click'n Party",
      modalContent: (
        <div>
          <p>Click'n Party est une plateforme dédiée à la location d'espaces événementiels uniques, où les utilisateurs peuvent proposer leurs biens pour divers types d'événements.</p>
          <ul className="list-disc list-inside">
            <li>Technologies utilisées : React, Node.js, MongoDB</li>
            <li>Fonctionnalités principales : Authentification, CRUD, API REST</li>
            <li>Défis rencontrés : Optimisation des performances, gestion des états</li>
            <li>Solutions apportées : Utilisation de Redux, mise en cache</li>
            <li>Prochaines étapes : Ajout de tests unitaires, déploiement sur AWS</li>
          </ul>
        </div>
      ),
      images: [
        "/images/projets/Click-n-party2.png",
        "/images/projets/Click-n-party3.png",
        "/images/projets/Click-n-party2.png"
      ],
      githubLink: "https://github.com/Pagiestm/Click-n-Party",
      siteLink: "https://click-n-party.mds-lille.yt/"
    },
    {
      title: "Click'n Party",
      description: "Projet réaliser à l'école deans le cadre du MyDigitalProject en 2024.",
      cardImage: "/images/projets/Click-n-party/Click-n-party.png",
      modalTitle: "Click'n Party",
      modalContent: (
        <div>
          <p className="text-center">Clik'n Party est une plateforme dédiée à la location d'espaces événementiels uniques, où les utilisateurs peuvent proposer leurs biens pour divers types d'événements.</p>
          <ul className="list-disc list-inside mt-4">
            <li>Groupe de 6 personnes constitué d'un designer, deux marketings, deux chefs de projet et moi même en développement.</li>
            <li>Réalisation : Digrammes de cas d'utilisation, de séquence, d'activité.</li>
            <li>Méthode Merise : MCD, MLD et MPD.</li>
            <li>Fonctionnalités principales : Authentification, location, réservation, paiement, facturation, commentaire, email...</li>
          </ul>
          <div className="flex flex-wrap mt-6">
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <FaSymfony className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#f7df1e] to-yellow-600 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <SiJavascript className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#38bdf8] to-teal-600 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <SiTailwindcss className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <DiMysql className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
          </div>
        </div>
      ),
      images: [
        "/images/projets/Click-n-party/Click-n-party2.png",
        "/images/projets/Click-n-party/Click-n-party3.png",
        "/images/projets/Click-n-party/Click-n-party2.png"
      ],
      pdf: "/images/projets/Click-n-party/Dossier-de-projet-Théotime-Pagies.pdf",
      githubLink: "https://github.com/Pagiestm/Click-n-Party",
      siteLink: "https://click-n-party.mds-lille.yt/"
    },
    {
      title: "Click'n Party 3",
      description: "Description pour le troisième projet.",
      cardImage: "/images/projets/Click-n-party.png",
      modalTitle: "Click'n Party 3",
      modalContent: (
        <div>
          <p>Click'n Party est une plateforme dédiée à la location d'espaces événementiels uniques, où les utilisateurs peuvent proposer leurs biens pour divers types d'événements.</p>
          <ul className="list-disc list-inside">
            <li>Technologies utilisées : React, Node.js, MongoDB</li>
            <li>Fonctionnalités principales : Authentification, CRUD, API REST</li>
            <li>Défis rencontrés : Optimisation des performances, gestion des états</li>
            <li>Solutions apportées : Utilisation de Redux, mise en cache</li>
            <li>Prochaines étapes : Ajout de tests unitaires, déploiement sur AWS</li>
          </ul>
        </div>
      ),
      images: [
        "/images/projets/Click-n-party2.png",
        "/images/projets/Click-n-party3.png",
        "/images/projets/Click-n-party2.png"
      ],
      githubLink: "https://github.com/Pagiestm/Click-n-Party-3",
      siteLink: "https://click-n-party-3.mds-lille.yt/"
    },
    {
      title: "Click'n Party 3",
      description: "Description pour le troisième projet.",
      cardImage: "/images/projets/Click-n-party.png",
      modalTitle: "Click'n Party 3",
      modalContent: (
        <div>
          <p>Click'n Party est une plateforme dédiée à la location d'espaces événementiels uniques, où les utilisateurs peuvent proposer leurs biens pour divers types d'événements.</p>
          <ul className="list-disc list-inside">
            <li>Technologies utilisées : React, Node.js, MongoDB</li>
            <li>Fonctionnalités principales : Authentification, CRUD, API REST</li>
            <li>Défis rencontrés : Optimisation des performances, gestion des états</li>
            <li>Solutions apportées : Utilisation de Redux, mise en cache</li>
            <li>Prochaines étapes : Ajout de tests unitaires, déploiement sur AWS</li>
          </ul>
        </div>
      ),
      images: [
        "/images/projets/Click-n-party2.png",
        "/images/projets/Click-n-party3.png",
        "/images/projets/Click-n-party2.png"
      ],
      githubLink: "https://github.com/Pagiestm/Click-n-Party-3",
      siteLink: "https://click-n-party-3.mds-lille.yt/"
    }
  ];

  // Fonction pour afficher plus de projets
  const showMoreProjects = () => {
    setProjectsToShow((prev) => Math.min(prev + 3, allProjects.length));
  };

  return (
    <section id="portfolio" className="flex flex-col justify-center items-center min-h-screen p-6 bg-gradient-to-b from-gray-800 to-gray-900">
      <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-md mb-6 mt-10">
        <h1 className="md:text-4xl text-3xl lg:text-5xl font-bold text-center text-white relative z-20">
          Mes projets
        </h1>
        <div className="w-[40rem] h-10 relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-10 mt-10 mb-10">
        {/* Affiche mes projets selon la limite définie par projectsToShow */}
        {allProjects.slice(0, projectsToShow).map((project, index) => (
          <TripModal
            key={index}
            title={project.title}
            description={project.description}
            cardImage={project.cardImage}
            modalTitle={project.modalTitle}
            modalContent={project.modalContent}
            images={project.images}
          >
            {project.pdf && (
              <motion.a
                href={project.pdf}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
              >
                Dossier de projet
              </motion.a>
            )}
            {project.githubLink && (
              <motion.a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
              >
                Code source
              </motion.a>
            )}
            {project.siteLink && (
              <motion.a
                href={project.siteLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
              >
                Consulter le site
              </motion.a>
            )}
          </TripModal>
        ))}
      </div>

      {/* Bouton pour afficher plus de projets */}
      {projectsToShow < allProjects.length && (
        <Button
          borderRadius="1.75rem"
          onClick={showMoreProjects}
          className="px-4 py-2 bg-slate-900 text-black text-white border-neutral-200 border-slate-800"
        >
          Voir plus de projets
        </Button>
      )}

      <CodeEditor code={code} setCode={setCode} executeCode={executeCode} output={output} />
    </section>
  );
};

export default SectionPortfolio;