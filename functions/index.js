'use strict';
/**
 * Express style app so I'm going to require Express
 */
const express = require('express');
const functions = require('firebase-functions');

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


