# Single House Web App

Full disclosure, I've been looking into this technique for some time. I'll intentionally avoid Babel and modules so that the code is run 'as is' and you'll get a clear picture of the idea. You can compile sass, use various plugins and task runners, and I would use those for a production app, but this is more a proof of concept. And personally I would like to see how far you can go without.

## The Idea

To use Cloud Functions and Workbox to create an application that uses HTTP Streams and Service Worker to serve a fast and resilliant app. One that fully exploits modern features for modern browsers. My focuspoints will also include new client side features, like intersection observer and scroll-snap to keep it light and fast.