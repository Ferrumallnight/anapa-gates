const VERSION = 'v14-complete-repair';
const PREFIX = 'anapa-gates-';
const CACHE = PREFIX + VERSION;
const FILES = ['./', './index.html', './styles-v14.css', './app-v14.js', './gates-v14.js', './manifest.webmanifest', './assets/masterplan-perspective.jpg', './assets/icon-192.png', './assets/icon-512.png', './assets/icon-maskable-512.png', ...[1,2,3,4,5,6].map(n => `./assets/gate-${n}.webp`)];
self.addEventListener('install', event => {
  // Bypass HTTP caches; an incomplete upload must never activate a partial release.
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES.map(path => new Request(new URL(path,self.registration.scope), {cache:'reload'})))));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
  // Always fetch the recovery page directly; never trap it in an offline copy.
  if(url.pathname.endsWith('/repair.html'))return;
  event.respondWith(caches.open(CACHE).then(async cache=>{
    const cached=await cache.match(event.request);if(cached)return cached;
    try{const response=await fetch(event.request);if(response.ok)await cache.put(event.request,response.clone());return response;}
    catch(error){if(event.request.mode==='navigate')return cache.match('./index.html');throw error;}
  }));
});
