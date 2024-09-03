import React, { useRef, useEffect } from 'react';
import { Button } from './ui/moving-border';

const CodeEditor = ({ code, setCode, executeCode, output }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    const el = codeRef.current;
    if (el) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(el.childNodes[0], el.textContent.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, [code]);

  const handleInput = (e) => {
    const el = codeRef.current;
    const selection = window.getSelection();
    const cursorPosition = selection.getRangeAt(0).startOffset;

    setCode(e.currentTarget.textContent);

    // Restore cursor position
    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      range.setStart(el.childNodes[0], cursorPosition);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }, 0);
  };

  return (
    <div className="flex flex-col md:flex-row items-start w-full max-w-4xl mt-6">
      <div className="flex-1 mb-6 md:mb-0 md:mr-6 w-full">
        <code
          ref={codeRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          className="w-full h-48 bg-gray-200 text-black p-4 rounded-2xl block whitespace-pre overflow-auto"
          style={{ backgroundColor: '#f0f0f0' }}
        >
          {code}
        </code>
        <div className="flex justify-center md:justify-start mt-4">
          <Button
            onClick={executeCode}
            borderRadius="1.75rem"
            className="bg-slate-900 text-black text-white border-neutral-200 border-slate-800"
          >
            Exécuter le Code
          </Button>
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