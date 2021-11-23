const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // @ts-ignore
  send: (channel, data) => ipcRenderer.send(channel, data),
  // @ts-ignore
  receive: (channel, func) =>
    // @ts-ignore
    ipcRenderer.on(channel, (event, ...args) => func(args)),
})
