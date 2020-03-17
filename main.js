// Modules to control application life and create native browser window
const { app, BrowserWindow, TouchBar } = require('electron')
const { TouchBarScrubber } = TouchBar

const { ipcMain } = require('electron')

const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let touchBar

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 402,
    height: 250,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // mainWindow.webContents.openDevTools()

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

ipcMain.on('time-change', (event, arg) => {
  // console.log(arg) // prints "ping"
  // event.reply('asynchronous-reply', 'pong')
  touchBar.setValue(arg)
})

function createTouchbar() {
  function setValue(progress) {
    const progressBarItems = (progress) => {
      const blacks = progress * 170;
      const reds = (1 - progress) * 170;

      const items = [];

      for (i = 0; i < blacks; i++) {
        items.push(
          {
            icon: 'black.png',
          }
        );
        items.push(
          {
            icon: 'spacer.png',
          }
        );
      }

      for (i = 0; i < reds; i++) {
        items.push(
          {
            icon: 'red.png',
          }
        );
        items.push(
          {
            icon: 'spacer.png',
          }
        );
      }

      return items;
    }

    const scrubber = new TouchBarScrubber({
      items: progressBarItems(progress),
      selectedStyle: 'outline',
      mode: 'free',
      continuous: false,
    });

    const touchbar = new TouchBar({ items: [scrubber] });
    mainWindow.setTouchBar(touchbar);
  }

  return { setValue }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  touchBar = createTouchbar()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
