// После изменения любых файлов увеличьте VERSION: это обновит офлайн-копию.
const VERSION = 'v8-all-gates';
const PREFIX = 'anapa-gates-';
const CACHE = PREFIX + VERSION;
const FILES = ['./assets/gate-6.jpg', './assets/gate-5.jpg', './assets/gate-4.jpg', './assets/gate-3.jpg', './assets/gate-2.jpg', './assets/gate-1.jpg', './', './index.html', './styles.css', './app.js', './gates.js', './manifest.webmanifest', './assets/masterplan-perspective.jpg', './assets/LogoPeschny.svg', './assets/icon-192.png', './assets/icon-512.png', './assets/icon-maskable-512.png'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES))); });
// Обновление активируется после закрытия всех вкладок приложения.
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if(event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(event.request); if(cached) return cached;
    try { const response = await fetch(event.request); if(response.ok) await cache.put(event.request,response.clone()); return response; }
    catch(error) { if(event.request.mode === 'navigate') return cache.match('./index.html'); throw error; }
  }));
});
