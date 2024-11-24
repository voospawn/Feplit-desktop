import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import { spawn } from 'child_process';
import which from 'which';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow;

async function detectCompilers() {
  const compilers = {
    python: await which('python3').catch(() => which('python')).catch(() => null),
    java: await which('javac').catch(() => null),
    cpp: await which('g++').catch(() => null)
  };

  return compilers;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
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
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

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