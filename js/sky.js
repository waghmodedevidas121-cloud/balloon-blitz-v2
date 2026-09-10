/*! Balloon Blitz · Sky Realms — Living Sky layer (Phase 0)
 *  A cozy storybook world that breathes behind every screen: dynamic skies,
 *  parallax clouds, hills & windmills, floating islands, birds, drifting
 *  petals, sun rays and soft atmospheric fog. Pure canvas 2D, no image assets.
 *
 *  Adaptive quality tiers, reduced-motion aware, pauses when the tab hides.
 *
 *  API:
 *    BB.Sky.setRealm("sunny"|"cloud"|"rainbow"|"moon"|"star")
 *    BB.Sky.setTimeOfDay("day"|"sunset")
 *    BB.Sky.setQuality("auto"|"high"|"med"|"low")
 *    BB.Sky.pause() / BB.Sky.resume() / BB.Sky.info()
 */
(function () {
  "use strict";

  var BB = (window.BB = window.BB || {});
  if (BB.Sky && BB.Sky.__live) return;

  var CANVAS_ID = "bbSkyCanvas";
  var STYLE_ID = "bbSkyStyle";
  var DPR_CAP = 2;
  var TAU = Math.PI * 2;

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function pick(a) { return a[(Math.random() * a.length) | 0]; }

  /* ------------------------------------------------------- realm palettes
     Warm, hand-painted, storybook. Neon and cyberpunk hues are banned by
     the art direction (doc 03). "sunset" entries override "day" keys. */
  var REALMS = {
    sunny: {
      label: "Sunny Valley",
      ground: "hills",
      life: { birds: 3, petals: 18, ships: 1, sparks: 0, stars: 0 },
      day: {
        sky: [[0, "#8FD0FF"], [0.38, "#BCE7FF"], [0.68, "#E7F6FF"], [1, "#FFF6E1"]],
        sun: { x: 0.78, y: 0.13, r: 0.34, core: "rgba(255,252,232,.95)", glow: "rgba(245,165,36,.22)" },
        land: [["#9BD68C", 0.80], ["#67B461", 0.87], ["#41894F", 0.955]],
        cloud: ["#FFFDF7", "#E2EFFB"],
        fog: "rgba(255,247,230,.42)",
        petal: ["#FFE1ED", "#FFF3C4", "#FFFFFF", "#FFD3A9"],
        ink: "rgba(72,55,48,.60)",
        ray: "rgba(255,242,205,.16)",
        warm: "#F5A524",
        horizon: "#CFEBFF"
      },
      sunset: {
        sky: [[0, "#6B7FC4"], [0.34, "#EFA189"], [0.66, "#FBCE93"], [1, "#FFE8C6"]],
        sun: { x: 0.24, y: 0.31, r: 0.44, core: "rgba(255,239,198,.95)", glow: "rgba(226,110,74,.26)" },
        land: [["#84A277", 0.80], ["#54805A", 0.87], ["#365E46", 0.955]],
        cloud: ["#FFE7CE", "#E2A38C"],
        fog: "rgba(255,214,170,.44)",
        ray: "rgba(255,206,150,.20)",
        warm: "#D9822B",
        horizon: "#F6C79B"
      }
    },

    cloud: {
      label: "Cloud Kingdom",
      ground: "islands",
      life: { birds: 2, petals: 8, ships: 2, sparks: 0, stars: 0 },
      day: {
        sky: [[0, "#7FBEF2"], [0.36, "#AEDCFB"], [0.70, "#DCEFFF"], [1, "#FBF3E4"]],
        sun: { x: 0.20, y: 0.15, r: 0.36, core: "rgba(255,250,235,.92)", glow: "rgba(160,205,255,.26)" },
        land: [["#EAF4FE", 0.78], ["#CFE3F6", 0.88], ["#B2CDE8", 0.96]],
        cloud: ["#FFFFFF", "#DCEAF8"],
        fog: "rgba(240,248,255,.48)",
        petal: ["#FFFFFF", "#E7F2FF", "#FFF0D8"],
        ink: "rgba(58,72,94,.52)",
        ray: "rgba(255,255,255,.20)",
        warm: "#7FB2E8",
        horizon: "#DCEFFF"
      },
      sunset: {
        sky: [[0, "#4E66AC"], [0.34, "#B98BB8"], [0.68, "#F3B48F"], [1, "#FFE3C0"]],
        cloud: ["#FFE9D6", "#D9A0AE"],
        fog: "rgba(255,220,190,.44)",
        warm: "#C97FA0",
        horizon: "#F3C6A8"
      }
    },

    rainbow: {
      label: "Rainbow Heights",
      ground: "falls",
      life: { birds: 1, petals: 10, ships: 0, sparks: 26, stars: 0 },
      day: {
        sky: [[0, "#8AD3F5"], [0.34, "#BFE7F7"], [0.66, "#FBE3F1"], [1, "#FFF3DC"]],
        sun: { x: 0.5, y: 0.11, r: 0.40, core: "rgba(255,253,240,.92)", glow: "rgba(255,190,220,.24)" },
        land: [["#CDEAF6", 0.80], ["#A9D7EE", 0.885], ["#8ABEDF", 0.96]],
        cloud: ["#FFFFFF", "#E9E1FA"],
        fog: "rgba(255,240,250,.46)",
        petal: ["#FFC7E1", "#C9F0FF", "#FFF2B8", "#D8C9FF"],
        ink: "rgba(70,60,88,.52)",
        ray: "rgba(255,236,250,.20)",
        warm: "#F08FC0",
        horizon: "#F6E6F4"
      },
      sunset: {
        sky: [[0, "#6A63B8"], [0.34, "#C98CC4"], [0.68, "#F7B79A"], [1, "#FFE7C8"]],
        cloud: ["#FFE6EE", "#D9A6C6"],
        fog: "rgba(255,224,214,.46)",
        warm: "#D98CB4",
        horizon: "#F7CFC4"
      }
    },

    moon: {
      label: "Moon Balloon Realm",
      ground: "moon",
      life: { birds: 0, petals: 8, ships: 1, sparks: 14, stars: 70 },
      day: {
        sky: [[0, "#1B2350"], [0.40, "#2C3A73"], [0.74, "#4A5794"], [1, "#7E7FA8"]],
        sun: { x: 0.72, y: 0.17, r: 0.30, core: "rgba(247,244,226,.96)", glow: "rgba(180,196,255,.20)" },
        land: [["#3A4479", 0.80], ["#2C3560", 0.885], ["#212845", 0.96]],
        cloud: ["#5A6699", "#3E4877"],
        fog: "rgba(150,165,220,.24)",
        petal: ["#DCE4FF", "#FFF3C8", "#C9D3FF"],
        ink: "rgba(226,232,255,.55)",
        ray: "rgba(206,218,255,.10)",
        warm: "#9FB2FF",
        horizon: "#4A5794"
      },
      sunset: {
        sky: [[0, "#151C41"], [0.4, "#3A3A6E"], [0.74, "#6E5580"], [1, "#A87E86"]],
        cloud: ["#6B5C8C", "#4A3F6B"],
        warm: "#C89BC0",
        horizon: "#6E5580"
      }
    },

    star: {
      label: "Star Kingdom",
      ground: "city",
      life: { birds: 0, petals: 10, ships: 2, sparks: 30, stars: 90 },
      day: {
        sky: [[0, "#2A2C63"], [0.36, "#4B437F"], [0.70, "#9C7C93"], [1, "#F2C68B"]],
        sun: { x: 0.5, y: 0.20, r: 0.44, core: "rgba(255,244,206,.95)", glow: "rgba(245,180,90,.22)" },
        land: [["#F5D79B", 0.80], ["#E0B276", 0.885], ["#B98A5C", 0.96]],
        cloud: ["#FFE9BE", "#E2B98C"],
        fog: "rgba(255,224,170,.34)",
        petal: ["#FFF0BE", "#FFD9A0", "#FFFFFF"],
        ink: "rgba(62,46,40,.55)",
        ray: "rgba(255,232,180,.18)",
        warm: "#F5A524",
        horizon: "#F2C68B"
      },
      sunset: {
        sky: [[0, "#1E2050"], [0.36, "#3E3670"], [0.7, "#8C5F80"], [1, "#E8A46E"]],
        cloud: ["#FFDCA8", "#D79A72"],
        warm: "#E8873C",
        horizon: "#E8A46E"
      }
    }
  };

  function palette(id, tod) {
    var r = REALMS[id] || REALMS.sunny, p = {}, k;
    for (k in r.day) p[k] = r.day[k];
    if (tod === "sunset" && r.sunset) for (k in r.sunset) p[k] = r.sunset[k];
    p.ground = r.ground;
    p.life = r.life;
    p.label = r.label;
    return p;
  }

  /* ---------------------------------------------------------------- state */
  var state = {
    realm: "sunny", tod: "day", quality: "auto", tier: "high",
    running: false, t: 0, last: 0, w: 0, h: 0, dpr: 1,
    pal: null, reduced: false, fps: 60, mills: [], small: false
  };

  var cv = null, ctx = null, raf = 0;
  var skyCache = null, landCache = null, vign = null;

  function makeCanvas(w, h) {
    var c = document.createElement("canvas");
    c.width = Math.max(1, w | 0);
    c.height = Math.max(1, h | 0);
    return c;
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = [
      "#bgDecor{position:fixed!important;inset:0!important;overflow:hidden!important;",
      "pointer-events:none!important;z-index:0!important;opacity:1!important;filter:none!important}",
      "#bgDecor>*:not(#" + CANVAS_ID + "){display:none!important}",
      "#" + CANVAS_ID + "{position:absolute;left:0;top:0;width:100%;height:100%;display:block;pointer-events:none}",
      "#gameCanvas{background:transparent!important}"
    ].join("");
    (document.head || document.documentElement).appendChild(s);
  }

  function mount() {
    injectStyle();
    var host = document.getElementById("bgDecor") || document.body;
    var c = document.getElementById(CANVAS_ID);
    if (!c) {
      c = document.createElement("canvas");
      c.id = CANVAS_ID;
      c.setAttribute("aria-hidden", "true");
      host.insertBefore(c, host.firstChild);
    }
    cv = c;
    ctx = c.getContext("2d", { alpha: false });
    try {
      state.reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    } catch (e) { state.reduced = false; }
  }

  function applyPalette() {
    state.pal = palette(state.realm, state.tod);
    var col = state.pal.horizon || "#BCE7FF";
    try {
      document.body.style.setProperty("background-color", col, "important");
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", col);
    } catch (e) {}
  }

  /* ----------------------------------------------------------- sky caches */
  function paintSky(g, w, h, p) {
    var grad = g.createLinearGradient(0, 0, 0, h), i;
    for (i = 0; i < p.sky.length; i++) grad.addColorStop(p.sky[i][0], p.sky[i][1]);
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);

    var s = p.sun;
    if (s) {
      var sx = w * s.x, sy = h * s.y, r = Math.max(w, h) * s.r;
      var rg = g.createRadialGradient(sx, sy, 0, sx, sy, r);
      rg.addColorStop(0, s.core);
      rg.addColorStop(0.18, s.glow);
      rg.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = rg;
      g.fillRect(0, 0, w, h);
      g.globalAlpha = 0.6;
      g.fillStyle = s.core;
      g.beginPath();
      g.arc(sx, sy, Math.max(w, h) * 0.042, 0, TAU);
      g.fill();
      g.globalAlpha = 1;
    }

    /* atmospheric depth: haze thickens toward the horizon */
    var hz = g.createLinearGradient(0, h * 0.52, 0, h * 0.95);
    hz.addColorStop(0, "rgba(255,255,255,0)");
    hz.addColorStop(1, p.fog);
    g.fillStyle = hz;
    g.fillRect(0, h * 0.52, w, h * 0.48);
  }

  function hillY(x, w, h, yf, amp, phase) {
    return h * yf - Math.sin((x / w) * 3.1 + phase) * amp - Math.sin((x / w) * 7.3 + phase * 1.7) * amp * 0.34;
  }

  function hillPath(g, w, h, yf, amp, phase) {
    g.beginPath();
    g.moveTo(-4, h + 4);
    for (var x = -4; x <= w + 4; x += 8) g.lineTo(x, hillY(x, w, h, yf, amp, phase));
    g.lineTo(w + 4, h + 4);
    g.closePath();
  }

  function cottage(g, x, y, s, p) {
    g.fillStyle = "#FFF7E6";
    g.fillRect(x - 11 * s, y - 13 * s, 22 * s, 13 * s);
    g.fillStyle = p.warm;
    g.beginPath();
    g.moveTo(x - 14 * s, y - 13 * s);
    g.lineTo(x, y - 25 * s);
    g.lineTo(x + 14 * s, y - 13 * s);
    g.closePath();
    g.fill();
    g.fillStyle = "rgba(245,165,36,.85)";
    g.fillRect(x - 3 * s, y - 9 * s, 6 * s, 6 * s);
  }

  function millBody(g, x, y, s, p) {
    g.fillStyle = "#FFF7E6";
    g.beginPath();
    g.moveTo(x - 9 * s, y);
    g.lineTo(x - 6 * s, y - 46 * s);
    g.lineTo(x + 6 * s, y - 46 * s);
    g.lineTo(x + 9 * s, y);
    g.closePath();
    g.fill();
    g.fillStyle = p.warm;
    g.beginPath();
    g.moveTo(x - 8 * s, y - 45 * s);
    g.lineTo(x, y - 56 * s);
    g.lineTo(x + 8 * s, y - 45 * s);
    g.closePath();
    g.fill();
    g.fillStyle = "rgba(110,91,84,.30)";
    g.fillRect(x - 4 * s, y - 22 * s, 8 * s, 7 * s);
  }

  function paintHills(g, w, h, p) {
    var L = p.land, i, amp = h * 0.05, phase, x, y;
    state.mills = [];
    for (i = 0; i < L.length; i++) {
      phase = 1.2 + i * 2.4;
      g.fillStyle = L[i][0];
      hillPath(g, w, h, L[i][1], amp * (1 - i * 0.18), phase);
      g.fill();
      /* soft rim light along each ridge */
      g.strokeStyle = "rgba(255,255,255,.16)";
      g.lineWidth = 2;
      g.beginPath();
      for (x = -4; x <= w + 4; x += 10) {
        y = hillY(x, w, h, L[i][1], amp * (1 - i * 0.18), phase);
        if (x === -4) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.stroke();
    }

    /* windmills on the middle ridge (blades animate on the live layer) */
    var spots = state.small ? [0.22, 0.74] : [0.16, 0.55, 0.86];
    var midAmp = amp * 0.82, midPhase = 3.6, sc;
    for (i = 0; i < spots.length; i++) {
      x = w * spots[i];
      y = hillY(x, w, h, L[1][1], midAmp, midPhase) + 2;
      sc = (h / 780) * (i === 1 ? 1.15 : 0.78);
      millBody(g, x, y, sc, p);
      state.mills.push({ x: x, y: y - 50 * sc, r: 26 * sc, rot: rnd(0, TAU), sp: rnd(0.30, 0.46) / (i === 1 ? 1.15 : 0.9) });
    }

    /* cottages + flower speckle on the front ridge */
    var frontAmp = amp * 0.64, frontPhase = 6.0;
    for (i = 0; i < (state.small ? 2 : 3); i++) {
      x = w * (0.34 + i * 0.26);
      y = hillY(x, w, h, L[2][1], frontAmp, frontPhase) + 3;
      cottage(g, x, y, (h / 900) * 0.95, p);
    }
    var flowers = state.tier === "low" ? 30 : 70;
    for (i = 0; i < flowers; i++) {
      x = rnd(0, w);
      y = hillY(x, w, h, L[2][1], frontAmp, frontPhase) + rnd(4, h * 0.05);
      g.fillStyle = pick(["rgba(255,255,255,.75)", "rgba(255,226,120,.85)", "rgba(255,170,190,.8)"]);
      g.beginPath();
      g.arc(x, y, rnd(1.2, 2.6), 0, TAU);
      g.fill();
    }
  }

  /* --------------------------------------------------- other realm grounds */
  function cloudBlob(g, x, y, w2, h2, top, bottom) {
    var i, n = 7;
    g.fillStyle = bottom;
    g.beginPath();
    g.ellipse(x, y + h2 * 0.35, w2, h2 * 0.75, 0, 0, TAU);
    g.fill();
    g.fillStyle = top;
    for (i = 0; i < n; i++) {
      var px = x - w2 + (i / (n - 1)) * w2 * 2;
      var pr = h2 * (0.62 + 0.34 * Math.sin(i * 1.7));
      g.beginPath();
      g.arc(px, y - h2 * 0.1, Math.abs(pr), 0, TAU);
      g.fill();
    }
  }

  function paintIslands(g, w, h, p) {
    var L = p.land, i;
    /* three floating cloud islands with grass caps and rocky keels */
    var isles = [
      { x: w * 0.18, y: h * 0.74, s: 0.9 },
      { x: w * 0.62, y: h * 0.83, s: 1.25 },
      { x: w * 0.95, y: h * 0.66, s: 0.7 }
    ];
    /* air bridge between the first two */
    g.strokeStyle = "rgba(110,91,84,.35)";
    g.lineWidth = Math.max(2, h * 0.003);
    g.beginPath();
    g.moveTo(isles[0].x + w * 0.06, isles[0].y - h * 0.02);
    g.quadraticCurveTo(w * 0.4, isles[0].y + h * 0.05, isles[1].x - w * 0.1, isles[1].y - h * 0.03);
    g.stroke();

    for (i = 0; i < isles.length; i++) {
      var o = isles[i], iw = w * 0.16 * o.s, ih = h * 0.045 * o.s;
      cloudBlob(g, o.x, o.y + ih * 1.2, iw, ih, L[0][0], L[1][0]);
      g.fillStyle = "#7FC46F";
      g.beginPath();
      g.ellipse(o.x, o.y - ih * 0.15, iw * 0.82, ih * 0.62, 0, Math.PI, TAU);
      g.fill();
      g.fillStyle = L[2][0];
      g.beginPath();
      g.moveTo(o.x - iw * 0.5, o.y + ih * 0.3);
      g.lineTo(o.x, o.y + ih * 2.4);
      g.lineTo(o.x + iw * 0.5, o.y + ih * 0.3);
      g.closePath();
      g.fill();
      if (o.s > 0.8) cottage(g, o.x + iw * 0.1, o.y - ih * 0.5, (h / 950) * o.s, p);
    }
    /* soft cloud sea at the bottom */
    for (i = 0; i < (state.small ? 5 : 8); i++) {
      cloudBlob(g, (i / 7) * w * 1.1 - w * 0.05, h * 1.0, w * 0.2, h * 0.05, p.cloud[0], p.cloud[1]);
    }
  }

  function paintFalls(g, w, h, p) {
    var L = p.land, i;
    /* crystal cliffs */
    for (i = 0; i < L.length; i++) {
      g.fillStyle = L[i][0];
      hillPath(g, w, h, L[i][1], h * 0.04 * (1 - i * 0.2), 2.1 + i * 1.9);
      g.fill();
    }
    /* rainbow waterfalls */
    var cols = ["#FF9AA2", "#FFD59A", "#FFF6A5", "#A8E6A1", "#A5D8FF", "#C7B3FF"];
    var fx = [w * 0.24, w * 0.68];
    for (var f = 0; f < fx.length; f++) {
      for (i = 0; i < cols.length; i++) {
        g.globalAlpha = 0.5;
        g.fillStyle = cols[i];
        g.fillRect(fx[f] + i * (w * 0.011), h * 0.80, w * 0.011, h * 0.22);
        g.globalAlpha = 1;
      }
    }
    /* big rainbow arc */
    g.lineWidth = Math.max(4, h * 0.012);
    for (i = 0; i < cols.length; i++) {
      g.globalAlpha = 0.34;
      g.strokeStyle = cols[i];
      g.beginPath();
      g.arc(w * 0.5, h * 0.95, h * (0.34 + i * 0.014), Math.PI * 1.06, Math.PI * 1.94);
      g.stroke();
    }
    g.globalAlpha = 1;
  }

  function paintMoonGround(g, w, h, p) {
    var L = p.land, i;
    /* big soft moon */
    var mx = w * 0.74, my = h * 0.19, mr = Math.min(w, h) * 0.11;
    var rg = g.createRadialGradient(mx, my, mr * 0.2, mx, my, mr * 3.4);
    rg.addColorStop(0, "rgba(255,250,225,.34)");
    rg.addColorStop(1, "rgba(255,250,225,0)");
    g.fillStyle = rg;
    g.beginPath();
    g.arc(mx, my, mr * 3.4, 0, TAU);
    g.fill();
    g.fillStyle = "#F7F3DC";
    g.beginPath();
    g.arc(mx, my, mr, 0, TAU);
    g.fill();
    g.fillStyle = "rgba(190,190,170,.22)";
    g.beginPath();
    g.arc(mx - mr * 0.3, my - mr * 0.2, mr * 0.22, 0, TAU);
    g.arc(mx + mr * 0.28, my + mr * 0.3, mr * 0.15, 0, TAU);
    g.fill();
    /* moon islands */
    for (i = 0; i < L.length; i++) {
      g.fillStyle = L[i][0];
      hillPath(g, w, h, L[i][1], h * 0.042 * (1 - i * 0.2), 4.4 + i * 1.6);
      g.fill();
    }
    g.strokeStyle = "rgba(226,232,255,.22)";
    g.lineWidth = 2;
    g.beginPath();
    for (var x = -4; x <= w + 4; x += 10) {
      var y = hillY(x, w, h, L[0][1], h * 0.042, 4.4);
      if (x === -4) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
  }

  function paintCity(g, w, h, p) {
    var L = p.land, i, j;
    /* golden cloud banks */
    for (i = 0; i < 3; i++) {
      cloudBlob(g, w * (0.15 + i * 0.36), h * (0.84 + i * 0.03), w * 0.26, h * 0.05, L[0][0], L[1][0]);
    }
    /* sky city silhouette */
    g.fillStyle = "rgba(96,66,54,.55)";
    var towers = state.small ? 5 : 8;
    for (i = 0; i < towers; i++) {
      var tx = w * (0.06 + i * (0.88 / towers));
      var tw = w * 0.05;
      var th = h * (0.07 + 0.08 * Math.abs(Math.sin(i * 1.9)));
      var ty = h * 0.86 - th;
      g.fillRect(tx, ty, tw, th);
      g.beginPath();
      g.moveTo(tx - tw * 0.15, ty);
      g.lineTo(tx + tw * 0.5, ty - th * 0.34);
      g.lineTo(tx + tw * 1.15, ty);
      g.closePath();
      g.fill();
      g.fillStyle = "rgba(255,224,150,.85)";
      for (j = 0; j < 3; j++) g.fillRect(tx + tw * 0.24, ty + th * (0.24 + j * 0.24), tw * 0.5, th * 0.1);
      g.fillStyle = "rgba(96,66,54,.55)";
    }
  }

  function paintLand(g, w, h, p) {
    if (p.ground === "islands") return paintIslands(g, w, h, p);
    if (p.ground === "falls") return paintFalls(g, w, h, p);
    if (p.ground === "moon") return paintMoonGround(g, w, h, p);
    if (p.ground === "city") return paintCity(g, w, h, p);
    return paintHills(g, w, h, p);
  }

  function buildCaches() {
    var w = state.w, h = state.h, p = state.pal;
    skyCache = makeCanvas(w, h);
    paintSky(skyCache.getContext("2d"), w, h, p);
    landCache = makeCanvas(w, h);
    paintLand(landCache.getContext("2d"), w, h, p);
    var g = ctx.createRadialGradient(w * 0.5, h * 0.42, Math.min(w, h) * 0.34, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(59,46,42,.15)");
    vign = g;
  }

  /* ------------------------------------------------------------- entities */
  var clouds = [], birds = [], petals = [], ships = [], sparks = [], stars = [];
  var MUL = { high: 1, med: 0.6, low: 0.3 };

  function puffs() {
    var n = 4 + (Math.random() * 3 | 0), out = [], i;
    for (i = 0; i < n; i++) out.push([(i - (n - 1) / 2) * 21 + rnd(-5, 5), rnd(-9, 5), rnd(15, 29)]);
    return out;
  }

  function makeCloud(spread) {
    var w = state.w, h = state.h, far = Math.random() < 0.5;
    return {
      x: spread ? rnd(-0.15 * w, 1.15 * w) : -0.3 * w,
      y: rnd(h * 0.04, h * 0.56),
      s: (far ? rnd(0.45, 0.75) : rnd(0.85, 1.5)) * (h / 780),
      v: far ? rnd(4, 9) : rnd(11, 22),
      a: far ? rnd(0.45, 0.7) : rnd(0.8, 1),
      p: rnd(0, TAU),
      far: far,
      puffs: puffs()
    };
  }

  function makeFlock(spread) {
    var w = state.w, h = state.h;
    return {
      x: spread ? rnd(0, w) : -w * 0.15,
      y: rnd(h * 0.10, h * 0.44),
      v: rnd(26, 46),
      n: 3 + (Math.random() * 3 | 0),
      p: rnd(0, TAU),
      s: rnd(0.7, 1.15) * (h / 780)
    };
  }

  function makePetal(spread) {
    var w = state.w, h = state.h;
    return {
      x: spread ? rnd(0, w) : rnd(-0.1 * w, w),
      y: spread ? rnd(0, h) : -20,
      vx: rnd(8, 26),
      vy: rnd(12, 34),
      r: rnd(0, TAU),
      vr: rnd(-1.4, 1.4),
      sz: rnd(3.5, 8) * (state.h / 780),
      c: pick(state.pal.petal || ["#FFFFFF"]),
      p: rnd(0, TAU)
    };
  }

  function makeShip(spread) {
    var w = state.w, h = state.h;
    return {
      x: spread ? rnd(0, w) : -w * 0.2,
      y: rnd(h * 0.14, h * 0.5),
      v: rnd(9, 17),
      s: rnd(0.75, 1.25) * (h / 780),
      p: rnd(0, TAU)
    };
  }

  function makeSpark() {
    return { x: rnd(0, state.w), y: rnd(0, state.h * 0.8), p: rnd(0, TAU), sz: rnd(1.4, 3.4), sp: rnd(0.7, 2.1) };
  }

  function makeStar() {
    return { x: rnd(0, state.w), y: rnd(0, state.h * 0.7), p: rnd(0, TAU), sz: rnd(0.7, 1.9), sp: rnd(0.4, 1.6) };
  }

  function seedEntities() {
    var L = state.pal.life, m = MUL[state.tier] || 1, i, n;
    clouds.length = 0;
    n = Math.round((state.small ? 7 : 12) * m);
    for (i = 0; i < n; i++) clouds.push(makeCloud(true));
    birds.length = 0;
    n = Math.round(L.birds * m);
    for (i = 0; i < n; i++) birds.push(makeFlock(true));
    petals.length = 0;
    n = Math.round(L.petals * m * (state.small ? 0.7 : 1));
    for (i = 0; i < n; i++) petals.push(makePetal(true));
    ships.length = 0;
    n = Math.round(L.ships * m);
    for (i = 0; i < n; i++) ships.push(makeShip(true));
    sparks.length = 0;
    n = Math.round(L.sparks * m);
    for (i = 0; i < n; i++) sparks.push(makeSpark());
    stars.length = 0;
    n = Math.round(L.stars * (state.tier === "low" ? 0.5 : 1));
    for (i = 0; i < n; i++) stars.push(makeStar());
  }

  /* --------------------------------------------------------------- drawing */
  function drawCloud(g, c, p) {
    var i, q = c.puffs;
    g.save();
    g.translate(c.x, c.y + Math.sin(state.t * 0.32 + c.p) * 4);
    g.scale(c.s, c.s * 0.9);
    g.globalAlpha = c.a * (c.far ? 0.72 : 0.96);
    g.fillStyle = p.cloud[1];
    for (i = 0; i < q.length; i++) { g.beginPath(); g.arc(q[i][0], q[i][1] + 8, q[i][2], 0, TAU); g.fill(); }
    g.fillStyle = p.cloud[0];
    for (i = 0; i < q.length; i++) { g.beginPath(); g.arc(q[i][0], q[i][1], q[i][2], 0, TAU); g.fill(); }
    g.restore();
    g.globalAlpha = 1;
  }

  function drawFlock(g, f, p) {
    var i, flap = Math.sin(state.t * 7 + f.p);
    g.strokeStyle = p.ink;
    g.lineWidth = 1.7 * f.s;
    for (i = 0; i < f.n; i++) {
      var bx = f.x - i * 17 * f.s;
      var by = f.y + Math.abs(i - (f.n - 1) / 2) * 9 * f.s + Math.sin(state.t * 0.8 + f.p + i) * 4;
      var wing = 6 * f.s * (0.55 + 0.45 * flap);
      g.beginPath();
      g.moveTo(bx - 7 * f.s, by + wing);
      g.quadraticCurveTo(bx, by - wing * 0.8, bx + 7 * f.s, by + wing);
      g.stroke();
    }
  }

  function drawShip(g, s, p) {
    var y = s.y + Math.sin(state.t * 0.5 + s.p) * 6;
    g.save();
    g.translate(s.x, y);
    g.scale(s.s, s.s);
    g.rotate(Math.sin(state.t * 0.4 + s.p) * 0.04);
    g.fillStyle = "rgba(59,46,42,.12)";
    g.beginPath();
    g.ellipse(2, 4, 34, 20, 0, 0, TAU);
    g.fill();
    g.fillStyle = "#FFF7E6";
    g.beginPath();
    g.ellipse(0, 0, 33, 19, 0, 0, TAU);
    g.fill();
    g.fillStyle = p.warm;
    g.beginPath();
    g.ellipse(0, 0, 33, 19, 0, Math.PI * 1.72, Math.PI * 0.28);
    g.fill();
    g.strokeStyle = "rgba(110,91,84,.5)";
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(-9, 16); g.lineTo(-6, 25);
    g.moveTo(9, 16); g.lineTo(6, 25);
    g.stroke();
    g.fillStyle = "#B98A5C";
    g.beginPath();
    g.moveTo(-11, 25); g.lineTo(11, 25); g.lineTo(8, 33); g.lineTo(-8, 33);
    g.closePath();
    g.fill();
    g.fillStyle = "#E2565B";
    g.beginPath();
    g.moveTo(0, -19); g.lineTo(0, -30); g.lineTo(13, -25); g.closePath();
    g.fill();
    g.restore();
  }

  function drawPetal(g, o) {
    g.save();
    g.translate(o.x + Math.sin(state.t * 1.1 + o.p) * 10, o.y);
    g.rotate(o.r);
    g.globalAlpha = 0.85;
    g.fillStyle = o.c;
    g.beginPath();
    g.ellipse(0, 0, o.sz, o.sz * 0.55, 0, 0, TAU);
    g.fill();
    g.restore();
    g.globalAlpha = 1;
  }

  function drawTwinkle(g, o, col, base) {
    var a = base + 0.5 * base * Math.sin(state.t * o.sp + o.p);
    if (a <= 0) return;
    g.globalAlpha = a;
    g.fillStyle = col;
    g.beginPath();
    g.arc(o.x, o.y, o.sz, 0, TAU);
    g.fill();
    g.globalAlpha = a * 0.5;
    g.fillRect(o.x - o.sz * 3, o.y - 0.4, o.sz * 6, 0.8);
    g.fillRect(o.x - 0.4, o.y - o.sz * 3, 0.8, o.sz * 6);
    g.globalAlpha = 1;
  }

  function drawRays(g, p) {
    var s = p.sun;
    if (!s) return;
    var sx = state.w * s.x, sy = state.h * s.y, len = Math.max(state.w, state.h) * 1.2, i;
    g.save();
    g.translate(sx, sy);
    g.rotate(state.t * 0.012);
    g.fillStyle = p.ray;
    for (i = 0; i < 7; i++) {
      var a = (i / 7) * TAU;
      var wdt = 0.055 + 0.03 * Math.sin(state.t * 0.5 + i);
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(Math.cos(a - wdt) * len, Math.sin(a - wdt) * len);
      g.lineTo(Math.cos(a + wdt) * len, Math.sin(a + wdt) * len);
      g.closePath();
      g.fill();
    }
    g.restore();
  }

  function drawMills(g, p) {
    var i, j, m;
    for (i = 0; i < state.mills.length; i++) {
      m = state.mills[i];
      g.save();
      g.translate(m.x, m.y);
      g.rotate(m.rot);
      for (j = 0; j < 4; j++) {
        g.rotate(Math.PI / 2);
        g.fillStyle = "#FFF7E6";
        g.beginPath();
        g.moveTo(0, -2.5);
        g.lineTo(m.r, -m.r * 0.26);
        g.lineTo(m.r, m.r * 0.1);
        g.lineTo(0, 2.5);
        g.closePath();
        g.fill();
        g.strokeStyle = "rgba(110,91,84,.45)";
        g.lineWidth = 1;
        g.stroke();
      }
      g.restore();
      g.fillStyle = p.warm;
      g.beginPath();
      g.arc(m.x, m.y, Math.max(2, m.r * 0.12), 0, TAU);
      g.fill();
    }
  }

  /* ---------------------------------------------------------------- frame */
  function update(dt) {
    var w = state.w, h = state.h, i, o;
    for (i = 0; i < clouds.length; i++) {
      o = clouds[i];
      o.x += o.v * dt;
      if (o.x - 120 > w) { clouds[i] = makeCloud(false); }
    }
    for (i = 0; i < birds.length; i++) {
      o = birds[i];
      o.x += o.v * dt;
      if (o.x - 80 > w) birds[i] = makeFlock(false);
    }
    for (i = 0; i < ships.length; i++) {
      o = ships[i];
      o.x += o.v * dt;
      if (o.x - 90 > w) ships[i] = makeShip(false);
    }
    for (i = 0; i < petals.length; i++) {
      o = petals[i];
      o.x += o.vx * dt;
      o.y += o.vy * dt;
      o.r += o.vr * dt;
      if (o.y - 24 > h || o.x - 24 > w) {
        petals[i] = makePetal(false);
        petals[i].y = -20;
        petals[i].x = rnd(-0.15 * w, w);
      }
    }
  }

  function render() {
    var g = ctx, p = state.pal, i;
    g.drawImage(skyCache, 0, 0, state.w, state.h);
    if (stars.length) for (i = 0; i < stars.length; i++) drawTwinkle(g, stars[i], "#FFF8DC", 0.5);
    if (state.tier === "high") drawRays(g, p);
    for (i = 0; i < clouds.length; i++) if (clouds[i].far) drawCloud(g, clouds[i], p);
    g.drawImage(landCache, 0, 0, state.w, state.h);
    if (state.mills.length) drawMills(g, p);
    for (i = 0; i < ships.length; i++) drawShip(g, ships[i], p);
    for (i = 0; i < clouds.length; i++) if (!clouds[i].far) drawCloud(g, clouds[i], p);
    for (i = 0; i < birds.length; i++) drawFlock(g, birds[i], p);
    for (i = 0; i < petals.length; i++) drawPetal(g, petals[i]);
    if (sparks.length) for (i = 0; i < sparks.length; i++) drawTwinkle(g, sparks[i], p.warm, 0.42);
    g.fillStyle = vign;
    g.fillRect(0, 0, state.w, state.h);
  }

  /* ------------------------------------------------- adaptive quality tier */
  var fpsAcc = 0, fpsFrames = 0, fpsWindow = 0;
  function trackFps(dt) {
    fpsAcc += 1 / Math.max(dt, 0.0001);
    fpsFrames++;
    fpsWindow += dt;
    if (fpsWindow < 2) return;
    state.fps = fpsAcc / fpsFrames;
    fpsAcc = 0; fpsFrames = 0; fpsWindow = 0;
    if (state.quality !== "auto") return;
    var t = state.tier;
    if (state.fps < 46 && t !== "low") setTier(t === "high" ? "med" : "low");
    else if (state.fps > 57 && t !== "high") setTier(t === "low" ? "med" : "high");
  }

  function setTier(t) {
    if (state.tier === t) return;
    state.tier = t;
    seedEntities();
  }

  function frame(now) {
    if (!state.running) return;
    raf = requestAnimationFrame(frame);
    var dt = (now - state.last) / 1000;
    state.last = now;
    if (!(dt > 0)) return;
    if (dt > 0.25) dt = 0.25;
    trackFps(dt);
    var m = state.reduced ? 0.3 : 1;
    state.t += dt * m;
    update(dt * m);
    render();
  }

  function resize() {
    var w = Math.max(320, window.innerWidth | 0);
    var h = Math.max(420, window.innerHeight | 0);
    state.w = w;
    state.h = h;
    state.small = w < 520;
    state.dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1);
    cv.width = Math.round(w * state.dpr);
    cv.height = Math.round(h * state.dpr);
    cv.style.width = w + "px";
    cv.style.height = h + "px";
    ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    buildCaches();
    seedEntities();
    render();
  }

  var rt = 0;
  function onResize() {
    clearTimeout(rt);
    rt = setTimeout(function () { if (cv) resize(); }, 180);
  }

  function pause() {
    state.running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function resume() {
    if (state.running || !cv) return;
    state.running = true;
    state.last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------ api */
  function setRealm(id) {
    if (!REALMS[id] || state.realm === id) return;
    state.realm = id;
    applyPalette();
    if (cv) { buildCaches(); seedEntities(); render(); }
  }

  function setTod(tod) {
    tod = tod === "sunset" ? "sunset" : "day";
    if (state.tod === tod) return;
    state.tod = tod;
    applyPalette();
    if (cv) { buildCaches(); seedEntities(); render(); }
  }

  function setQuality(q) {
    state.quality = q === "high" || q === "med" || q === "low" ? q : "auto";
    if (state.quality !== "auto") setTier(state.quality);
  }

  var WORLD_REALM = ["sunny", "cloud", "rainbow", "moon", "star"];
  function setWorld(n) { setRealm(WORLD_REALM[clamp((n | 0) - 1, 0, 4)]); }

  BB.Sky = {
    __live: true,
    setRealm: setRealm,
    setWorld: setWorld,
    setTimeOfDay: setTod,
    setQuality: setQuality,
    pause: pause,
    resume: resume,
    realms: WORLD_REALM.slice(),
    info: function () {
      return { realm: state.realm, label: state.pal ? state.pal.label : "", tod: state.tod, tier: state.tier, fps: Math.round(state.fps) };
    }
  };

  function boot() {
    var hh = new Date().getHours();
    state.tod = hh >= 17 && hh < 21 ? "sunset" : "day";
    mount();
    applyPalette();
    resize();
    resume();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pause(); else resume();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
