import { app, BrowserWindow, Tray, Menu, globalShortcut } from 'electron';
const path = require('path');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Tray
let isQuiting;
let appTray = null;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    //frame: true,
    show: false,    // показывать после создания
    minWidth: 800, // минимальная ширина окна
    minHeight: 600, // минимальная высота окна
    maxWidth: 800, // максимальная ширина окна
    maxHeight: 600, // максимальная высота окна
    resizable: false, // будет ли окно изменять размеры
    backgroundColor: '#1e1e1e', // цвет фона окна
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, '/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      experimentalFeatures: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  mainWindow.setMenuBarVisibility(false)


  appTray = new Tray(path.join(__dirname, '/icon.png')); // 
  appTray.setToolTip('Развернуть приложение');
  appTray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Открыть VodohodCP', 
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Закрыть VodohodCP', 
      click: () => {
        isQuiting = true;
        app.quit();
      }
    }
  ]));


  mainWindow.once('ready-to-show', () => {
    mainWindow.show() // показать окно после полной загрузки
  })

 // По клику скрываем или открываем приложение
 appTray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })

  // Подсвечиваем как активное приложение 
  mainWindow.on('show', () => {
    //appTray.setHighlightMode('always')
  })

  // Скрываем подсветку
  mainWindow.on('hide', () => {
    //appTray.setHighlightMode('never')
  })

  mainWindow.on('minimize',function(event){
    event.preventDefault();
    mainWindow.minimize();
  });

  mainWindow.on('close', function (event) {
    if (!isQuiting) {
      event.preventDefault();
      mainWindow.hide();
      event.returnValue = false;
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });


};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
});

app.on('before-quit', function () {
  isQuiting = true;

  mainWindow.removeAllListeners("close");
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// If OSX, add empty object to menu
if(process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}