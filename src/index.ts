require('dotenv').config()
import * as path from 'path'
const { app, BrowserWindow, globalShortcut, ipcMain } = require('electron')
// @ts-ignore
const { main } = require('./MicrophoneStream')
// @ts-ignore
const notifier = require('./Notifier.js')
// @ts-ignore
const { phrases } = require('./phrases')

process.env.GOOGLE_APPLICATION_CREDENTIALS = 'keys.json'

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + '/preload.js',
    },
  })

  win.loadFile(__dirname + '../src/index.html')
  win.webContents.openDevTools()
}

let win: any

app.whenReady().then(() => {
  // Register a 'CommandOrControl+X' shortcut listener.
  const ret = globalShortcut.register('CommandOrControl+X', () => {
    main(...process.argv.slice(2))
  })

  if (!ret) {
    console.log('registration failed')
  }

  // Check whether a shortcut is registered.
  // console.log(globalShortcut.isRegistered('CommandOrControl+X'))

  // createWindow()
  win = new BrowserWindow({
    width: 600,
    height: 400,
    frame: false,
    autoHideMenuBar: false,
    transparent: false,
    resizable: true,
    alwaysOnTop: false,
    movable: true,
    visibleOnFullScreen: false,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
    },
  })

  // app.dock.hide()
  // win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
  // win.setAlwaysOnTop(true, 'modal-panel')

  win.loadFile(path.join(__dirname, '../src/index.html'))
  win.webContents.openDevTools()

  notifier.on('voice', (data: any) => {
    const transcription =
      data.results[0].alternatives[0].transcript.toLowerCase()
    if (phrases.includes(transcription)) {
      win.webContents.send('create-clock', transcription)
    }
    if (transcription === 'mid flash') {
      win.webContents.send('create-clock', transcription)
    }
    if (transcription === 'what is mid flash') {
      win.webContents.send('send-mid-update', transcription)
    }
  })
})

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+X')

  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})
