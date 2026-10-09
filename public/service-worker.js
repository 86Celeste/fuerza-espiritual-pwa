const CACHE_NAME = 'app-cache-v1';

// Verificar actualizaciones cada cierto tiempo
setInterval(() => {
  self.registration.update();
}, 60000); // Verifica cada 60 segundos

// Listener cuando hay una nueva versión
self.addEventListener('controllerchange', () => {
  // Notificar al usuario que hay una actualización
  console.log('Nueva versión disponible');
});

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(['/']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});