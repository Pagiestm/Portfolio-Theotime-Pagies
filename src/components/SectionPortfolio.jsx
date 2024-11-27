import React, { useState, useEffect } from 'react';
import TripModal from './TripModal';
import { motion } from "framer-motion";
import { Button } from './ui/moving-border';
import { FaSearch, FaVuejs, FaSymfony, FaNodeJs, FaReact, FaFigma, FaAngular, FaRust } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss, SiExpress, SiDart, SiFlutter, SiMongodb, SiPrisma, SiPostgresql, SiPlaywright, SiTauri } from 'react-icons/si';
import { DiMysql, DiSass } from 'react-icons/di';
import Select from 'react-select';
import largeprojectsData from '../../large-projects.json';
import smallprojectsData from '../../small-projects.json';

const iconComponents = {
  FaVuejs,
  FaSymfony,
  FaNodeJs,
  FaReact,
  FaFigma,
  FaAngular,
  FaRust,
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
  SiPlaywright,
  SiTauri
};

const SectionPortfolio = () => {

  const [largeProjectsToShow, setLargeProjectsToShow] = useState(3);
  const [smallProjectsToShow, setSmallProjectsToShow] = useState(3);
  const [allProjects, setAllProjects] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Charger les projets depuis le fichier JSON
    setAllProjects([...largeprojectsData, ...smallprojectsData]);
  }, []);

  const options = Object.keys(iconComponents).map(iconKey => ({
    value: iconKey,
    label: iconKey,
    IconComponent: iconComponents[iconKey],
  }));

  const handleChange = (selected) => {
    setSelectedOptions(selected || []);
  };

  // Filtre les petits et les gros projets
  const filteredProjects = allProjects.filter(project =>
    (selectedOptions.length === 0 || selectedOptions.some(option => project.logos.some(logo => logo.icon === option.value))) &&
    (searchQuery === '' || project.title.toLowerCase().includes(searchQuery.toLowerCase()) || project.logos.some(logo => logo.icon.toLowerCase().includes(searchQuery.toLowerCase())))
  );
  const smallProjects = filteredProjects.filter(project => project.size === 'small');
  const largeProjects = filteredProjects.filter(project => project.size === 'large');

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

      {/* Barre de recherche */}
      <div className="w-full flex justify-center mb-6">
        <div className="relative w-full md:w-4/5 lg:w-2/3 2xl:w-1/3">
          <input
            type="text"
            placeholder="Rechercher par titre ou langage..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-4 pr-10 rounded-2xl bg-gray-700 bg-opacity-30 text-white placeholder-gray-400 w-full focus:outline-none focus:ring-2 focus:border-purple-500"
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white" />
        </div>
      </div>

      {/* Composant de filtre */}
      <div className="flex flex-wrap justify-center mb-4 w-full md:w-3/4 lg:w-2/4">
        <Select
          isMulti
          options={options}
          onChange={handleChange}
          getOptionLabel={option => (
            <div className="flex items-center">
              <option.IconComponent className="mr-2" />
              {option.label.substring(2)}
            </div>
          )}
          getOptionValue={option => option.value}
          className="w-full"
          placeholder="Filtrer en fonction des langages, frameworks..."
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: '#4B5563',
              borderColor: '#4B5563', 
              color: '#FFFFFF',
              borderRadius: '1rem',
              '&:hover': {
                borderColor: '#4B5563', 
              },
              boxShadow: 'none',
            }),
            placeholder: (provided) => ({
              ...provided,
              color: '#D1D5DB',
            }),
            input: (provided) => ({
              ...provided,
              color: '#FFFFFF',
            }),
            multiValue: (provided) => ({
              ...provided,
              backgroundColor: '#192231',
              borderRadius: '1rem',
              color: '#FFFFFF',
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              color: '#FFFFFF',
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#192231',
                borderRadius: '1rem',
                color: '#FFFFFF',
              },
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: '#1F2937',
              color: '#FFFFFF',
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected ? '#4B5563' : state.isFocused ? '#4B5563' : '#1F2937',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#4B5563',
              },
            }),
            dropdownIndicator: (provided) => ({
              ...provided,
              color: '#FFFFFF',
              cursor: 'pointer',
              '&:hover': {
                color: '#FFFFFF',
              },
            }),
            clearIndicator: (provided) => ({
              ...provided,
              color: '#FFFFFF',
              cursor: 'pointer',
              '&:hover': {
                color: '#FFFFFF',
              },
            }),
          }}
        />
      </div>

      {/* Affiche un message si aucun projet n'est trouvé */}
      {filteredProjects.length === 0 && (
        <div className="text-white text-center mt-10">
          Aucun projet trouvé pour votre recherche.
        </div>
      )}

      {/* Section pour les gros projets */}
      {largeProjects.length > 0 && (
        <>
          <h2 className="text-2xl lg:text-3xl font-bold text-center text-white mt-10 mb-6">Gros Projets</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-10 mb-10">
            {largeProjects.slice(0, largeProjectsToShow).map((project, index) => (
              <TripModal
                key={index}
                title={project.title}
                description={project.description}
                badge={project.badge}
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
        </>
      )}

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
      {smallProjects.length > 0 && (
        <>
          <h2 className="text-2xl lg:text-3xl font-bold text-center text-white mt-10 mb-6">Petits Projets</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-10 mb-10">
            {smallProjects.slice(0, smallProjectsToShow).map((project, index) => (
              <TripModal
                key={index}
                title={project.title}
                description={project.description}
                badge={project.badge}
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
        </>
      )}

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
    </section>
  );
};

export default SectionPortfolio;