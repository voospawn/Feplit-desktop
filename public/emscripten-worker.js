// This file will be served statically and used to load Emscripten
self.importScripts('https://cdn.jsdelivr.net/npm/@emscripten/runtime@0.3.0/dist/emscripten.min.js');

self.Module = {
  print: function(text) {
    self.postMessage({ type: 'stdout', data: text });
  },
  printErr: function(text) {
    self.postMessage({ type: 'stderr', data: text });
  }
};