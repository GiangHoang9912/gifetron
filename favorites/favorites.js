'use strict'

const { ipcRenderer } = require('electron');
const { allStorage } = require('../storageApi');
const divDisplay = document.querySelector('.display');
let arrDownloadUrls = [];

const allStorageGif = allStorage();

ipcRenderer.send('tao-muon-load', allStorageGif)


document.querySelector('#tab-favorites').innerText = `Favorites(${allStorage().length})`

ipcRenderer.on('reply-fetch-favorites', (event, arg) => {
  console.log('@listen reply')
  arrDownloadUrls = arg.images;
  for (const image of arg.images) {
    const divGif = document.createElement('div');
    divGif.setAttribute('id', image.id);
    divGif.setAttribute('class', 'container')
    divGif.style.backgroundImage = `url('${image.url}')`;

    const imgLike = document.createElement('img');
    imgLike.setAttribute('class', 'imgLike');
    imgLike.src = '../download.png';
    imgLike.style.opacity = 1;

    divGif.appendChild(imgLike)

    divDisplay.appendChild(divGif);
    divGif.addEventListener('click', (e) => {
      e.preventDefault();
      if (localStorage.getItem('bookmark-' + divGif.getAttribute('id'))) {
        localStorage.removeItem('bookmark-' + divGif.getAttribute('id'));
        divGif.style.display = "none";
      } else {
        localStorage.setItem('bookmark-' + divGif.getAttribute('id'), divGif.getAttribute('id'));
      }
      document.querySelector('#tab-favorites').innerText = `Favorites(${allStorage().length})`
    })
  }
})

document.querySelector('#tab-search').addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('open-search')
})

document.querySelector('#btn_download').addEventListener('click', async (e) => {
  e.preventDefault();
  ipcRenderer.send('download-favorites', arrDownloadUrls);
})

document.querySelector('#tab-upload').addEventListener('click', (e) => {
  e.preventDefault();
  ipcRenderer.send('open-upload');
})


