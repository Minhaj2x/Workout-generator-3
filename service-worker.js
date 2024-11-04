// service-worker.js
const CACHE_NAME = 'workout-gen-cache-v1';
const URLS_TO_CACHE = [
    'index.html',
    'styles.css',  // Add your CSS file
    'script.js',   // Add your JavaScript file
    'icon-192x192.png', // Add your icon files
    'icon-512x512.png',
    // Add any additional resources you need to cache
];

// Install the service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching files');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

// Fetch event to serve cached content
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return the cached response if found, otherwise fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Removing old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
