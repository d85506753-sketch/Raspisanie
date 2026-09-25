const CACHE_NAME = 'curie-schedule-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './css/style.css',
    './js/firebase-config.js',
    './js/audio.js',
    './js/effects.js',
    './js/app.js',
    './js/admin.js',
    './js/auth.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).catch(() => {})
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        fetch(event.request)
            .then((networkRes) => {
                if (networkRes && networkRes.status === 200 && event.request.url.startsWith(self.location.origin)) {
                    const copy = networkRes.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
                }
                return networkRes;
            })
            .catch(() => {
                return caches.match(event.request).then((cached) => cached || caches.match('./index.html'));
            })
    );
});
