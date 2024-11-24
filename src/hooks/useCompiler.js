import { useState, useCallback, useEffect } from 'react';
import { wrap } from 'comlink';

let compilerWorker = null;

export function useCompiler() {
  const [isCompiling, setIsCompiling] = useState(false);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    async function initCompiler() {
      if (!compilerWorker) {
        const worker = new Worker(
          new URL('../services/compiler.worker.js', import.meta.url),
          { type: 'module' }
        );
        compilerWorker = wrap(worker);
        const initialized = await compilerWorker.init();
        setIsInitialized(initialized);
      }
    }

    initCompiler().catch(console.error);
  }, []);

  const compile = useCallback(async (code) => {
    if (!isInitialized) {
      setError('Compiler is not initialized');
      return;
    }

    setIsCompiling(true);
    setOutput('');
    setError('');

    try {
      const result = await compilerWorker.compile(code);
      if (result.success) {
        setOutput(result.output);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCompiling(false);
    }
  }, [isInitialized]);

  return {
    compile,
    isCompiling,
    output,
    error,
    isInitialized
  };
}