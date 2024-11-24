const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const which = require('which');
const Store = require('electron-store');

const store = new Store();
let mainWindow;
let languageServers = new Map();

async function detectCompilers() {
  const compilers = {
    python: await which('python3').catch(() => which('python')).catch(() => null),
    java: await which('javac').catch(() => null),
    cpp: await which('g++').catch(() => null)
  };

  return compilers;
}

async function startLanguageServer(language) {
  switch (language) {
    case 'cpp':
      return spawn('clangd', ['--background-index']);
    case 'python':
      return spawn('pylsp');
    case 'java':
      return spawn('jdtls');
    case 'javascript':
    case 'typescript':
      return spawn('typescript-language-server', ['--stdio']);
    default:
      return null;
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(async () => {
  const compilers = await detectCompilers();
  global.compilers = compilers;
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Cleanup language servers
  for (const [, server] of languageServers) {
    server.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('run-code', async (event, { language, code }) => {
  const compiler = global.compilers[language];
  if (!compiler) {
    throw new Error(`${language} compiler not found`);
  }

  return new Promise((resolve, reject) => {
    let output = '';
    let error = '';

    const process = spawn(compiler, ['-c', code]);

    process.stdout.on('data', (data) => {
      output += data.toString();
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(error);
      }
    });
  });
});

// Store handlers
ipcMain.handle('electron-store-get', async (event, key) => {
  return store.get(key);
});

ipcMain.handle('electron-store-set', async (event, { key, value }) => {
  store.set(key, value);
});

ipcMain.handle('electron-store-delete', async (event, key) => {
  store.delete(key);
});

// Language server handlers
ipcMain.handle('start-language-server', async (event, language) => {
  if (!languageServers.has(language)) {
    const server = await startLanguageServer(language);
    if (server) {
      languageServers.set(language, server);
      return true;
    }
  }
  return false;
});

ipcMain.handle('stop-language-server', async (event, language) => {
  const server = languageServers.get(language);
  if (server) {
    server.kill();
    languageServers.delete(language);
    return true;
  }
  return false;
});