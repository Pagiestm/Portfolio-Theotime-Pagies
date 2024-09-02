import React, { useState } from 'react';
import CodeEditor from './CodeEditor';

const SectionAbout = () => {
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
    <section id="about" className="flex flex-col justify-center items-center min-h-screen p-10 bg-gray-800">
      <div className="bg-gray-800 w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
        <h1 className="md:text-4xl text-3xl lg:text-5xl font-bold text-center text-white relative z-20">
          À Propos de Moi
        </h1>
        <div className="w-[40rem] h-10 relative">
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
        </div>
      </div>
      <p className="text-lg max-w-2xl text-center mb-10 text-white mt-6">
        Passionné par le développement web et la création d'expériences numériques, je suis un développeur front-end avec une expertise en React et Tailwind CSS.
      </p>
      <CodeEditor code={code} setCode={setCode} executeCode={executeCode} output={output} />
    </section>
  );
};

export default SectionAbout;