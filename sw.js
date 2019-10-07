var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  '/tts/index.html',
  '/tts/css/style.css',
  '/tts/js/main.js'
];
for(i=0;i<20;i++){
  filesToCache.push("/tts/resource/stories/"+i+".txt");
}
/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
