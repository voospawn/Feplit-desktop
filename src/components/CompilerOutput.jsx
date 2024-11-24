import React from 'react';

export function CompilerOutput({ output, error, isCompiling, isInitialized }) {
  return (
    <div className="flex flex-col h-[600px] bg-gray-800 rounded-lg p-4 overflow-hidden">
      <div className="flex-1 overflow-auto font-mono">
        {!isInitialized ? (
          <div className="text-yellow-400">
            Initializing C++ compiler...
          </div>
        ) : isCompiling ? (
          <div className="text-yellow-400">
            Compiling and running...
          </div>
        ) : error ? (
          <div className="text-red-400 whitespace-pre-wrap">
            {error}
          </div>
        ) : output ? (
          <div className="text-green-400 whitespace-pre-wrap">
            {output}
          </div>
        ) : (
          <div className="text-gray-400">
            Ready to compile. Click "Run" to execute your code.
          </div>
        )}
      </div>
    </div>
  );
}