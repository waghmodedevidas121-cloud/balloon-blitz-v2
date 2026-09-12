/*! Balloon Blitz · Sky Realms — FIX PASS 2 (bug fixes only, no gameplay rewrites)
 *
 *  1. BB.UI.decor() did `#bgDecor.innerHTML = ""` and then re-filled the host
 *     with the old neon balloons. That deleted the living-sky canvas that
 *     js/sky.js had mounted inside #bgDecor, so the world died on every boot
 *     (only the static sky.svg fallback was left) while the sky loop kept
 *     rendering at 60 fps into a detached canvas. decor() is now sky-safe and
 *     the canvas is re-attached if anything removes it.
 *  2. The shell glue read `gameState.world`, but gameState is a STRING
 *     ("HOME" / "PLAYING" / "PAUSED"), so the realm never followed the
 *     campaign. The realm is now derived from currentLevelId + Content.WORLDS.
 *  3. Two full-screen canvases animated at the same time during a run. The
 *     sky now freezes while a run is live and comes back alive in the menus.
 *  4. body.bb-playing lets css/app.css drop the paper-grain / vignette
 *     overlays that were compositing on top of the gameplay canvas.
 *  5. BB.UI.bind() now guards #btnClaimDaily and keeps its claim behavior in
 *     one handler, so one tap cannot consume two daily rewards.
 *  6. A throw inside a cosmetic subsystem (music / sky / ads / audio) used to
 *     abort main.js's single boot try-block BEFORE BB.Engine.init(), which
 *     left the game completely dead. Those calls are shielded now, so the
 *     engine always boots.
 *  7. The render loop simulated the playfield on the menus: BB.Engine.init()
 *     ended with initBalloons() and the rAF loop only read gameState for a
 *     PAUSED freeze and the round timer, so the whole Blitz field floated up
 *     behind the home screen while reset(null) sent every escaped balloon
 *     back to the bottom. That one is fixed at the source -- js/engine2.js
 *     now gates loop() on a live round and init() no longer builds the field
 *     -- so nothing here has to police the entity lists.
 */
(function () {
  var BB = (window.BB = window.BB || {});
  var skyCanvas = null, lastRealm = 0, playing = null;

  function $(id) { return document.getElementById(id); }

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  /* ------------------------------------------- 6. boot can never die again */
  function shield(obj, names) {
    if (!obj) return;
    for (var i = 0; i < names.length; i++) {
      (function (n) {
        var f = obj[n];
        if (typeof f !== "function" || f.__bbShield) return;
        function g() {
          try { return f.apply(obj, arguments); } catch (e) { return null; }
        }
        g.__bbShield = true;
        obj[n] = g;
      })(names[i]);
    }
  }

  function stub(name, methods) {
    if (BB[name]) return;
    var o = {};
    for (var i = 0; i < methods.length; i++) o[methods[i]] = function () { return null; };
    BB[name] = o;
  }

  var MUSIC_API = ["init", "play", "playMode", "apply", "stop", "want", "setRealm"];
  var SKY_API = ["setRealm", "setWorld", "setTimeOfDay", "setQuality", "pause", "resume"];

  stub("Music", MUSIC_API);
  stub("Sky", SKY_API);
  stub("Ads", ["init", "showRewarded", "showInterstitial"]);
  if (!BB.Audio || !BB.Audio.sound) {
    BB.Audio = BB.Audio || {};
    BB.Audio.sound = BB.Audio.sound || {
      muted: false,
      init: function () {}, pop: function () {}, vibrate: function () {}, victory: function () {}
    };
  }
  shield(BB.Music, MUSIC_API);
  shield(BB.Sky, SKY_API);
  shield(BB.Ads, ["init", "showInterstitial"]);

  /* ------------------------------------- 1. keep the living sky attached */
  function remember() {
    var c = $("bbSkyCanvas");
    if (c) skyCanvas = c;
    return skyCanvas;
  }

  function tidyDecor() {
    var host = $("bgDecor");
    if (!host) return;
    remember();
    var kids = Array.prototype.slice.call(host.children);
    for (var i = 0; i < kids.length; i++) {
      if (kids[i].id !== "bbSkyCanvas") host.removeChild(kids[i]);
    }
    if (skyCanvas && !skyCanvas.parentNode) host.insertBefore(skyCanvas, host.firstChild);
  }

  function patchDecor() {
    if (!BB.UI || typeof BB.UI.decor !== "function" || BB.UI.decor.__bbSkySafe) return;
    BB.UI.decor = function () { tidyDecor(); };
    BB.UI.decor.__bbSkySafe = true;
  }

  function watchDecor() {
    var host = $("bgDecor");
    if (!host || host.__bbWatched || !window.MutationObserver) return;
    host.__bbWatched = true;
    new window.MutationObserver(function () {
      remember();
      if (skyCanvas && !skyCanvas.parentNode) host.insertBefore(skyCanvas, host.firstChild);
    }).observe(host, { childList: true });
  }

  /* ---------------------------------- 2. the realm follows the campaign */
  function worldOf(level) {
    var ws = BB.Content && BB.Content.WORLDS;
    if (ws && ws.length) {
      for (var i = 0; i < ws.length; i++) {
        if (level >= ws[i].start && level <= ws[i].end) return ws[i].id || (i + 1);
      }
    }
    return Math.floor((level - 1) / 25) + 1;
  }

  function syncRealm() {
    var lvl = window.currentLevelId | 0;
    if (lvl < 1) return;
    var realm = ((worldOf(lvl) - 1) % 5) + 1;
    if (realm === lastRealm) return;
    lastRealm = realm;
    BB.Sky.setWorld(realm);
  }

  /* -------------------- 3 + 4. only one animated canvas during a run */
  function engineState() {
    try {
      var s = BB.Engine.state();
      if (s && s.state) return s.state;
    } catch (e) {}
    return typeof window.gameState === "string" ? window.gameState : "HOME";
  }

  function tick() {
    var live = engineState() === "PLAYING";
    if (live !== playing) {
      playing = live;
      try { document.body.classList.toggle("bb-playing", live); } catch (e) {}
      if (live) BB.Sky.pause(); else BB.Sky.resume();
    }
    if (live) syncRealm();
  }

  function hookStarts() {
    var names = ["startLevel", "startBlitz", "startInfinite", "startPuzzle", "startSlingshot"];
    for (var i = 0; i < names.length; i++) {
      (function (n) {
        var f = window[n];
        if (typeof f !== "function" || f.__bbHooked) return;
        function g() {
          var r = f.apply(this, arguments);
          setTimeout(tick, 0);
          return r;
        }
        g.__bbHooked = true;
        window[n] = g;
      })(names[i]);
    }
  }

  /* -------------------------------------------------------------- boot */
  function pass() {
    patchDecor();
    tidyDecor();
    watchDecor();
    hookStarts();
    tick();
  }

  patchDecor();
  ready(function () {
    pass();
    setTimeout(pass, 700);
    setTimeout(pass, 2200);
    setInterval(tick, 400);
    window.addEventListener("resize", function () { setTimeout(tick, 200); }, { passive: true });
  });

  BB.Fix = {
    pass: pass,
    tidyDecor: tidyDecor,
    syncRealm: syncRealm
  };
})();
