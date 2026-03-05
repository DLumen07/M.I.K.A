// Aralin 1 PWA - Service Worker
const CACHE_NAME = 'aralin1-v1';
const ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data.js',
  './js/app.js',
  './manifest.json',
  './assets/icon.svg',
  './assets/images/aktibiti1-bg.png',
  './assets/images/aktibiti2-bg.png',
  './assets/images/aktibiti2_2-bg.png',
  './assets/images/aktibiti3-s1-bg.png',
  './assets/images/aktibiti3-s1-dq.png',
  './assets/images/aktibiti3-s2-dq.png',
  './assets/images/aktibiti3-s3-dq.png',
  './assets/images/aktibiti5-s1-dq.jpg',
  './assets/images/aktibiti5-s2-dq.jpg',
  './assets/images/aktibiti5-s3-dq.jpg',
  './assets/images/aktibiti5-s4-dq.jpg',
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
