import React, { useState } from 'react';
import TripModal from './TripModal';
import CodeEditor from './CodeEditor';
import { motion } from "framer-motion";
import { Button } from './ui/moving-border';
import { FaVuejs, FaSymfony, FaNodeJs } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss, SiExpress, SiDart, SiFlutter, SiMongodb, SiPrisma, SiPostgresql } from 'react-icons/si';
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
      title: "CarbonTrack - juillet à août 2024",
      description: "CarbonTrack est une application innovante destinée à aider les personnes à calculer, suivre et réduire l'empreinte carbone des matériaux utilisés dans leurs projets de construction. Elle permet une gestion efficace des projets tout en favorisant des pratiques de construction durables.",
      cardImage: "/images/projets/CarbonTrack/CarbonTrack.png",
      modalTitle: "CarbonTrack",
      modalContent: (
        <div>
          <p>CarbonTrack est une application innovante destinée à aider les personnes à calculer, suivre et réduire l'empreinte carbone des matériaux utilisés dans leurs projets de construction. Elle permet une gestion efficace des projets tout en favorisant des pratiques de construction durables.</p>
          <ul className="list-disc list-inside mt-4">
            <li>Projet pour monter en compétence sur vue, prisma et express.</li>
            <li>Méthode Merise : MCD, MLD et MPD.</li>
            <li>Fonctionnalités principales : Authentification + Auth avec google, Mot de passe oublié, Envoie d'email, Gestion de vos projets, visualisations des données (graphiques), Gestion du profil, Gestion des materiaux et catégories (Admin) ...</li>
            <li>Le projet est en production sur render pour l'api, vercel pour le front et supabase pour la base de données.</li>
            <li>Le site est entièrement responsive et donc s'adapte sur tout type d'écran.</li>
          </ul>
          <p className="text-red-600 mt-2 mb-2"> Attention pour les tests du site en production : L'api est déployé sur render (version gratuite), le serveur démarre au bout de 40 secondes et il y a des lenteurs ce qui est normal avec la version gratuite !</p>
          <div className="flex flex-wrap mt-6">
            <div className="bg-gradient-to-r from-[#84ba64] to-green-700 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <FaNodeJs className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <SiExpress className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#2f265f] to-blue-700 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <SiPrisma className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#699eca] to-blue-800 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <SiPostgresql className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#42b883] to-green-600 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <FaVuejs className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
          </div>
        </div>
      ),
      images: [
        "/images/projets/CarbonTrack/CarbonTrack3.png",
        "/images/projets/CarbonTrack/CarbonTrack2.png",
        "/images/projets/CarbonTrack/CarbonTrack4.png",
        "/images/projets/CarbonTrack/CarbonTrack5.png",
        "/images/projets/CarbonTrack/CarbonTrack6.png",
        "/images/projets/CarbonTrack/CarbonTrack7.png",
        "/images/projets/CarbonTrack/CarbonTrack8.png"
      ],
      api: "https://carbontrack.onrender.com/api-docs",
      githubLink: "https://github.com/Pagiestm/CarbonTrack",
      siteLink: "https://carbon-track-one.vercel.app/"
    },
    {
      title: "Click'n Party - avril à juin 2024",
      description: "Clik'n Party est une plateforme dédiée à la location d'espaces événementiels uniques, où les utilisateurs peuvent proposer leurs biens pour divers types d'événements. En connectant directement les propriétaires de lieux exceptionnels avec les organisateurs d'événements.",
      cardImage: "/images/projets/Click-n-party/Click-n-party.png",
      modalTitle: "Click'n Party",
      modalContent: (
        <div>
          <p>Clik'n Party est une plateforme dédiée à la location d'espaces événementiels uniques, où les utilisateurs peuvent proposer leurs biens pour divers types d'événements.</p>
          <ul className="list-disc list-inside mt-4">
            <li>Groupe de 6 personnes constitué d'un designer, deux marketings, deux chefs de projet et moi même en développement.</li>
            <li>Réalisation : Digrammes de cas d'utilisation, de séquence, d'activité.</li>
            <li>Méthode Merise : MCD, MLD et MPD.</li>
            <li>Fonctionnalités principales : Authentification, location, réservation, paiement, facturation, commentaire, adminsitration...</li>
            <li>Le site est entièrement responsive et donc s'adapte sur tout type d'écran.</li>
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
        "/images/projets/Click-n-party/Click-n-party7.png",
        "/images/projets/Click-n-party/Click-n-party8.png",
        "/images/projets/Click-n-party/Click-n-party3.png",
        "/images/projets/Click-n-party/Click-n-party4.png",
        "/images/projets/Click-n-party/Click-n-party5.png",
        "/images/projets/Click-n-party/Click-n-party6.png"
      ],
      pdf: "/images/projets/Click-n-party/Dossier-de-projet-Théotime-Pagies.pdf",
      githubLink: "https://github.com/Pagiestm/Click-n-Party",
      siteLink: "https://click-n-party.mds-lille.yt/"
    },
    {
      title: "Luminous Movies - mai à juin 2024",
      description: "Luminous-Movies est une application permettant d'accéder aux informations sur des films. Elle offre des fonctionnalités telles que l'inscription, l'authentification, l'ajout de films aux favoris et la recherche. De plus, une interface d'administration a été développée pour la gestion des films et des catégories.",
      cardImage: "/images/projets/Luminous-Movies/Luminous-Movies.png",
      modalTitle: "Luminous Movies",
      modalContent: (
        <div>
          <p>Luminous-Movies est une application permettant d'accéder aux informations sur des films. Cette application offre des fonctionnalités telles que l'inscription, l'authentification, l'ajout de films aux favoris et la recherche de films. De plus, une interface d'administration a été développée pour la gestion complète des films et des catégories.</p>
          <ul className="list-disc list-inside mt-4">
            <li>Ce projet à était réalisé par groupe de 3 personnes pendant le cours de développement mobile.</li>
            <li>Création de la maquette sur figma.</li>
            <li>Réalisation : Digramme de cas d'utilisation.</li>
            <li>Fonctionnalités principales : Authentification, consultation des détails d'un film, notation (sur 5), favoris, recherche, gestion du profil, gestion des films et catégories (Admin).</li>
          </ul>
          <div className="flex flex-wrap mt-6">
            <div className="bg-gradient-to-r from-[#84ba64] to-green-700 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <FaNodeJs className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#47a248] to-green-700 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <SiMongodb className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#000000] to-gray-800 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <SiExpress className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#00c4b3] to-blue-600 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <SiDart className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
            <div className="bg-gradient-to-r from-[#02569b] to-blue-800 p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4">
              <SiFlutter className="text-white text-2xl md:text-3xl lg:text-4xl" />
            </div>
          </div>
        </div>
      ),
      images: [
        "/images/projets/Luminous-Movies/Luminous-Movies2.png",
        "/images/projets/Luminous-Movies/Luminous-Movies7.png",
        "/images/projets/Luminous-Movies/Luminous-Movies8.png",
        "/images/projets/Luminous-Movies/Luminous-Movies3.png",
        "/images/projets/Luminous-Movies/Luminous-Movies4.png",
        "/images/projets/Luminous-Movies/Luminous-Movies5.png",
        "/images/projets/Luminous-Movies/Luminous-Movies6.png",
        "/images/projets/Luminous-Movies/Luminous-Movies7.png",
        "/images/projets/Luminous-Movies/Luminous-Movies8.png",
        "/images/projets/Luminous-Movies/Luminous-Movies9.png",
        "/images/projets/Luminous-Movies/Luminous-Movies10.png"
      ],
      figma: "https://www.figma.com/design/zhMUnAN6hLZLXXYG8TjufX/Application-Mobile?node-id=1-24&node-type=CANVAS&t=WgTDf6b9B2ZUPuGZ-0",
      githubLink: "https://github.com/Pagiestm/Luminous-Movies",
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

      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-10 mt-10 mb-10">
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
            {project.api && (
              <motion.a
                href={project.api}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
              >
                Documentation API
              </motion.a>
            )}
            {project.figma && (
              <motion.a
                href={project.figma}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold"
              >
                Maquette
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