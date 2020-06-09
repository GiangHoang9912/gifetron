const btnFetch = document.querySelector('#fetch_btn');
const { ipcRenderer } = require('electron');
const divDisplay = document.querySelector('.display');
const { allStorage } = require('../storageApi')
const gifLoad = "https://media.giphy.com/media/jAYUbVXgESSti/giphy.gif";
const clipboard = require('electron-clipboard-extended')


document.querySelector('#tab-favorites').innerText = `Favorites(${allStorage().length})`;


btnFetch.addEventListener('click', (e) => {
  e.preventDefault();
  btnFetch.disabled = true;
  const txtSearch = document.querySelector('#txtSearch').value;
  ipcRenderer.send('fetch-command', { "txtSearch": txtSearch, "status": false });
})


let lastKeyword = '';

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();

  const txtSearch = document.querySelector('#txtSearch').value;
  console.log(lastKeyword)
  console.log(txtSearch)

  if (txtSearch === lastKeyword) return;

  divDisplay.innerHTML = '';
  lastKeyword = txtSearch;

  ipcRenderer.send('fetch-command', { "txtSearch": txtSearch, "status": true });
})

document.querySelector('#tab-favorites').addEventListener('click', (e) => {
  e.preventDefault();

  ipcRenderer.send('open-favorites')
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
    if (!check) {
      const divGif = document.createElement('div');
      divGif.setAttribute('id', images[j].id);
      divGif.setAttribute('class', 'container')
      divGif.style.backgroundImage = `url('${gifLoad}')`;




      const img = document.createElement('img');
      img.src = images[j].url;
      img.style.display = 'none';

      divGif.appendChild(img)

      const imgLike = document.createElement('img');
      imgLike.setAttribute('class', 'imgLike');
      imgLike.src = '../download.png';

      divGif.appendChild(imgLike)

      if (divGif.getAttribute('id') === localStorage.getItem(`bookmark-${images[j].id}`)) {
        imgLike.style.opacity = 1;
      }

      img.onload = (e) => {
        divGif.style.backgroundImage = `url('${images[j].url}')`;
      }



      const divBtnDown = document.createElement('div');
      divBtnDown.setAttribute('class', 'button');
      const aTagDown = document.createElement('a');
      aTagDown.setAttribute('href', '#')
      aTagDown.innerText = 'D0wnl0ad'
      divBtnDown.appendChild(aTagDown);


      aTagDown.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('d')
        ipcRenderer.send('download-image', { id: images[j].id, url: images[j].url });
      })

      divGif.appendChild(divBtnDown)

      divDisplay.appendChild(divGif);

      divGif.addEventListener('click', (e) => {
        e.preventDefault();
        if (localStorage.getItem('bookmark-' + divGif.getAttribute('id'))) {
          localStorage.removeItem('bookmark-' + divGif.getAttribute('id'));
          imgLike.style.opacity = 0;;
        } else {
          localStorage.setItem('bookmark-' + divGif.getAttribute('id'), divGif.getAttribute('id'));
          imgLike.style.opacity = 1;
        }
        document.querySelector('#tab-favorites').innerText = `Favorites(${allStorage().length})`
      })
    }
  }
  btnFetch.disabled = false;
})

let count = 1;
//Element.scrollHeight - Element.scrollTop === Element.clientHeight
onscroll = (e) => {
  e.preventDefault();
  // if (body.scrollHeight - body.scrollTop === body.clientHeight) {
  //   ipcRenderer.send('fetch-command', { "txtSearch": txtSearch, "status": false });
  // }

  observer.observe(document.querySelector("#fetch_btn"));

}

const observer = new IntersectionObserver(function (entries) {
  if (entries[0].isIntersecting === true) {
    //ipcRenderer.send('fetch-command', { "txtSearch": txtSearch, "status": false });
    const txtSearch = document.querySelector('#txtSearch').value;
    ipcRenderer.send('fetch-command', { "txtSearch": txtSearch, "status": false });
  }
}, { threshold: [1] });

clipboard
  .on('text-changed', () => {
    let currentText = clipboard.readText();
    console.log(currentText)
    document.querySelector('#txtSearch').value = currentText;
  })
  .startWatching();



module.exports = { allStorage };