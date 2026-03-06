const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    title: 'M.I.K.A - Aralin 1',
    icon: path.join(__dirname, '..', 'pwa', 'assets', 'icon-512.png'),
    autoHideMenuBar: true,
    backgroundColor: '#5d4037',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile(path.join(__dirname, '..', 'pwa', 'index.html'));

  // Start in fullscreen for immersive experience (landscape)
  win.setFullScreen(false);
  win.maximize();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
