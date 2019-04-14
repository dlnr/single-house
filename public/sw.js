importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js');

workbox.setConfig({
  debug: true,
});

workbox.precaching.precacheAndRoute([
  '/styles.css',
  '/app.js',
  '/icon.png',
  '/favicon.ico',
  '/manifest.json'
]);
workbox.precaching.cleanupOutdatedCaches();


workbox.core.skipWaiting();
workbox.core.clientsClaim();