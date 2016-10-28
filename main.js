const {app, BrowserWindow, Menu, Tray, crashReporter, ipcMain} = require('electron');  // Module to control application life.
var util = require('util');

// Report crashes to our server.
// crashReporter.start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var win = null;
var tray = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // if (process.platform != 'darwin')
    app.quit();
});

function createGmailWindow(url) {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Gmail',
    icon: __dirname+'/gmail-icon-unread.png',
    "skip-taskbar": process.platform !== 'darwin'
  });

  win.maximize();

  // mainWindow.loadUrl('https://mail.google.com/');
  win.loadURL('file://'+__dirname+'/index.html');

  // Emitted when the window is closed.
  win.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  win.on('minimize', function(event) {
    win.hide();
    event.preventDefault();
  });

}

function setupTray() {
  tray = new Tray(__dirname+'/gmail-icon-default.png');
  tray.setToolTip('No unread messages');
  var trayContextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Inbox',
      click: function() { win.show(); }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: function() { app.quit(); }
    },
  ]);
  tray.setContextMenu(trayContextMenu);

  tray.on('clicked', function() {
    win.show();
  });
}

function setupMenu() {
  var template = [
    {
      label: 'Gmail',
      submenu: [
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() { app.quit(); }
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'Command+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+Command+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'Command+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'Command+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'Command+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Find',
          accelerator: 'Command+F',
          click: function() { BrowserWindow.getFocusedWindow().webContents.send('find'); }
        },
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: function() { BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache(); }
        },
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+Command+I',
          click: function() { BrowserWindow.getFocusedWindow().webContents.toggleDevTools(); }
        },
      ]
    },
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        {
          label: 'Close',
          accelerator: 'Command+W',
          selector: 'performClose:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Bring All to Front',
          selector: 'arrangeInFront:'
        },
      ]
    },
  ];

  var menu = Menu.buildFromTemplate(template);

  Menu.setApplicationMenu(menu); // Must be called within app.on('ready', function(){ ... });
}

// This method will be called when atom-shell has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

  ipcMain.on('add-account', function(event, args) {
      createGmailWindow(args);
  });

  ipcMain.on('unread', function(event, unread) {
    app.dock && app.dock.setBadge(unread);
    tray.setImage(unread.length === 0 ? __dirname+'/gmail-icon-default.png' : __dirname+'/gmail-icon-unread.png');
    tray.setToolTip((unread.length === 0 ? 'No': unread ) + ' unread messages');
  });

  createGmailWindow('file://'+__dirname+'/index.html');

  setupTray();

  setupMenu();

});
