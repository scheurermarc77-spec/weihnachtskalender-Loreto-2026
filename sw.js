const CACHE="loreto-advent-v5";
const CORE=["./","./index.html","./manifest.webmanifest","./assets/loreto_hintergrund.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(CORE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE).then(c => c.put(event.request, clone)).catch(() => {});
      return resp;
    }).catch(() => caches.match("./index.html")))
  );
});
