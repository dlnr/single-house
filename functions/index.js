'use strict';
/**
 * Express style app so I'm going to require Express.
 * Firebase functions to add the SDK.
 * https is a request method fron node and allows us to keep the connection open
 * untill we're done with the request or cache.
 * axios make it crossbrowser friendly and is a promises based http client.
 * lru-cache is to set a time limit on cached items.
 *
 */
const express = require('express');
const functions = require('firebase-functions');
const https = require('https');
const axios = require('axios');
const LRUCache = require('lru-cache');

const apiClient = axios.create({
  baseURL: '',
  timeout: 10000
});

const httpsAgent = new https.Agent({
  keepAlive: true
});

const lruOptions = {
  max: 1000,
  maxAge: 1000 * 60 * 5
};
const apiCache = new LRUCache(lruOptions);

/**
 * Try to get the data from the lru-cache or get it
 * from the network trough axios request
 */
async function requestData(url) {
  const cachedResponse = apiCache.get(url);

  if (cachedResponse) {
    return cachedResponse;
  }

  const networkResponse = await apiClient.request({
    httpsAgent,
    url
  });

  const data = networkResponse.data;
  apiCache.set(url, data);
  return data;
}

const app = express();

/**
 * Get house credentials from firebase
 */
const BASE = functions.config().house.base;
const KEY = functions.config().house.key;
const ID = functions.config().house.id;

/**
 * Build the house URL
 */
function getHouse() {
  return `${BASE}/${KEY}/koop/${ID}`;
}

/**
 * Build a responsive gallery image
 */
function galleryImage(image) {

  if (image.Soort === 3) {

    return `
      <img src="${image.MediaItems[image.MediaItems.length-1].Url}"
      width="${image.MediaItems[image.MediaItems.length-1].Width}"
      height="${image.MediaItems[image.MediaItems.length-1].Height}"
      alt="${image.Omschrijving}">
    `;

  }

}

/**
 * Build the House
 */

function house(data) {
  if(!data) {
    return `<p>I'm very sorry, demos usually work fine...</p>`;
  }

  // I know there is a formatted price but I really like this constructor.
  const price = new Intl.NumberFormat('nl-nl', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(data.Koopprijs);

  // Map all house media to a function that creates images
  const galleryImages = data.Media.map(item => galleryImage(item)).join('');

  const houseHeader = `
    <article>
      <header>
        <div class="c">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
          <h1>${data.Adres}</h1>
          <h2>${data.Plaats}</h2>
          <span>${price}</span>
        </div>
      </header>
  `;
  const houseGallery = `
      <div id="gallery">
        <div class="g">
          ${galleryImages}
        </div>
      </div>
  `;
  const houseContent = `
      <div id="content">

      </div>
  `;
  const houseFooter = `
      <footer>

      </footer>
    </article>
  `;

  return houseHeader + houseGallery + houseContent + houseFooter;
}

/**
 * Partials
 */
const headPartial = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="manifest" href="/manifest.json">
  <title>Single House</title>
  <link rel="stylesheet" href="/styles.css">
  <meta name="robots" content="noindex, nofollow">
</head>
<body>
`;
const footPartial = `
<script src="/app.js"></script>
</body>
</html>
`;

/**
 * SPA, so all request are going to be routed to /
 */
app.get('/', async(req, res) => {
  res.write(headPartial);

  try {
    const houseData = await requestData(getHouse());
    res.write(house(houseData));
  } catch (error) {
    res.write(`
    <p>I'm very sorry, demos usually work fine...</p>
    <pre>${error.message}</pre>
    `)
  }
  res.write(footPartial);
  res.end();
});

/**
 * Redirect all other routes to home
 */
app.all('*', async(req, res) => {
  res.redirect('/');
});

/**
 * Create a firebase function and export it
 */
const requestHouse = functions.https.onRequest(app);
exports.requestHouse = requestHouse;


