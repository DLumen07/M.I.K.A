// Aralin 1 PWA - Service Worker
const CACHE_NAME = 'aralin1-v5';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/app.js',
  './manifest.json',
  './assets/icon.svg',
  './assets/images/aktibiti1-bg.png',
  './assets/images/2.png',
  './assets/images/3.png',
  './assets/images/act5-3.png',
  './assets/images/act5-4.png',
  './assets/images/act5-5.png',
  './assets/images/act5-6.png',
  './assets/audio/aktibiti1.m4a'
];

// Install - cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch - cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
