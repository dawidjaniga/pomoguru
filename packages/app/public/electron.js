const path = require('path')
const { app, BrowserWindow, Menu, Tray } = require('electron')
const isDev = require('electron-is-dev')
let tray = undefined
let win

try {
  require('electron-reloader')(module)
} catch (_) {}

app.dock.hide()

function createWindow () {
  win = new BrowserWindow({
    width: 400,
    height: 500,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      backgroundThrottling: false
    }
  })

  win.on('blur', () => {
    if (!win.webContents.isDevToolsOpened()) {
      win.hide()
    }
  })

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
  // win.webContents.openDevTools()

  tray = new Tray(path.join(__dirname, '../public/icon.png'))
  tray.setTitle('25:00')
  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
    toggleWindow()

    // Show devtools when command clicked
    if (win.isVisible() && process.defaultApp && event.metaKey) {
      win.openDevTools({ mode: 'detach' })
    }
  })

  tray.setToolTip('This is my application.')

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

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  )

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return { x: x, y: y }
}

const showWindow = () => {
  const position = getWindowPosition()
  win.setPosition(position.x, position.y, false)
  win.show()
  win.focus()
}

app.whenReady().then(createWindow)

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
