const { app, BrowserWindow, dialog, Tray, Menu } = require('electron');

const ipc = require('electron').ipcMain; // import IPC main

const path = require('path');

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // IPC main

  ipc.on('invokeAction', async event => {
    const myDialog = dialog.showMessageBox({
      message: 'Вы действительно хотите закрыть приложение?',
      buttons: ['Нет', 'Да'],
      cancelId: 0,
    })
    const data = await myDialog
    event.sender.send('actionReply', data.response);
    if (data.response === 1) {
      app.quit();
    }
  });

  //

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.webContents.openDevTools();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
