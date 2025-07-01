const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.handle('send-mail', async (event, { to, subject, body }) => {
  const outlook = require('winax').Object('Outlook.Application');
  const mail = outlook.CreateItem(0); // 0 = olMailItem
  mail.To = to;
  mail.Subject = subject;
  mail.Body = body;

  const attachmentPath = path.join(__dirname, 'resume.pdf');
  if (fs.existsSync(attachmentPath)) {
    mail.Attachments.Add(attachmentPath);
  }

  mail.Display(); // פותח את הטיוטה
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
