const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  runCode: (data) => ipcRenderer.invoke('run-code', data),
  store: {
    get: (key) => ipcRenderer.invoke('electron-store-get', key),
    set: (key, value) => ipcRenderer.invoke('electron-store-set', { key, value }),
    delete: (key) => ipcRenderer.invoke('electron-store-delete', key)
  },
  languageServer: {
    start: (language) => ipcRenderer.invoke('start-language-server', language),
    stop: (language) => ipcRenderer.invoke('stop-language-server', language)
  }
});