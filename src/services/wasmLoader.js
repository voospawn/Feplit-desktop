import { WASI } from '@wasmer/wasi';
import { WasmFs } from '@wasmer/wasmfs';
import { lowerI64Imports } from '@wasmer/wasm-transformer';

const wasmFs = new WasmFs();
let wasmModule = null;

export async function initWasm() {
  try {
    const response = await fetch('/wasm/compiler.wasm');
    const wasmBytes = await response.arrayBuffer();
    const loweredWasmBytes = await lowerI64Imports(new Uint8Array(wasmBytes));
    
    const wasi = new WASI({
      args: [],
      env: {},
      bindings: {
        ...WASI.defaultBindings,
        fs: wasmFs
      }
    });

    const module = await WebAssembly.compile(loweredWasmBytes);
    const instance = await WebAssembly.instantiate(module, {
      wasi_snapshot_preview1: wasi.wasiImport
    });

    wasmModule = instance;
    return true;
  } catch (error) {
    console.error('Failed to initialize WASM:', error);
    return false;
  }
}

export async function compileCode(code) {
  if (!wasmModule) {
    throw new Error('WASM module not initialized');
  }

  try {
    // Write code to virtual filesystem
    wasmFs.writeFileSync('/input.cpp', code);
    
    // Run the compiler
    await wasmModule.exports.compile('/input.cpp', '/output.wasm');
    
    // Read the output
    const output = wasmFs.readFileSync('/output.wasm');
    return output;
  } catch (error) {
    throw new Error(`Compilation failed: ${error.message}`);
  }
}