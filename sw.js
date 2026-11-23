/* Tribuna: caché sin conexión.
   Imágenes, cuadros del recorrido y fuentes: primero la caché (no cambian; si cambian, sube VERSION).
   Páginas, scripts y estilos: primero la red, con la caché de respaldo si no hay señal. */
var VERSION = 'tribuna-v2';
var ESTATICOS = VERSION + '-estaticos', PAGINAS = VERSION + '-paginas';
var INICIO = ['/', '/index.html', '/estadios.js', '/poster.webp', '/fuentes/titulo-800.woff2', '/fuentes/texto-400.woff2'];

self.addEventListener('install', function(ev){
  ev.waitUntil(caches.open(PAGINAS).then(function(c){ return c.addAll(INICIO); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(ev){
  ev.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k.indexOf(VERSION) !== 0; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(ev){
  var r = ev.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  if (/\.(webp|avif|png|jpg|svg|ico|woff2)$/.test(u.pathname)) {
    ev.respondWith(caches.open(ESTATICOS).then(function(c){
      return c.match(r).then(function(m){
        return m || fetch(r).then(function(res){ if (res.ok) c.put(r, res.clone()); return res; });
      });
    }));
    return;
  }
  ev.respondWith(fetch(r).then(function(res){
    if (res.ok) { var copia = res.clone(); caches.open(PAGINAS).then(function(c){ c.put(r, copia); }); }
    return res;
  }).catch(function(){ return caches.match(r).then(function(m){ return m || caches.match('/'); }); }));
});
