import { getSingleMusicParamsInterface } from 'interfaces/musicInterfaces';

export function getAllMusics(callback: (arg: unknown) => void) {
  window.electron.ipcRenderer.sendMessage('get-all-musics');
  window.electron.ipcRenderer.once('get-all-musics', callback);
}

export function getSingleMusic(
  ids: getSingleMusicParamsInterface,
  callback: (arg: unknown) => void
) {
  window.electron.ipcRenderer.sendMessage('get-single-music', ids);
  window.electron.ipcRenderer.once('get-single-music', callback);
}

export function getStyles(callback: (arg: unknown) => void) {
  window.electron.ipcRenderer.sendMessage('get-styles');
  window.electron.ipcRenderer.once('get-styles', callback);
}

export function getArtists(callback: (arg: unknown) => void) {
  window.electron.ipcRenderer.sendMessage('get-artists');
  window.electron.ipcRenderer.once('get-artists', callback);
}

export function getCapas(callback: (arg: unknown) => void) {
  window.electron.ipcRenderer.sendMessage('get-capas');
  window.electron.ipcRenderer.once('get-capas', callback);
}
