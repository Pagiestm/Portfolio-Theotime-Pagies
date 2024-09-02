import React, { useState } from 'react';
import TripModal from './TripModal';
import CodeEditor from './CodeEditor';
import { motion } from "framer-motion";

const SectionPortfolio = () => {
  const initialScript = `function greet(name) {
    return 'Bonjour, ' + name + '!';
  }
  
  console.log(greet('tout le monde'));`;

  const [code, setCode] = useState(initialScript);
  const [output, setOutput] = useState('');

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
        <TripModal
          title="Click'n Party"
          description="Clik'n Party est une plateforme dédiée à la location d'espaces événementiels uniques, où les utilisateurs peuvent proposer leurs biens pour divers types d'événements."
          buttonText="Details"
          cardImage="/images/projets/Click-n-party.png"
          modalTitle="Click'n Party"
          modalContent={
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
          }
          images={[
            "/images/projets/Click-n-party2.png",
            "/images/projets/Click-n-party3.png",
            "/images/projets/Click-n-party2.png"
          ]}
        >
          <motion.a
            href="https://github.com/Pagiestm/Click-n-Party"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Code source
          </motion.a>
          <motion.a
            href="https://click-n-party.mds-lille.yt/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Consulter le site
          </motion.a>
        </TripModal>

        <TripModal
          title="Click'n Party"
          description="Clik'n Party est une plateforme dédiée à la location d'espaces événementiels uniques, où les utilisateurs peuvent proposer leurs biens pour divers types d'événements."
          buttonText="Details"
          cardImage="/images/projets/Click-n-party.png"
          modalTitle="Click'n Party"
          modalContent={
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
          }
          images={[
            "/images/projets/Click-n-party2.png",
            "/images/projets/Click-n-party3.png",
            "/images/projets/Click-n-party2.png"
          ]}
        >
          <motion.a
            href="https://github.com/Pagiestm/Click-n-Party"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Code source
          </motion.a>
          <motion.a
            href="https://click-n-party.mds-lille.yt/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Consulter le site
          </motion.a>
        </TripModal>

        <TripModal
          title="Click'n Party"
          description="Clik'n Party est une plateforme dédiée à la location d'espaces événementiels uniques, où les utilisateurs peuvent proposer leurs biens pour divers types d'événements."
          buttonText="Details"
          cardImage="/images/projets/Click-n-party.png"
          modalTitle="Click'n Party"
          modalContent={
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
          }
          images={[
            "/images/projets/Click-n-party2.png",
            "/images/projets/Click-n-party3.png",
            "/images/projets/Click-n-party2.png"
          ]}
        >
          <motion.a
            href="https://github.com/Pagiestm/Click-n-Party"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Code source
          </motion.a>
          <motion.a
            href="https://click-n-party.mds-lille.yt/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            Consulter le site
          </motion.a>
        </TripModal>
      </div>
      <CodeEditor code={code} setCode={setCode} executeCode={executeCode} output={output} />
    </section>
  );
};

export default SectionPortfolio;