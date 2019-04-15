
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

workbox.routing.registerRoute(
  new RegExp('^http://cloud.funda.nl/'),
  new workbox.strategies.CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxEntries: 12
      })
    ]
  })
);

workbox.routing.registerRoute(
  '/',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'page-cache',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200]
      })
    ]
  }),
);

workbox.core.skipWaiting();
workbox.core.clientsClaim();