/* Service worker CIUDADAN-IA (research.md D7):
 * - network-first con fallback a caché para páginas (avisando "copia guardada")
 * - cache-first para assets estáticos (fuentes, CSS, íconos)
 * - precache del shell offline
 * Mejora progresiva pura: el sitio funciona igual sin SW. */

const VERSION = 'v1';
const SHELL_CACHE = `shell-${VERSION}`;
const PAGES_CACHE = `pages-${VERSION}`;
const ASSETS_CACHE = `assets-${VERSION}`;

const SHELL = ['/offline/', '/favicon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => ![SHELL_CACHE, PAGES_CACHE, ASSETS_CACHE].includes(k))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function notifyFromCache(clientId) {
  if (!clientId) return;
  const client = await self.clients.get(clientId);
  if (client) client.postMessage('from-cache');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // Assets estáticos: cache-first.
  if (/\.(woff2|css|js|svg|png|webmanifest|ogg|opus)$/.test(url.pathname)) {
    event.respondWith(
      caches.open(ASSETS_CACHE).then(async (cache) => {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      }),
    );
    return;
  }

  // Páginas HTML: network-first con fallback a caché → offline.
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(PAGES_CACHE);
        try {
          const res = await fetch(req);
          if (res.ok) cache.put(req, res.clone());
          return res;
        } catch {
          const hit = await cache.match(req);
          if (hit) {
            event.waitUntil(notifyFromCache(event.clientId || event.resultingClientId));
            return hit;
          }
          const offline = await caches.match('/offline/');
          return offline || Response.error();
        }
      })(),
    );
  }
});
