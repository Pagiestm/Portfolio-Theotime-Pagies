// TripModal.jsx
import React from 'react';
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalTrigger,
} from "./ui/animated-modal";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { motion } from "framer-motion";

const TripModal = ({
    title = "Default Title",
    description = "Default Description",
    buttonText = "Détails",
    cardImage = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    modalTitle = "Book your trip",
    modalContent, 
    images = [],
    children
}) => {
    return (
        <Modal>
            <CardContainer className="inter-var">
                <CardBody className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-300/[0.1] bg-gray-900 border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-3xl p-6 border">
                    <CardItem
                        translateZ="50"
                        className="text-xl font-bold text-neutral-600 text-white"
                    >
                        {title}
                    </CardItem>
                    <CardItem
                        as="p"
                        translateZ="60"
                        className="text-neutral-500 text-sm max-w-sm mt-2 text-neutral-300"
                    >
                        {description}
                    </CardItem>
                    <CardItem translateZ="100" className="w-full mt-4">
                        <img
                            src={cardImage}
                            height="1000"
                            width="1000"
                            className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                            alt="Card Thumbnail"
                        />
                    </CardItem>
                    <div className="flex justify-between items-center mt-10">
                        <CardItem
                            translateZ={20}
                            href="https://twitter.com/mannupaaji"
                            target="__blank"
                            className="px-4 py-2 rounded-xl text-xs font-normal text-white"
                        >
                            Consulter →
                        </CardItem>
                        <ModalTrigger>
                            <CardItem
                                translateZ={20}
                                as="button"
                                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                            >
                                {buttonText}
                            </CardItem>
                        </ModalTrigger>
                    </div>
                </CardBody>
            </CardContainer>
            <ModalBody>
                <ModalContent className="max-h-[80vh] overflow-y-auto">
                    <h4 className="text-lg md:text-2xl text-white font-bold text-center mb-8">
                        {modalTitle}{" "}
                    </h4>
                    <div className="flex justify-center items-center mb-8">
                        {images.map((image, idx) => (
                            <motion.div
                                key={"images" + idx}
                                style={{ rotate: Math.random() * 20 - 10 }}
                                whileHover={{ scale: 1.1, rotate: 0, zIndex: 100 }}
                                whileTap={{ scale: 1.1, rotate: 0, zIndex: 100 }}
                                className="rounded-xl -mr-4 mt-4 p-1 bg-white bg-neutral-800 border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
                            >
                                <img
                                    src={image}
                                    alt="project images"
                                    width="500"
                                    height="500"
                                    className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
                                />
                            </motion.div>
                        ))}
                    </div>
                    {modalContent ? (
                        modalContent
                    ) : (
                        <div className="py-10 flex flex-wrap gap-x-4 gap-y-6 items-start justify-start max-w-sm mx-auto">
                            <div className="flex items-center justify-center">
                                <span className="text-neutral-700 text-neutral-300 text-sm">
                                    Technologies utilisées : React, Node.js, MongoDB
                                </span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-neutral-700 text-neutral-300 text-sm">
                                    Fonctionnalités principales : Authentification, CRUD, API REST
                                </span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-neutral-700 text-neutral-300 text-sm">
                                    Défis rencontrés : Optimisation des performances, gestion des états
                                </span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-neutral-700 text-neutral-300 text-sm">
                                    Solutions apportées : Utilisation de Redux, mise en cache
                                </span>
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="text-neutral-700 text-neutral-300 text-sm">
                                    Prochaines étapes : Ajout de tests unitaires, déploiement sur AWS
                                </span>
                            </div>
                        </div>
                    )}
                </ModalContent>
                <ModalFooter className="gap-4">
                    {children ? (
                        children
                    ) : (
                        <>
                            <button className="px-2 py-1 bg-gray-200 text-black bg-black border-black text-white border border-gray-300 rounded-md text-sm w-28">
                                Cancel
                            </button>
                            <button className="bg-black text-white bg-white text-black text-sm px-2 py-1 rounded-md border border-black w-28">
                                Book Now
                            </button>
                        </>
                    )}
                </ModalFooter>
            </ModalBody>
        </Modal>
    );
};

export default TripModal;
