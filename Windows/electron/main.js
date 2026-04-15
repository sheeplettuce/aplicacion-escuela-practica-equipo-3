const { app, BrowserWindow } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let backend;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets/icon.ico'),
    autoHideMenuBar: true,
  });

  win.loadFile(path.join(__dirname, 'renderer/index.html'));
  win.setMenu(null);
  Menu.setApplicationMenu(null);
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {

  // 🔥 Levantar backend
  backend = spawn('node', [path.join(__dirname, '../DEMSBACK/server.js')]);

  createWindow();
});

app.on('before-quit', () => {
  if (backend) backend.kill();
});