import { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

const defaultCode = `#include <iostream>

int main() {
    std::cout << "Hello, WebAssembly!" << std::endl;
    return 0;
}`;

export function Editor() {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState('');

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRun = async () => {
    setOutput('Compiling and running...');
    try {
      // In a real implementation, this would compile and run the C++ code
      // using WebAssembly. For now, we'll just show the code.
      setOutput('Note: This is a demo. Actual C++ compilation requires Emscripten setup.\n\nYour code:\n' + code);
    } catch (error) {
      setOutput('Error: ' + error.message);
    }
  };

  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="h-[600px] bg-gray-800 rounded-lg overflow-hidden">
        <div id="monaco-editor"></div>
      </div>
      <div class="flex flex-col">
        <button 
          onclick="handleRun()"
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Run Code
        </button>
        <div class="bg-gray-800 rounded-lg p-4 h-[540px] overflow-auto">
          <pre class="text-green-400">${output}</pre>
        </div>
      </div>
    </div>
  `;
}