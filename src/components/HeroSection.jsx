import React from 'react';
import { motion } from 'framer-motion';
import TheotimePhoto from '../assets/Theotime.png';

const HeroSection = () => {
    return (
        <section
            id="home"
            className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 text-center md:text-left px-4 md:px-16"
        >
            {/* Conteneur pour l'image et l'animation */}
            <div className="relative flex justify-center items-center w-full mb-8 md:mb-0">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96 border-4 rounded-full"
                    style={{
                        borderColor: "transparent",
                        borderTopColor: "#3b82f6",
                        borderRightColor: "#3b82f6",
                    }}
                ></motion.div>

                <motion.img
                    src={TheotimePhoto}
                    alt="Théotime Pagies"
                    className="rounded-full w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 object-cover shadow-lg relative z-10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                />
            </div>

            {/* Conteneur pour le texte à gauche */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col items-center w-full md:pl-10 text-animation"
            >
                {/* Texte de bienvenue */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold mb-2 flex items-center mb-8">
                    Bienvenue, je suis
                </h2>

                {/* Nom avec dégradé animé */}
                <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-8">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                        Théotime Pagies
                    </span>
                </p>

                {/* Carte des compétences */}
                <div className="bg-white bg-opacity-20 backdrop-blur-lg p-3 rounded-2xl shadow-lg mb-8">
                    <p className="text-sm md:text-base lg:text-lg xl:text-xl text-white text-center">
                        Développeur Informatique • WEB • Full Stack
                    </p>
                </div>

                {/* Liste des compétences avec balises */}
                <div className="flex flex-col space-y-2">
                    <p className="text-base font-mono text-white">
                        &lt; Développeur web /&gt;
                    </p>
                    <p className="text-base font-mono text-white">
                        &lt; Développeur full stack /&gt;
                    </p>
                    <p className="text-base font-mono text-white">
                        &lt; Gestion de projet /&gt;
                    </p>
                </div>
            </motion.div>
        </section >
    );
};

export default HeroSection;
