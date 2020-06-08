const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { fetchGifSearch, fetchGifs } = require('./app.js');
const fs = require('fs-extra')
const Axios = require('axios')
const https = require('https');
const UPLOAD_ROOT = 'https://upload.giphy.com/v1/gifs';


function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: "./icon.png"
  })

  // and load the index.html of the app.
  win.loadFile('./search/index.html');


  // Open the DevTools.

  ipcMain.on('open-favorites', async (event, arg) => {
    await win.loadFile('./favorites/favorites.html');
    const result = await fetchGifs(arg);
    event.reply('reply-fetch-favorites', result);
  })

  ipcMain.on('open-search', async (event, arg) => {
    // const result = await fetchGifs(arg);
    // event.reply('reply-fetch-favorites', result)
    win.loadFile('./search/index.html');
  })
  //
  ipcMain.on('open-upload', async (event, arg) => {
    // const result = await fetchGifs(arg);
    // event.reply('reply-fetch-favorites', result)
    win.loadFile('./upload/upload.html');
  })
  ipcMain.on('upload-command', async (event, arg) => {
    dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
      .then(path => {
        post(path);
      })
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on('fetch-command', async (event, arg) => {
  const result = await fetchGifSearch(arg)
  event.reply('reply-fetch-command', result)
})

//
ipcMain.on('download-image', (event, arg) => {
  fs.ensureDir('./images', err => {
    console.log(err)
    https.get(arg.url, res => res.pipe(fs.createWriteStream(`./images/gif_${arg.id}.jpg`)))
  })
})

ipcMain.on('download-favorites', (event, arg) => {
  fs.ensureDir('./export', async err => {
    console.log(err)
    for (const image of arg) {
      await downloadImage(image.url, `./export/gif_${image.id}.gif`)
    }
  })
})

async function downloadImage(url, path) {
  const writer = fs.createWriteStream(path)

  const response = await Axios({
    url: url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)
}



function convert(input) {
  let binaryFile = '';
  for (var i = 0; i < input.length; i++) {
    binaryFile += input[i].charCodeAt(0).toString(2);
  }
  return binaryFile;
}

const post = async (path) => {
  fs.readFile(path.filePaths[0], { encoding: 'binary' }, (err, data) => {
    const req = {
      api_key: "4adlDmQdqYPDNjGt2C6fFxbJHxrNj9Uj",
      file: {
        value: convert(data),
        options: {
          filename: path,
          contentType: 'image/gif'
        }
      },
      tags: 'hello',
      source_post_url: 'http://www.mysite.com/my-post/',
    }

    const option = {
      url: `${UPLOAD_ROOT}?api_key=${req.api_key}`,
      formData: req,
      json: true
    }

    Axios.post(option.url, option.formData)
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
      })
      .catch((error) => {
        console.log(error)
      })

  })
}


