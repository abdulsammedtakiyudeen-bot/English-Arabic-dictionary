const CACHE_NAME = "iald-cache-v4";
const CORE_ASSETS = ["./", "./index.html", "./style.css", "./app.js", "./manifest.json", "./arabic-words.json", "./icon.svg", "./privacy.html"];
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(CORE_ASSETS.map(async path => {
      try {
        const response = await fetch(path, {cache:"no-store"});
        if (response.ok) await cache.put(new URL(path, self.registration.scope).href, response);
      } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("iald-cache-") && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request, {cache:"no-store"});
      if (response && response.ok) await cache.put(request, response.clone());
      return response;
    } catch (_) {
      const cached = await cache.match(request);
      if (cached) return cached;
      if (request.mode === "navigate") return (await cache.match(new URL("./index.html", self.registration.scope).href)) || Response.error();
      return Response.error();
    }
  })());
});
