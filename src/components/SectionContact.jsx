import React from 'react';

const SectionContact = () => {
    return (
        <section id="contact" className="flex flex-col justify-center items-center min-h-screen p-6 bg-gradient-to-b from-gray-900 to-gray-900 text-white">
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
        </section>
    );
};

export default SectionContact;