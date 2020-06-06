document.querySelector('#tab-favorites').addEventListener('click', (e) => {
  e.preventDefault();
  const allStorageGif = allStorage();
  ipcRenderer.send('open-favorites', allStorageGif)
})

document.querySelector('#tab-upload').addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('open-upload');
})

document.querySelector('#tab-search').addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('open-search')
})