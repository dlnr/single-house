'use strict';
/**
 * Express style app so I'm going to require Express.
 * Firebase functions to add the SDK.
 * https is another get method to allow us to keep the connection open
 * untill we're checked the cache.
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
 * Partials, for caching
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
  <meta name="robots" content="noindex, nofollow">
</head>
<body>
`;
const footPartial = `
<script src="/app.js">
</body>
</html>
`;

/**
 * SPA, so all request are going to be routed to /
 */
app.get('/', async(req, res) => {
  res.write(headPartial);
  res.write(`<h1>Single House</h1>`);

  try {
    const houseData = await requestData(getHouse());
    res.write(`<strong>${houseData.Plaats}</strong>`);
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


