const CACHE_NAME = 'vaayuedge-shell-v1';

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const indexUrl = new URL('./', self.registration.scope).href;
    const response = await fetch(indexUrl, { cache: 'reload' });
    if (!response.ok) throw new Error(`App shell returned ${response.status}`);
    const html = await response.clone().text();
    const assets = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)]
      .map((match) => new URL(match[1], indexUrl).href)
      .filter((url) => url.startsWith(self.registration.scope));
    await cache.put(indexUrl, response);
    await cache.addAll([...new Set(assets)]);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith('vaayuedge-shell-') && name !== CACHE_NAME).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(event.request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (event.request.mode === 'navigate') {
        const shell = await caches.match(new URL('./', self.registration.scope).href);
        if (shell) return shell;
      }
      return new Response('Offline asset unavailable', { status: 503, headers: { 'Content-Type': 'text/plain' } });
    }
  })());
});
