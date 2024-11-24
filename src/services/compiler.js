import { wrap } from 'comlink';

let compilerWorker = null;

export async function initializeCompiler() {
  if (!compilerWorker) {
    const worker = new Worker(
      new URL('./compiler.worker.js', import.meta.url),
      { type: 'module' }
    );
    compilerWorker = wrap(worker);
    await compilerWorker.init();
  }
  return compilerWorker;
}