const API_ROOT = 'https://api.giphy.com/v1/gifs'
const API_KEY = '4adlDmQdqYPDNjGt2C6fFxbJHxrNj9Uj'
// const fetch = require('node-fetch');
const fetch = require('electron-main-fetch')


const searchLimit = 8
let offsetCurrent = 0

const createSearchUrl = (keyword) => {
  return `${API_ROOT}/search?api_key=${API_KEY}&q=${keyword}&limit=${searchLimit}&offset=${offsetCurrent}`
}
const createGetGifsUrl = (ids) => `${API_ROOT}?api_key=${API_KEY}&ids=${ids.join(',')}`

const extractAPIResponse = async (response) => {
  const { data, pagination } = await response.json()
2

  const images = data.map(image => ({
    id: image.id,
    url: image.images.original.url
  }))

  const { count, offset, total_count } = pagination
  const isLastPage = total_count === offset + count;

  offsetCurrent += searchLimit;


  return { images, isLastPage }
}

const fetchGifs = async (ids) => {
  const res = await fetch(createGetGifsUrl(ids))

  if (res.status === 200) {
    return extractAPIResponse(res)
  }

  throw new Error('fetchGifSearch fail')
}
const fetchGifSearch = async (arg) => {
  const { txtSearch, status } = arg;
  if (status) {
    offsetCurrent = 0;
  }

  const res = await fetch(createSearchUrl(txtSearch))

  if (res.status === 200) {
    return extractAPIResponse(res)
  }

  throw new Error('fetchGifSearch fail')
}

module.exports = {
  fetchGifs,
  fetchGifSearch,
}
