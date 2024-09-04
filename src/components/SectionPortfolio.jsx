import React, { useState, useEffect } from 'react';
import TripModal from './TripModal';
import CodeEditor from './CodeEditor';
import { motion } from "framer-motion";
import { Button } from './ui/moving-border';
import { FaVuejs, FaSymfony, FaNodeJs, FaReact } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss, SiExpress, SiDart, SiFlutter, SiMongodb, SiPrisma, SiPostgresql, SiScikitlearn, SiPlaywright } from 'react-icons/si';
import { DiMysql, DiSass } from 'react-icons/di';
import largeprojectsData from '../../large-projects.json';
import smallprojectsData from '../../small-projects.json';

const iconComponents = {
  FaVuejs,
  FaSymfony,
  FaNodeJs,
  FaReact,
  SiJavascript,
  SiTailwindcss,
  SiExpress,
  SiDart,
  SiFlutter,
  SiMongodb,
  SiPrisma,
  SiPostgresql,
  DiMysql,
  DiSass,
  SiScikitlearn,
  SiPlaywright
};

const SectionPortfolio = () => {
  const initialScript = `function greet(name) {
    return 'Bonjour, ' + name + '!';
  }
  
  console.log(greet('tout le monde'));`;

  const [code, setCode] = useState(initialScript);
  const [output, setOutput] = useState('');
  const [largeProjectsToShow, setLargeProjectsToShow] = useState(3);
  const [smallProjectsToShow, setSmallProjectsToShow] = useState(3);
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    // Charger les projets depuis le fichier JSON
    setAllProjects([...largeprojectsData, ...smallprojectsData]);
  }, []);

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

  // Filtre les petits et les gros projets
  const smallProjects = allProjects.filter(project => project.size === 'small');
  const largeProjects = allProjects.filter(project => project.size === 'large');

  // Fonction pour afficher plus de gros projets
  const showMoreLargeProjects = () => {
    setLargeProjectsToShow((prev) => Math.min(prev + 3, largeProjects.length));
  };

  // Fonction pour afficher plus de petits projets
  const showMoreSmallProjects = () => {
    setSmallProjectsToShow((prev) => Math.min(prev + 3, smallProjects.length));
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

      {/* Section pour les gros projets */}
      <h2 className="text-2xl lg:text-3xl font-bold text-center text-white mt-10 mb-6">Gros Projets</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-10 mb-10">
        {largeProjects.slice(0, largeProjectsToShow).map((project, index) => (
          <TripModal
            key={index}
            title={project.title}
            description={project.description}
            cardImage={project.cardImage}
            modalTitle={project.modalTitle}
            modalContent={
              <div>
                <div dangerouslySetInnerHTML={{ __html: project.modalContent }} />
                <div className="flex flex-wrap mt-6">
                  {project.logos.map((logo, idx) => {
                    const IconComponent = iconComponents[logo.icon];
                    return (
                      <div key={idx} className={`bg-gradient-to-r ${logo.color} p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4`}>
                        <IconComponent className="text-white text-2xl md:text-3xl lg:text-4xl" />
                      </div>
                    );
                  })}
                </div>
              </div>
            }
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

      {/* Bouton pour afficher plus de gros projets */}
      {largeProjectsToShow < largeProjects.length && (
        <Button
          borderRadius="1.75rem"
          onClick={showMoreLargeProjects}
          className="px-4 py-2 bg-slate-900 text-black text-white border-neutral-200 border-slate-800 mb-10"
        >
          Voir plus de gros projets
        </Button>
      )}

      {/* Section pour les petits projets */}
      <h2 className="text-2xl lg:text-3xl font-bold text-center text-white mt-10 mb-6">Petits Projets</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-10 mb-10">
        {smallProjects.slice(0, smallProjectsToShow).map((project, index) => (
          <TripModal
            key={index}
            title={project.title}
            description={project.description}
            cardImage={project.cardImage}
            modalTitle={project.modalTitle}
            modalContent={
              <div>
                <div dangerouslySetInnerHTML={{ __html: project.modalContent }} />
                <div className="flex flex-wrap mt-6">
                  {project.logos.map((logo, idx) => {
                    const IconComponent = iconComponents[logo.icon];
                    return (
                      <div key={idx} className={`bg-gradient-to-r ${logo.color} p-4 rounded-full flex items-center justify-center w-14 h-14 mb-4 mr-4`}>
                        <IconComponent className="text-2xl md:text-3xl lg:text-4xl" style={{ color: logo.color.split(' ')[1] }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            }
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

      {/* Bouton pour afficher plus de petits projets */}
      {smallProjectsToShow < smallProjects.length && (
        <Button
          borderRadius="1.75rem"
          onClick={showMoreSmallProjects}
          className="px-4 py-2 bg-slate-900 text-black text-white border-neutral-200 border-slate-800 mb-10"
        >
          Voir plus de petits projets
        </Button>
      )}

      <CodeEditor code={code} setCode={setCode} executeCode={executeCode} output={output} />
    </section>
  );
};

export default SectionPortfolio;