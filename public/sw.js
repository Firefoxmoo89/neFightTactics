const CACHE_NAME = "myapp-cache-v1";

// List every file in /public you want cached
const ASSETS_TO_CACHE = [
  "/", // root
  "/html/home.html",
  "/html/lobby.html",
  "/html/play.html",
  "/css/style.css",
  "/script/app.js", //Still gotta work on scripts
  "/manifest.json",
  "/image/0.png",
	"/image/1.png",
	"/image/2.png",
	"/image/3.png",
	"/image/4.png",
	"/image/5.png",
	"/image/6.png",
	"/image/add.png",
	"/image/assassin.png",
	"/image/back.png",
	"/image/background.png",
	"/image/extra.png",
	"/image/protect.png",
  // Add all other files in public/
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});