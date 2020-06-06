const { ipcRenderer } = require('electron');
const { allStorage } = require('../storageApi')

document.querySelector('#openDialog').addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('upload-command');
})


document.querySelector('#tab-favorites').addEventListener('click', (e) => {
  e.preventDefault();
  const allStorageGif = allStorage();
  ipcRenderer.send('open-favorites', allStorageGif)
})


document.querySelector('#tab-search').addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('open-search')
})