const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/Cop.png.png',
  '/Co.png.png'
];

// Install SW
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate SW
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(cacheNames.map(name => {
        if (name !== CACHE_NAME) {
          return caches.delete(name);
        }
      }))
    )
  );
  self.clients.claim();
});

// Fetch & serve from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
