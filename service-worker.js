// service-worker.js
const CACHE_NAME = 'workout-gen-cache-v1';
const URLS_TO_CACHE = [
    'index.html',
    'styles.css',          // Add your CSS file
    'script.js',           // Add your JavaScript file
    'firebase.js',         // Cache Firebase script (ensure this file is in your root folder or provide path)
    'indexeddb.js',        // Cache IndexedDB script (ensure this file is in your root folder or provide path)
    'manifest.json',       // Cache manifest for PWA
    'icon-192x192.png',    // Cache your icons
    'icon-512x512.png',
    // Add any additional resources you need to cache
];

// Install the service worker and cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching essential files for offline use');
                return cache.addAll(URLS_TO_CACHE);
            })
            .catch(err => console.error('Error caching files:', err))
    );
});

// Fetch event to serve cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found, otherwise fetch from network
                return response || fetch(event.request);
            })
            .catch((err) => {
                console.error('Fetch failed:', err);
                return caches.match('offline.html'); // Optionally, show a fallback page if network fails
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
                        console.log('Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
