const electron = require('electron');
const {app, BrowserWindow, Menu} = require('electron');

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

let mainWindow;
let termWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
            width: 1350, 
            height: 700,
            webPreferences: {nodeIntegration: true,
            preload: __dirname + '/preload.js'}
        });
  mainWindow.loadURL(isDev ?'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  //template menu
  const mainMenu = Menu.buildFromTemplate(mainMenuT);
  Menu.setApplicationMenu(mainMenu);
}

//open terminal window
function openTermWindow(){
  termWindow = new BrowserWindow({
      width: 400,
      height: 200,
      title: 'terminal'
  });
  termWindow.loadURL(url.format({
      pathname: path.join(__dirname, './termWindow.html'),
      protocol: 'file',
      slashes: true
  }));
  //set to null on close
  termWindow.on('closed', function(){
      termWindow = null
  });
}
const mainMenuT = [
  {
      label: 'file',
      submenu: [
          {
              label: "Abrir terminal",
              accelerator: process.platform == 'darwin' ? 'command+T' :
              'Ctrl+T',
              click(){
                  openTermWindow();
              }
          },

      ]
  }
];
//mac things
if(process.platform == 'darwin'){
  mainMenuT.unshift({})
}
//prod
if (process.eventNames.NODE_ENV !== 'production'){
  mainMenuT.push({
      label: 'dev tools',
      submenu: [
          {
              label: 'mostrar dev tools',
              accelerator: process.platform == 'darwin' ? 'command+I' :
              'Ctrl+I',
              click(item, focusedWindow){
                  focusedWindow.toggleDevTools();
              }
          },
          {
              role: 'reload'
          }
      ]
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});