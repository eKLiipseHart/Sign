const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {

    const win = new BrowserWindow({

        width: 1500,
        height: 950,

        backgroundColor: '#0d0d0d',

        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {

    createWindow();

    app.on('activate', () => {

        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});

app.on('window-all-closed', () => {

    if (process.platform !== 'darwin')
        app.quit();
});