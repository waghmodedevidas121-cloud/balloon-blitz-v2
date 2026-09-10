/*! Balloon Blitz · Sky Realms — Procedural soundtrack (Phase 0)
 *  Replaces the old cross-origin MP3 streams with a fully local WebAudio
 *  score: warm pads, soft bass, sparse pentatonic melody and gentle wind.
 *
 *  → zero network requests, zero binary assets, portal-certification safe.
 *  Drop-in replacement for the previous BB.Music API
 *  (init / play / playMode / apply / stop / want).
 */
(function () {
  "use strict";

  var BB = (window.BB = window.BB || {});

  var FADE = 1.6;          /* seconds of cross-fade between moods */
  var LOOKAHEAD = 0.8;     /* scheduler horizon in seconds        */
  var TICK_MS = 130;

  /* ------------------------------------------------------------------ moods
     Cozy, warm, storybook. Pentatonic scales keep everything consonant so
     random melodies can never sound wrong. */
  var MOODS = {
    home: {
      root: 57, scale: [0, 2, 4, 7, 9], bpm: 66, chords: [0, 5, 3, 4],
      pad: "sine", lead: "triangle", density: 0.30, cut: 1500, wind: 0.30, gain: 0.85, bells: 1
    },
    sunny: {
      root: 60, scale: [0, 2, 4, 7, 9], bpm: 84, chords: [0, 4, 5, 3],
      pad: "triangle", lead: "triangle", density: 0.46, cut: 1950, wind: 0.22, gain: 0.9, bells: 0
    },
    cloud: {
      root: 55, scale: [0, 2, 5, 7, 9], bpm: 74, chords: [0, 3, 5, 4],
      pad: "sine", lead: "sine", density: 0.38, cut: 1400, wind: 0.46, gain: 0.85, bells: 1
    },
    rainbow: {
      root: 62, scale: [0, 2, 4, 7, 11], bpm: 96, chords: [0, 5, 4, 2],
      pad: "triangle", lead: "triangle", density: 0.58, cut: 2500, wind: 0.16, gain: 0.9, bells: 1
    },
    moon: {
      root: 50, scale: [0, 3, 5, 7, 10], bpm: 60, chords: [0, 3, 4, 2],
      pad: "sine", lead: "sine", density: 0.26, cut: 1050, wind: 0.38, gain: 0.8, bells: 1
    },
    star: {
      root: 64, scale: [0, 2, 4, 7, 9], bpm: 88, chords: [0, 5, 3, 4],
      pad: "triangle", lead: "sine", density: 0.52, cut: 2600, wind: 0.20, gain: 0.9, bells: 1
    },
    rush: {
      root: 59, scale: [0, 2, 4, 7, 9], bpm: 122, chords: [0, 4, 5, 4],
      pad: "triangle", lead: "triangle", density: 0.72, cut: 2300, wind: 0.14, gain: 0.95, bells: 0
    },
    survival: {
      root: 53, scale: [0, 2, 3, 7, 10], bpm: 100, chords: [0, 3, 1, 4],
      pad: "triangle", lead: "triangle", density: 0.50, cut: 1650, wind: 0.52, gain: 0.88, bells: 0
    },
    boss: {
      root: 48, scale: [0, 2, 3, 7, 10], bpm: 108, chords: [0, 1, 5, 4],
      pad: "triangle", lead: "triangle", density: 0.66, cut: 1500, wind: 0.34, gain: 1, bells: 0
    }
  };

  /* Legacy track names and game modes both resolve into a mood. */
  var TRACKS = {
    home: "home", menu: "home", campaign: "sunny", level: "sunny",
    blitz: "rush", rush: "rush", survival: "survival", infinite: "survival",
    puzzle: "cloud", sling: "star", slingshot: "star", boss: "boss",
    sunny: "sunny", cloud: "cloud", rainbow: "rainbow", moon: "moon", star: "star"
  };

  var MODE_MAP = {
    HOME: "home", MENU: "home", CAMPAIGN: "sunny", LEVEL: "sunny",
    BLITZ: "rush", INFINITE: "survival", SURVIVAL: "survival",
    PUZZLE: "cloud", SLING: "star", SLINGSHOT: "star", BOSS: "boss"
  };

  var REALM_MOOD = { sunny: "sunny", cloud: "cloud", rainbow: "rainbow", moon: "moon", star: "star" };

  /* ------------------------------------------------------------ audio graph */
  var ctx = null, master = null, lp = null, delay = null, wetGain = null;
  var windGain = null, started = false, running = false;
  var cur = null, curId = "home", pending = null, unlocked = false;
  var timer = 0, beat = 0, nextTime = 0;

  function hz(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  function settings() {
    var s = (BB.Save && BB.Save.data && BB.Save.data.settings) || {};
    return s;
  }

  function want() {
    var s = settings();
    if (s.music === false) return false;
    if (s.sound === false) return false;
    return true;
  }

  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }

    master = ctx.createGain();
    master.gain.value = 0;

    lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 1800;
    lp.Q.value = 0.5;
    lp.connect(master);

    /* soft echo tail keeps single notes from sounding dry and cheap */
    delay = ctx.createDelay(1.2);
    delay.delayTime.value = 0.32;
    var fb = ctx.createGain();
    fb.gain.value = 0.26;
    wetGain = ctx.createGain();
    wetGain.gain.value = 0.20;
    delay.connect(fb);
    fb.connect(delay);
    delay.connect(wetGain);
    wetGain.connect(lp);

    if (ctx.createDynamicsCompressor) {
      var comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 3;
      master.connect(comp);
      comp.connect(ctx.destination);
    } else {
      master.connect(ctx.destination);
    }

    buildWind();
    return ctx;
  }

  function buildWind() {
    var len = Math.floor(ctx.sampleRate * 2);
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = buf.getChannelData(0), i, last = 0;
    for (i = 0; i < len; i++) {
      /* brown-ish noise: softer and less hissy than pure white */
      last = (last + (Math.random() * 2 - 1) * 0.12) * 0.985;
      d[i] = last;
    }
    var src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;

    var bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 520;
    bp.Q.value = 0.6;

    windGain = ctx.createGain();
    windGain.gain.value = 0;

    src.connect(bp);
    bp.connect(windGain);
    windGain.connect(master);
    src.start();

    var lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    var lg = ctx.createGain();
    lg.gain.value = 200;
    lfo.connect(lg);
    lg.connect(bp.frequency);
    lfo.start();

    var lfo2 = ctx.createOscillator();
    lfo2.frequency.value = 0.11;
    var lg2 = ctx.createGain();
    lg2.gain.value = 0.5;
    lfo2.connect(lg2);
    lg2.connect(windGain.gain);
    lfo2.start();
  }

  /* ---------------------------------------------------------------- voices */
  function blip(midi, t, dur, wave, g, echo) {
    if (!ctx) return;
    var o = ctx.createOscillator();
    o.type = wave || "triangle";
    o.frequency.value = hz(midi);
    var a = ctx.createGain();
    a.gain.setValueAtTime(0.0001, t);
    a.gain.linearRampToValueAtTime(g, t + 0.03);
    a.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(a);
    a.connect(lp);
    if (echo) a.connect(delay);
    o.start(t);
    o.stop(t + dur + 0.08);
  }

  function pad(midi, t, dur, wave, g) {
    if (!ctx) return;
    var i, det = [-7, 6];
    var a = ctx.createGain();
    a.gain.setValueAtTime(0.0001, t);
    a.gain.linearRampToValueAtTime(g, t + dur * 0.35);
    a.gain.linearRampToValueAtTime(0.0001, t + dur);
    var f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(700, t);
    f.frequency.linearRampToValueAtTime(1500, t + dur * 0.5);
    f.frequency.linearRampToValueAtTime(650, t + dur);
    a.connect(f);
    f.connect(lp);
    for (i = 0; i < det.length; i++) {
      var o = ctx.createOscillator();
      o.type = wave || "sine";
      o.frequency.value = hz(midi);
      o.detune.value = det[i];
      o.connect(a);
      o.start(t);
      o.stop(t + dur + 0.1);
    }
  }

  /* ------------------------------------------------------------- scheduler */
  function schedule(t, spb) {
    var m = cur;
    if (!m) return;
    var barIdx = Math.floor(beat / 8);
    var chord = m.root + m.chords[barIdx % m.chords.length];
    var deg = m.scale;

    /* chord bed every two bars */
    if (beat % 8 === 0) {
      pad(chord, t, spb * 8.6, m.pad, 0.05);
      pad(chord + 7, t, spb * 8.6, m.pad, 0.034);
      pad(chord + 12, t, spb * 8.6, m.pad, 0.022);
      blip(chord - 24, t, spb * 3.4, "sine", 0.085, false);
    }

    /* soft heartbeat bass on the off beats */
    if (beat % 4 === 2) blip(chord - 12, t, spb * 1.5, "sine", 0.045, false);

    /* sparse pentatonic melody — always consonant, never repetitive */
    if (Math.random() < m.density) {
      var n = m.root + 12 + deg[(Math.random() * deg.length) | 0];
      if (Math.random() < 0.28) n += 12;
      blip(n, t + (Math.random() < 0.25 ? spb * 0.5 : 0), spb * 1.35, m.lead, 0.052, true);
    }

    /* twinkling bell accent for the dreamy realms */
    if (m.bells && beat % 16 === 9) {
      blip(m.root + 24 + deg[(Math.random() * deg.length) | 0], t, spb * 2.6, "sine", 0.038, true);
    }
  }

  function tick() {
    if (!running || !cur || !ctx) return;
    if (ctx.state === "suspended") return;
    var spb = 60 / cur.bpm;
    if (nextTime < ctx.currentTime) nextTime = ctx.currentTime + 0.08;
    while (nextTime < ctx.currentTime + LOOKAHEAD) {
      schedule(nextTime, spb);
      nextTime += spb;
      beat++;
    }
  }

  /* ------------------------------------------------------------- transport */
  function fadeMaster(to, secs) {
    if (!ctx || !master) return;
    var now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
    master.gain.linearRampToValueAtTime(to, now + (secs || FADE));
  }

  function applyMood(m) {
    cur = m;
    if (!ctx) return;
    var now = ctx.currentTime;
    lp.frequency.cancelScheduledValues(now);
    lp.frequency.setValueAtTime(lp.frequency.value, now);
    lp.frequency.linearRampToValueAtTime(m.cut, now + FADE);
    if (windGain) {
      windGain.gain.cancelScheduledValues(now);
      windGain.gain.setValueAtTime(windGain.gain.value, now);
      windGain.gain.linearRampToValueAtTime(m.wind * 0.055, now + FADE);
    }
  }

  function startMood(id) {
    var m = MOODS[id] || MOODS.home;
    curId = id;
    if (!want()) { pending = id; return; }
    if (!ensure()) return;
    if (!unlocked) { pending = id; return; }
    if (ctx.state === "suspended") { ctx.resume(); }
    applyMood(m);
    if (!running) {
      running = true;
      beat = 0;
      nextTime = ctx.currentTime + 0.15;
      clearInterval(timer);
      timer = setInterval(tick, TICK_MS);
      tick();
    }
    fadeMaster(0.34 * (m.gain || 1), FADE);
    started = true;
  }

  function stop(fast) {
    pending = null;
    if (!ctx) { running = false; return; }
    fadeMaster(0.0001, fast ? 0.25 : 0.6);
    var wasRunning = running;
    running = false;
    clearInterval(timer);
    timer = 0;
    if (wasRunning) {
      setTimeout(function () {
        if (!running && ctx && ctx.state === "running" && ctx.suspend) {
          try { ctx.suspend(); } catch (e) {}
        }
      }, (fast ? 300 : 700));
    }
  }

  function resolve(name) {
    if (!name) return "home";
    var k = String(name).toLowerCase();
    if (MOODS[k]) return k;
    if (TRACKS[k]) return TRACKS[k];
    var up = String(name).toUpperCase();
    if (MODE_MAP[up]) return MODE_MAP[up];
    return "home";
  }

  function play(name) {
    var id = resolve(name);
    if (id === curId && running && want()) return;
    startMood(id);
  }

  function playMode(mode) { play(resolve(mode)); }

  function setRealm(realm) {
    var id = REALM_MOOD[realm];
    if (id) play(id);
  }

  function apply() {
    if (want()) {
      if (ctx && ctx.state === "suspended" && unlocked) ctx.resume();
      startMood(curId || "home");
    } else {
      stop(true);
    }
  }

  /* ---------------------------------------------------- autoplay unlocking */
  var GESTURES = ["pointerdown", "touchend", "mousedown", "keydown"];
  function onGesture() {
    if (unlocked) return;
    unlocked = true;
    for (var i = 0; i < GESTURES.length; i++) {
      window.removeEventListener(GESTURES[i], onGesture, true);
    }
    if (!ensure()) return;
    if (ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
    if (want()) startMood(pending || curId || "home");
    pending = null;
  }

  function listenForGesture() {
    for (var i = 0; i < GESTURES.length; i++) {
      window.addEventListener(GESTURES[i], onGesture, true);
    }
  }

  function init(name) {
    listenForGesture();
    curId = resolve(name || "home");
    if (want()) pending = curId;
    return BB.Music;
  }

  document.addEventListener("visibilitychange", function () {
    if (!ctx) return;
    if (document.hidden) {
      if (running) fadeMaster(0.0001, 0.35);
    } else if (running && want()) {
      if (ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
      fadeMaster(0.34 * ((cur && cur.gain) || 1), 0.8);
    }
  });

  /* -------------------------------------------------------------------- api */
  BB.Music = {
    __procedural: true,
    init: init,
    play: play,
    playMode: playMode,
    setRealm: setRealm,
    setMood: play,
    apply: apply,
    stop: stop,
    fadeOut: function () { stop(false); },
    moods: Object.keys(MOODS),
    get want() { return want(); },
    get playing() { return !!running; },
    get track() { return curId; },
    get ready() { return !!unlocked; }
  };

  init("home");
})();
