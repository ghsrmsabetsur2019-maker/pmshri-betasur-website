// Service worker for PM Shri Karnataka Public School Betasur website.
// Purpose: (1) makes the site installable as an app, (2) caches the core
// pages so the site still opens (from cache) with a poor/no connection,
// which matters for families in areas with patchy mobile signal.
//
// Bump CACHE_NAME whenever you change site files so visitors get the update.
const CACHE_NAME = 'pmshri-betasur-v1';

const CORE_ASSETS = [
  'index.html',
  'about.html',
  'academics.html',
  'admissions.html',
  'facilities.html',
  'staff.html',
  'notices.html',
  'downloads.html',
  'gallery.html',
  'contact.html',
  '404.html',
  'styles.css',
  'script.js',
  'manifest.json',
  'favicon.svg',
  'images/school-building.jpg',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((name) => name !== CACHE_NAME)
             .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Network-first for HTML (so visitors get fresh notices/content when
// online), falling back to cache when offline. Cache-first for other
// static assets (css/js/images) since those change less often.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isHTML = req.headers.get('accept') && req.headers.get('accept').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((res) => res || caches.match('404.html')))
    );
  } else {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
  }
});
