const APP_PREFIX = "Budget-Tracker";
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION
const FILES_TO_CACHE = [
    "/index.html",
    "/manifest.json",
    "/css/styles.css",
    "/icons/icon-72x72.png",
    "/icons/icon-96x96.png",
    "/icons/icon-128x128.png",
    "/icons/icon-144x144.png",
    "/icons/icon-152x152.png",
    "/icons/icon-192x192.png",
    "/icons/icon-384x384.png",
    "/icons/icon-512x512.png",
    "/js/index.js",
    "/js/idb.js"
  ];

  self.addEventListener("install", function (e) {
    e.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
        console.log("Your files have been cached successfully!");
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  });

  self.addEventListener("activate", function (e) {
    e.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME) {
              console.log("Deleting cached data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
  });

  self.addEventListener("fetch", function (e) {
    e.respondWith(
      caches.match(e.request).then(request => {
        if (request) {
          console.log("responding with cache : " + e.request.url);
          return request;
        } else {
          console.log("file is not cached, fetching : " + e.request.url);
          return fetch(e.request);
        }
      })
    );
  });