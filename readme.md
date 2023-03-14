# Single House Web App

Full disclosure, I've been looking into this technique for some time, to use in freelance projects. I'll intentionally avoid Babel and modules so that the code is run 'as is' and you'll get a clear picture of the idea. You can compile sass, use various plugins and task runners, and I would use those for a production app, but this a proof of concept. And personally I would like to see how far you can go without all those node modules.

## The Idea

To use Express, Cloud Functions and Workbox to create a lightweight application that uses a Service Worker to serve a fast and resilliant app. One that uses modern features for modern browsers. The gallery will be very pragmatic and use very litlle javascript, it's focus is mainly on the scroll-snap feature.

## Config

In order to keep secrets I'm using Firebase auth to store the credentials for my project.

```
firebase functions:config:set house.base="" house.key="" house.id=""
```

To get the variables locally run the following command in de functions folder.

```
firebase functions:config:get > .runtimeconfig.json
```

## Installing

For demonstrative purposes this has only been tested on Chrome OS, you can install it as PWA by using 'Add to homescreen' on the android banner. It is possible that you'll only get the option on your second visit. You can also install it on (most) desktop Chrome browsers from the Chrome menu, it should have an option to 'Install Single House App...'.

