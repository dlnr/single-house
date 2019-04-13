'use strict';
/**
 * Express style app so I'm going to require Express
 */

const express = require('express');
const functions = require('firebase-functions');

const app = express();

/**
 * SPA, so all request are going to be routed to /
 */
app.get('/', async(req, res) => {
  res.write('<h1>Single House</h1>');
  res.end();
});

const requestHouse = functions.https.onRequest(app);

exports.requestHouse = requestHouse;


