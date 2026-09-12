/* Balloon Blitz · Sky Realms — service worker
   Cache-first for static shell, network-first for navigations so a new
   build is picked up on the next visit. Every entry is added one-by-one so
   a single missing file can never fail the whole install. */
const CACHE = "balloon-blitz-v2-12";

const CORE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/app.css",
  "./assets/tex/sky.svg",
  "./assets/tex/noise.svg",
  "./assets/tex/balloons-pattern.svg",
  "./assets/tex/hero-balloons.svg",
  "./assets/tex/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./data/content.js",
  "./js/save.js",
  "./js/audio.js",
  "./js/player.js",
  "./js/economy.js",
  "./js/achievements.js",
  "./js/rewards.js",
  "./js/leaderboard.js",
  "./js/music.js",
  "./js/sky.js",
  "./js/ads.js",
  "./js/engine.js",
  "./js/engine2.js",
  "./js/ui.js",
  "./js/main.js",
  "./js/fix.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(CORE.map((u) => c.add(u).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  /* navigations: fresh build wins, cache is the offline safety net */
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put("./index.html", copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match("./index.html").then((r) => r || caches.match("./")))
    );
    return;
  }

  /* static assets: cache-first, refreshed quietly in the background */
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
