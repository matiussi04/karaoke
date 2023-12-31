/* eslint global-require: off, no-console: off, promise/always-return: off */

import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import downloadFolder from '../drive-api';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  getAllCapas,
  getAllMusicArtists,
  getAllMusicStyles,
  getAllMusics,
  getSingleMusic,
} from './music';
import { isgetSingleMusicParamsInterface } from '../interfaces/musicInterfaces';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('get-all-musics', (event) => {
  event.reply('get-all-musics', getAllMusics());
});

ipcMain.on('get-single-music', (event, arg) => {
  if (isgetSingleMusicParamsInterface(arg)) {
    event.reply('get-single-music', getSingleMusic(arg));
  }
});

ipcMain.on('get-styles', (event) => {
  event.reply('get-styles', getAllMusicStyles());
});

ipcMain.on('get-artists', (event) => {
  event.reply('get-artists', getAllMusicArtists());
});

ipcMain.on('get-capas', (event) => {
  event.reply('get-capas', getAllCapas());
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    fullscreen: true,
    titleBarStyle: 'hidden',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    const downloadConfirmation = await dialog.showMessageBox(mainWindow, {
      type: 'question',
      buttons: ['Sim', 'Não'],
      title: 'Download de Músicas',
      message: 'Deseja baixar as músicas ao iniciar a aplicação?',
    });

    if (downloadConfirmation.response === 0) {
      const musicasFolderId: string = '1N5-CeS6veSh8eP0Px2FNu-V6xbMWrEc4';
      downloadFolder(
        musicasFolderId,
        path.join(process.cwd(), 'assets', 'music')
      )
        // eslint-disable-next-line promise/always-return
        .then(() => {
          console.log(
            `Folder with ID ${musicasFolderId} downloaded successfully.`
          );
        })
        .catch((err: Error) => {
          console.error('Error downloading folder:', err);
        });
    }

    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

// ...
