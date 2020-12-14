const path = require('path')
const { app, BrowserWindow, Menu, Tray } = require('electron')
const isDev = require('electron-is-dev')
const { ipcMain } = require('electron')
const format = require('date-fns/format')
const notifier = require('node-notifier')
let tray = null
let win = null

try {
  require('electron-reloader')(module)
} catch (_) {}

// app.dock.hide()

ipcMain.on('set-timer', (event, timeLeft) => {
  if (tray) {
    tray.setTitle(format(new Date(timeLeft * 1000), 'mm:ss'))
  }
})

ipcMain.on('notify', (event, message) => {
  notifier.notify({
    message,
    title: 'Pomoguru',
    icon: path.join(__dirname, 'icon.png')
  })
})

function createWindow () {
  win = new BrowserWindow({
    width: 400,
    height: 260,
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

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      role: 'quit'
    }
  ])

  win.on('blur', () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.hide()
    }
  })

  win.loadURL(
    isDev
      ? 'http://localhost:3007'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )

  // tray = new Tray(
  //   '/Users/janiga/Documents/atelier/pomoguru/packages/app/public/icon-small.png'
  // )
  tray = new Tray(path.join(__dirname, '../build/icon-small.png'))
  // tray.setContextMenu(contextMenu)

  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
    toggleWindow()

    if (
      win &&
      win.isVisible &&
      win.isVisible() &&
      process.defaultApp &&
      event.metaKey
    ) {
      win.openDevTools({ mode: 'detach' })
    }
  })

  tray.setToolTip('PomoGuru')

  win.on('closed', () => (win = null))
}

const toggleWindow = () => {
  if (win.isVisible()) {
    win.hide()
  } else {
    showWindow()
  }
}
const getWindowPosition = () => {
  const windowBounds = win.getBounds()
  const trayBounds = tray.getBounds()

  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  )
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return { x: x, y: y }
}

const showWindow = () => {
  const position = getWindowPosition()
  win.setPosition(position.x, position.y, false)
  win.show()
  win.focus()
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
