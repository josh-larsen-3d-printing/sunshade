// ============================================================================
// Service worker: saves the app files on the phone so the app opens
// instantly and even works with no internet (Bluetooth doesn't need it).
//
// Change the CACHE name (v2 -> v3 ...) every time you update the app,
// so phones download the new files.
// ============================================================================

const CACHE = "sunshade-ble-v2";

// Relative paths so this works on GitHub Pages (/your-repo/) too
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Save the files when the app is installed
self.addEventListener("install", event =>
{
    event.waitUntil(
        caches.open(CACHE)
            .then(cache => cache.addAll(FILES))
    );
    self.skipWaiting();
});

// Delete old caches when a new version takes over
self.addEventListener("activate", event =>
{
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys
                .filter(key => key !== CACHE)
                .map(key => caches.delete(key))))
    );
});

// Use the saved copy if we have one, otherwise download it
self.addEventListener("fetch", event =>
{
    event.respondWith(
        caches.match(event.request)
            .then(response =>
                response || fetch(event.request))
    );
});
