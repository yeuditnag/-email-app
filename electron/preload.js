const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  sendMail: (data) => ipcRenderer.invoke('send-mail', data)
});

