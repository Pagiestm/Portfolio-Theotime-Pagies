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
      <h2 className="text-4xl font-bold mb-6 text-white relative">
        <span className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 opacity-20 blur-md rounded-lg"></span>
        <span className="relative text-shadow-lg">À Propos de Moi</span>
      </h2>
      <p className="text-lg max-w-2xl text-center mb-10 text-white">
        Passionné par le développement web et la création d'expériences numériques, je suis un développeur front-end avec une expertise en React et Tailwind CSS.
      </p>
      <CodeEditor code={code} setCode={setCode} executeCode={executeCode} output={output} />
    </section>
  );
};

export default SectionAbout;