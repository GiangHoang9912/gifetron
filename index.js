const btnFetch = document.querySelector('#fetch_btn');
const { ipcRenderer, dialog } = require('electron');
const divDisplay = document.querySelector('.display');
const { allStorage } = require('./storageApi')
document.querySelector('#tab-favorites').innerText = `Favorites(${allStorage().length})`

btnFetch.addEventListener('click', (e) => {
  e.preventDefault();
  const txtSearch = document.querySelector('#txtSearch').value;
  ipcRenderer.send('fetch-command', { "txtSearch": txtSearch, "status": false });
})

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  divDisplay.innerHTML = '';
  const txtSearch = document.querySelector('#txtSearch').value;
  ipcRenderer.send('fetch-command', { "txtSearch": txtSearch, "status": true });
})

document.querySelector('#tab-favorites').addEventListener('click', (e) => {
  e.preventDefault();
  const allStorageGif = allStorage();
  ipcRenderer.send('open-favorites', allStorageGif)
})

document.querySelector('#tab-upload').addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('open-upload');
})

ipcRenderer.on('reply-fetch-command', (event, arg) => {
  const { images, isLastPage } = arg;
  const gifs = document.querySelectorAll('.gifImg');

  for (let j = 0; j < images.length; j++) {
    let check = false;
    if (gifs.length !== 0) {
      for (let i = 0; i < gifs.length; i++) {
        if (gifs[i].id === images[j].id) {
          console.log('a');
          check = true;
        }
      }
    }
    console.log(check);
    if (!check) {
      const divGif = document.createElement('div');
      divGif.setAttribute('id', images[j].id);
      divGif.setAttribute('class', 'gifImg')
      divGif.style.backgroundImage = `url('${images[j].url}')`;
      divDisplay.appendChild(divGif);
      divGif.addEventListener('click', (e) => {
        e.preventDefault();
        if (localStorage.getItem('bookmark-' + divGif.getAttribute('id'))) {
          localStorage.removeItem('bookmark-' + divGif.getAttribute('id'));
        } else {
          localStorage.setItem('bookmark-' + divGif.getAttribute('id'), divGif.getAttribute('id'));
        }
        document.querySelector('#tab-favorites').innerText = `Favorites(${allStorage().length})`
      })
    }
  }
})



module.exports = { allStorage };