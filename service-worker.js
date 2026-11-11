const CACHE_NAME = "iald-v25-academy-loading";
const CORE_ASSETS = [
  "./", "./index.html", "./learn.html", "./conversation-academy.html",
  "./conversation-academy.css", "./conversation-academy.js",
  "./conversation-lessons.json",
  "./islamic-knowledge.html", "./knowledge-desert.svg", "./ark-waters.svg",
  "./ancient-well.svg", "./palm-city.svg", "./islamic-words-cover.svg",
  "./mini-lessons-cover.svg", "./quick-quiz-cover.svg", "./saved-words-cover.svg",
  "./learning-path-cover.svg", "./academy-cover.svg", "./islamic-knowledge-cover.svg",
  "./intelligence-cover.svg", "./courses-cover.svg", "./books-cover.svg",
  "./certificate-cover.svg", "./profile.html", "./profile.js", "./auth.js",
  "./welcome.css", "./guide.html", "./explore.html", "./onboarding.css",
  "./style.css", "./app.js", "./auth-gate.js", "./manifest.json",
  "./arabic-words.json", "./icon.svg", "./learning-path-photo.jpg",
  "./academy-photo.jpg", "./islamic-knowledge-photo.jpg", "./intelligence-photo.jpg",
  "./courses-photo.jpg", "./books-photo.jpg", "./certificate-photo.jpg",
  "./learning-center.html", "./resource-library.html", "./learning-center.css",
  "./learning-center.js", "./academy.html", "./academy.css", "./academy.js",
  "./intelligence.html", "./intelligence.css", "./install-app.js",
  "./install-app.css", "./about.html", "./contact.html", "./privacy.html", "./terms.html"
];

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
    await Promise.all(keys.filter(key => key.startsWith("iald-") && key !== CACHE_NAME).map(key => caches.delete(key)));
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
    const cached = await cache.match(request);

    const refresh = fetch(request, {cache:"no-store"}).then(response => {
      if (response && response.ok) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    });

    // Cached scripts, styles, lesson data and images appear immediately.
    if (cached && request.mode !== "navigate") {
      event.waitUntil(refresh.then(() => undefined).catch(() => undefined));
      return cached;
    }

    // Prefer the latest page, but do not leave a returning visitor waiting
    // indefinitely when the connection is slow.
    if (request.mode === "navigate" && cached) {
      const quickNetwork = await Promise.race([
        refresh,
        new Promise(resolve => setTimeout(() => resolve(null), 3000))
      ]).catch(() => null);
      if (quickNetwork) return quickNetwork;
      refresh.catch(() => {});
      return cached;
    }

    try {
      return await refresh;
    } catch (_) {
      if (cached) return cached;
      if (request.mode === "navigate") {
        return (await cache.match(new URL("./index.html", self.registration.scope).href)) || Response.error();
      }
      return Response.error();
    }
  })());
});