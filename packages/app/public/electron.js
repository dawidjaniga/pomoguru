const { autoUpdater } = require('electron-updater')
const path = require('path')
const { app, BrowserWindow, Tray } = require('electron')
const isDev = require('electron-is-dev')
const { ipcMain } = require('electron')
const format = require('date-fns/format')

try {
  autoUpdater.checkForUpdatesAndNotify()
} catch (e) {
  console.error('AutoUpdate error ', e)
}

let tray = null
let mainWindow = null

try {
  require('electron-reloader')(module)
} catch (_) {}

app.dock.hide()

ipcMain.on('set-timer', (event, timeLeft) => {
  if (tray) {
    tray.setTitle(format(new Date(timeLeft * 1000), 'mm:ss'))
  }
})

ipcMain.on('checkUpdateClicked', () => {
  if (isDev) {
    autoUpdater.checkForUpdates()
  } else {
    autoUpdater.checkForUpdatesAndNotify()
  }
})

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 260,
    icon: path.join(__dirname, '../build/icon.png'),
    show: true,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      webSecurity: false,
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  mainWindow.webContents.setBackgroundThrottling(false)

  mainWindow.on('blur', () => {
    if (!mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide()
    }
  })

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3007'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )

  tray = new Tray(path.join(__dirname, getAppIconPath()))

  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
    toggleWindow()

    if (
      mainWindow &&
      mainWindow.isVisible &&
      mainWindow.isVisible() &&
      process.defaultApp &&
      event.metaKey
    ) {
      mainWindow.openDevTools({ mode: 'detach' })
    }
  })

  tray.setToolTip('Pomoguru')
  showWindow()

  mainWindow.on('closed', () => (mainWindow = null))
}

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    showWindow()
  }
}
const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds()
  const trayBounds = tray.getBounds()

  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  )
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return { x: x, y: y }
}

const showWindow = () => {
  const position = getWindowPosition()
  mainWindow.setPosition(position.x, position.y, false)
  mainWindow.show()
  mainWindow.focus()
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('active', () => {
  if (BrowserWin.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)

function getAppIconPath () {
  if (isDev) {
    return '../public/icon-small.png'
  } else {
    return '../build/icon-small.png'
  }
}
