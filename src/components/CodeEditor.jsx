import React from 'react';

const CodeEditor = ({ code, setCode, executeCode, output }) => {
  return (
    <div className="flex flex-col md:flex-row items-start w-full max-w-4xl">
      <div className="flex-1 mb-6 md:mb-0 md:mr-6 w-full">
        <code
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setCode(e.currentTarget.textContent)}
          className="w-full h-48 bg-gray-200 text-black p-4 rounded-2xl block whitespace-pre overflow-auto"
          style={{ backgroundColor: '#f0f0f0' }}
        >
          {code}
        </code>
        <div className="flex justify-center md:justify-start">
          <button
            onClick={executeCode}
            className="mt-4 inline-block rounded-2xl px-8 py-3 text-sm font-medium transition hover:scale-110 hover:shadow-xl bg-gradient-to-r from-purple-500 to-blue-500"
          >
            Exécuter le Code
          </button>
        </div>
      </div>
      <div className="flex-1 w-full">
        <div className="bg-gray-900 rounded-t-2xl p-2 flex items-center">
          <span className="text-xl font-bold ml-2 font-mono">
            Response Area
          </span>
        </div>
        <div className="bg-black rounded-b-2xl p-4 h-[150px] w-full">
          <samp className="block whitespace-pre-wrap">{output}</samp>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;