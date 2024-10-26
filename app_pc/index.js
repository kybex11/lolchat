const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800, 
        height: 600,
        menuBarVisible: false,
        autoHideMenuBar: true,
    });

    win.loadURL("http://localhost:5173");
    win.menuBarVisible = false;
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
});

