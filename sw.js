/* BalloonBlitz V2 service worker — offline-first app shell.
   V2 note: icons + mp3 files live on the original project's Pages host, so they
   are NOT precached here (a 404 in addAll would break the whole install). */
const CACHE = "balloon-blitz-v2-3";
const CORE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./css/enhance.css",
  "./assets/tex/sky.svg", "./assets/tex/noise.svg",
  "./assets/tex/balloons-pattern.svg", "./assets/tex/hero-balloons.svg",
  "./data/content.js",
  "./js/save.js", "./js/audio.js", "./js/music.js", "./js/ads.js",
  "./js/player.js", "./js/economy.js", "./js/achievements.js", "./js/rewards.js",
  "./js/leaderboard.js", "./js/engine.js", "./js/engine2.js",
  "./js/ui.js", "./js/main.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      // cache each file individually so one failure cannot abort the install
      Promise.all(CORE.map((u) => c.add(u).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => caches.match("./index.html")))
  );
});
