import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';
import { Button } from './ui/moving-border';

const SectionContact = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const form = useRef();
    const [errors, setErrors] = useState({});

    const handleMouseMove = (event) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    const calculateTransform = () => {
        const { x, y } = mousePosition;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        const rotateX = (deltaY / centerY) * 10;
        const rotateY = (deltaX / centerX) * -10;
        const translateX = (deltaX / centerX) * 10;
        const translateY = (deltaY / centerY) * 10;
        return `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(0deg) translateX(${translateX}px) translateY(${translateY}px) scale(1)`;
    };

    const validateForm = () => {
        const formElements = form.current.elements;
        const newErrors = {};

        if (!formElements.user_name.value.trim()) {
            newErrors.user_name = 'Le nom est requis.';
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formElements.user_email.value.trim()) {
            newErrors.user_email = 'L\'email est requis.';
        } else if (!emailPattern.test(formElements.user_email.value)) {
            newErrors.user_email = 'Le format de l\'email est incorrect.';
        }

        if (!formElements.message.value.trim()) {
            newErrors.message = 'Le message est requis.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const sendEmail = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        emailjs
            .sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                form.current,
                import.meta.env.VITE_EMAILJS_USER_ID
            )
            .then(
                () => {
                    toast.success('Email envoyé avec succès !');
                },
                (error) => {
                    toast.error(`Échec de l'envoi de l'email : ${error.text}`);
                },
            );
    };

    return (
        <section
            id="contact"
            className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-900 text-white px-4 md:px-16"
            onMouseMove={handleMouseMove}
        >
            <ToastContainer />
            <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-md mb-6 mt-10">
                <h1 className="md:text-4xl text-3xl lg:text-5xl font-bold text-center text-white relative z-20">
                    Me contacter
                </h1>
                <div className="w-[40rem] h-10 relative">
                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                    <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                    <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
                    <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
                </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between w-full mt-6 lg:mt-12">
                <div className="flex flex-col items-center w-full mb-12 lg:mb-0">
                    <div className="flex flex-col items-center w-full mt-10 md:mt-0">
                        <form ref={form} onSubmit={sendEmail} className="flex flex-col space-y-4 w-full max-w-md">
                            <label className="text-lg">Nom</label>
                            <input
                                type="text"
                                name="user_name"
                                className="p-4 rounded-2xl bg-gray-700 bg-opacity-30 text-white placeholder-gray-400"
                                placeholder="Votre nom"
                                required
                            />
                            {errors.user_name && <p className="text-red-500">{errors.user_name}</p>}
                            <label className="text-lg">Email</label>
                            <input
                                type="email"
                                name="user_email"
                                className="p-4 rounded-2xl bg-gray-700 bg-opacity-30 text-white placeholder-gray-400"
                                placeholder="Votre email"
                                required
                            />
                            {errors.user_email && <p className="text-red-500">{errors.user_email}</p>}
                            <label className="text-lg">Message</label>
                            <textarea
                                name="message"
                                className="p-4 rounded-2xl bg-gray-700 bg-opacity-30 text-white placeholder-gray-400 h-32"
                                placeholder="Votre message"
                                required
                            />
                            {errors.message && <p className="text-red-500">{errors.message}</p>}
                            <div className="flex justify-center w-full">
                                <Button
                                    type="submit"
                                    value="Envoyer"
                                    borderRadius="1.75rem"
                                    className="bg-slate-900 text-black text-white border-neutral-200 border-slate-800"
                                >
                                    Envoyer
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="relative flex flex-col justify-center items-center w-full mt-10 md:mt-0 text-animation">
                    <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 font-rubik" style={{ transform: calculateTransform(), transition: 'transform 0.1s' }}>Une question ?</p>
                    <div
                        className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-rubik"
                        style={{ transform: calculateTransform(), transition: 'transform 0.1s' }}
                    >
                        Contactez-moi !
                    </div>
                    <div className="flex space-x-6 mb-4 mt-10">
                        <a href="https://www.linkedin.com/in/th%C3%A9otime-pagies-7352bb221/" target="_blank" rel="noopener noreferrer" className="relative group">
                            <FaLinkedin className="text-3xl xl:text-4xl text-white group-hover:text-black transition-colors duration-300 relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300 rounded-full z-0"></div>
                        </a>
                        <a href="https://github.com/Pagiestm" target="_blank" rel="noopener noreferrer" className="relative group">
                            <FaGithub className="text-3xl xl:text-4xl text-white group-hover:text-black transition-colors duration-300 relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300 rounded-full z-0"></div>
                        </a>
                        <a href="mailto:pagiestm@gmail.com" className="relative group">
                            <FaEnvelope className="text-3xl xl:text-4xl text-white group-hover:text-black transition-colors duration-300 relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300 rounded-full z-0"></div>
                        </a>
                    </div>
                    <a href="mailto:pagiestm@gmail.com" className="text-base text-white">pagiestm@gmail.com</a>
                </div>
            </div>
        </section>
    );
};

export default SectionContact;
