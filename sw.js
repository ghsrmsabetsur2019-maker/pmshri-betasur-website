// Service worker for PM Shri Karnataka Public School Betasur website.
// Makes the site installable and lets pages open from cache on a poor connection.
// Bump CACHE_NAME if you ever want to clear old cached files from visitors' phones.
const CACHE_NAME = 'pmshri-betasur-v2';

const CORE_ASSETS = [
  'index.html', 'about.html', 'academics.html', 'admissions.html', 'facilities.html',
  'staff.html', 'notices.html', 'downloads.html', 'gallery.html', 'contact.html',
  'privacy.html', 'application-status.html', '404.html',
  'styles.css', 'script.js', 'manifest.json', 'favicon.svg',
  'images/school-building.jpg', 'images/school-building-2.jpg', 'images/pm-shri-logo.png',
  'icons/icon-192.png', 'icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(CORE_ASSETS.map((url) => cache.add(url).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for everything on this site, so CSS, JS and pages are always
// fresh when online. The saved copy is only used when the phone is offline.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((res) => res || caches.match('404.html')))
  );
});
