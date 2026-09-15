/*! Balloon Blitz · Sky Realms — Procedural Soundtrack Engine (Phase 2 Enhanced)
 *  100% Royalty-Free & Copyright-Free Procedural Audio Architecture.
 *  Synthesized in real-time using browser native Web Audio API.
 *  Zero external binary assets, zero network latency, portal-safe.
 *  See /CREDITS.md for complete track catalog and licensing details.
 */
(function () {
  "use strict";

  var BB = (window.BB = window.BB || {});

  var FADE_SECS = 1.2;
  var LOOKAHEAD = 0.45;
  var TICK_MS = 90;

  function hz(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

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

  /* ------------------------------------------------------------------ TRACKS */
  var TRACK_DEFS = {
    home: {
      id: "home",
      title: "Sky Lounge Groove",
      style: "Lo-Fi Arcade Lounge",
      bpm: 92,
      key: "F Major",
      gain: 0.82,
      // Fmaj7, Dm7, Bbmaj7, C7
      chords: [
        [53, 57, 60, 64], // F3, A3, C4, E4
        [50, 53, 57, 60], // D3, F3, A3, C4
        [46, 50, 53, 57], // Bb2, D3, F3, A3
        [48, 52, 55, 58]  // C3, E3, G3, Bb3
      ],
      bassLine: [
        [41, 0, 45, 48], // F1, -, A1, C2
        [38, 0, 41, 45], // D1, -, F1, A1
        [34, 0, 38, 41], // Bb0, -, D1, F1
        [36, 0, 40, 43]  // C1, -, E1, G1
      ],
      melody: [
        [65, 0, 69, 72, 76, 72, 69, 0],
        [62, 0, 65, 69, 72, 69, 65, 0],
        [58, 0, 62, 65, 70, 65, 62, 0],
        [60, 64, 67, 70, 72, 70, 67, 64]
      ],
      type: "lounge"
    },
    campaign: {
      id: "campaign",
      title: "Balloon Odyssey",
      style: "High-Spirited Arcade Adventure",
      bpm: 114,
      key: "C Major",
      gain: 0.88,
      // C, G, Am, F
      chords: [
        [60, 64, 67], // C4
        [55, 59, 62], // G3
        [57, 60, 64], // Am3
        [53, 57, 60]  // F3
      ],
      bassLine: [
        [36, 48, 36, 48], // C1, C2, C1, C2
        [31, 43, 31, 43], // G0, G1, G0, G1
        [33, 45, 33, 45], // A0, A1, A0, A1
        [29, 41, 29, 41]  // F0, F1, F0, F1
      ],
      melody: [
        [72, 72, 76, 79, 84, 0, 79, 76],
        [74, 74, 77, 79, 83, 0, 79, 77],
        [76, 76, 79, 81, 84, 0, 81, 79],
        [77, 76, 74, 72, 76, 74, 72, 71]
      ],
      type: "adventure"
    },
    blitz: {
      id: "blitz",
      title: "Turbo Rush 132",
      style: "High-Octane Synthwave Rush",
      bpm: 132,
      key: "D Minor",
      gain: 0.95,
      // Dm, Bb, F, C
      chords: [
        [50, 53, 57, 62], // Dm
        [46, 50, 53, 58], // Bb
        [41, 45, 48, 53], // F
        [48, 52, 55, 60]  // C
      ],
      bassLine: [
        [38, 38, 50, 38], // D1, D1, D2, D1 (driving 16th feels)
        [34, 34, 46, 34], // Bb0
        [29, 29, 41, 29], // F0
        [36, 36, 48, 36]  // C1
      ],
      melody: [
        [74, 77, 81, 86, 81, 77, 74, 77],
        [70, 74, 77, 82, 77, 74, 70, 74],
        [69, 72, 77, 81, 77, 72, 69, 72],
        [72, 76, 79, 84, 82, 81, 79, 76]
      ],
      type: "synthwave"
    },
    puzzle: {
      id: "puzzle",
      title: "Zen Meridian",
      style: "Serene Crystalline Ambient",
      bpm: 72,
      key: "Eb Pentatonic",
      gain: 0.80,
      // Eb, Ab, Cm, Bb
      chords: [
        [51, 55, 58, 63], // Eb3
        [44, 48, 51, 56], // Ab2
        [48, 51, 55, 60], // Cm3
        [46, 50, 53, 58]  // Bb2
      ],
      bassLine: [
        [39, 0, 0, 0], // Eb1 sustained drone
        [32, 0, 0, 0], // Ab0
        [36, 0, 0, 0], // C1
        [34, 0, 0, 0]  // Bb0
      ],
      melody: [
        [75, 0, 78, 0, 82, 0, 87, 0],
        [80, 0, 82, 0, 85, 0, 82, 0],
        [75, 0, 78, 0, 82, 0, 78, 0],
        [73, 0, 75, 0, 77, 0, 80, 0]
      ],
      type: "ambient"
    },
    slingshot: {
      id: "slingshot",
      title: "Carnival Trickshot",
      style: "Whimsical Carnival Ragtime",
      bpm: 108,
      key: "G Major",
      gain: 0.86,
      // G, C, D7, G
      chords: [
        [55, 59, 62], // G3
        [60, 64, 67], // C4
        [50, 54, 57, 60], // D7
        [55, 59, 62]  // G3
      ],
      bassLine: [
        [31, 38, 31, 38], // G0, D1 (oom-pah)
        [36, 43, 36, 43], // C1, G1
        [38, 45, 38, 45], // D1, A1
        [31, 38, 31, 38]  // G0, D1
      ],
      melody: [
        [71, 74, 79, 83, 81, 79, 74, 71],
        [72, 76, 79, 84, 83, 81, 76, 72],
        [74, 78, 81, 86, 84, 81, 78, 74],
        [79, 81, 83, 86, 88, 86, 83, 79]
      ],
      type: "carnival"
    },
    survival: {
      id: "survival",
      title: "Cosmic Abyss",
      style: "Deep-Space Tension & Electro Survival",
      bpm: 118,
      key: "F# Minor",
      gain: 0.90,
      // F#m, D, A, E
      chords: [
        [54, 57, 61], // F#m
        [50, 54, 57], // D
        [45, 49, 52], // A
        [40, 44, 47]  // E
      ],
      bassLine: [
        [42, 42, 42, 54], // F#1, F#1, F#1, F#2
        [38, 38, 38, 50], // D1
        [33, 33, 33, 45], // A0
        [28, 28, 28, 40]  // E0
      ],
      melody: [
        [66, 69, 73, 78, 73, 69, 66, 69],
        [62, 66, 69, 74, 69, 66, 62, 66],
        [69, 73, 76, 81, 76, 73, 69, 73],
        [64, 68, 71, 76, 74, 73, 71, 68]
      ],
      type: "tension"
    },
    midboss: {
      id: "midboss",
      title: "Mini Titan Showdown",
      style: "High-Stakes Combat Electro",
      bpm: 126,
      key: "E Minor",
      gain: 0.95,
      // Em, C, Am, B7
      chords: [
        [52, 55, 59], // Em
        [48, 52, 55], // C
        [45, 48, 52], // Am
        [47, 51, 54, 57] // B7
      ],
      bassLine: [
        [40, 40, 52, 40], // E1, E1, E2, E1
        [36, 36, 48, 36], // C1
        [33, 33, 45, 33], // A0
        [35, 35, 47, 35]  // B0
      ],
      melody: [
        [76, 76, 79, 82, 84, 82, 79, 76],
        [72, 72, 76, 79, 81, 79, 76, 72],
        [69, 69, 72, 76, 77, 76, 72, 69],
        [71, 75, 78, 83, 82, 80, 78, 75]
      ],
      type: "combat"
    },
    boss: {
      id: "boss",
      title: "Wrath of King Blimp",
      style: "Thunderous Apex Boss Battle",
      bpm: 138,
      key: "G Minor",
      gain: 1.0,
      // Gm, Eb, Cm, D7
      chords: [
        [55, 58, 62, 67], // Gm
        [51, 55, 58, 63], // Eb
        [48, 51, 55, 60], // Cm
        [50, 54, 57, 62]  // D
      ],
      bassLine: [
        [43, 43, 55, 43], // G1, G1, G2, G1
        [39, 39, 51, 39], // Eb1
        [36, 36, 48, 36], // C1
        [38, 38, 50, 38]  // D1
      ],
      melody: [
        [79, 82, 86, 91, 86, 82, 79, 82],
        [75, 78, 82, 87, 82, 78, 75, 78],
        [72, 75, 79, 84, 79, 75, 72, 75],
        [74, 78, 81, 86, 84, 82, 81, 78]
      ],
      type: "boss"
    },
    shop: {
      id: "shop",
      title: "Boutique Balloon",
      style: "Charming Parisian Boutique Swing",
      bpm: 98,
      key: "Bb Major",
      gain: 0.84,
      // Bb, Gm, Cm, F7
      chords: [
        [58, 62, 65], // Bb
        [55, 58, 62], // Gm
        [48, 51, 55], // Cm
        [53, 57, 60]  // F
      ],
      bassLine: [
        [34, 41, 34, 41], // Bb0, F1
        [31, 38, 31, 38], // G0, D1
        [36, 43, 36, 43], // C1, G1
        [29, 36, 29, 36]  // F0, C1
      ],
      melody: [
        [70, 74, 77, 82, 80, 77, 74, 70],
        [67, 70, 74, 79, 77, 74, 70, 67],
        [60, 63, 67, 72, 70, 67, 63, 60],
        [65, 69, 72, 77, 75, 72, 69, 65]
      ],
      type: "waltz"
    },
    levelselect: {
      id: "levelselect",
      title: "World Atlas Journey",
      style: "Atmospheric Overland Map",
      bpm: 88,
      key: "D Major",
      gain: 0.82,
      // D, G, Bm, A
      chords: [
        [50, 54, 57, 62], // D
        [55, 59, 62, 67], // G
        [47, 50, 54, 59], // Bm
        [45, 49, 52, 57]  // A
      ],
      bassLine: [
        [38, 0, 45, 0],
        [43, 0, 50, 0],
        [35, 0, 42, 0],
        [33, 0, 40, 0]
      ],
      melody: [
        [74, 0, 78, 81, 86, 0, 81, 78],
        [79, 0, 83, 86, 91, 0, 86, 83],
        [71, 0, 74, 78, 83, 0, 78, 74],
        [69, 73, 76, 81, 83, 81, 76, 73]
      ],
      type: "adventure"
    }
  };

  /* Name resolution mapping */
  var TRACK_ALIASES = {
    home: "home", menu: "home", homescreen: "home",
    campaign: "campaign", levels: "campaign", level: "campaign", levelcompletescreen: "campaign",
    blitz: "blitz", rush: "blitz",
    puzzle: "puzzle",
    sling: "slingshot", slingshot: "slingshot",
    infinite: "survival", survival: "survival",
    midboss: "midboss",
    boss: "boss",
    shop: "shop", shopscreen: "shop",
    levelselect: "levelselect", levelselectscreen: "levelselect", map: "levelselect",
    dashboard: "home", dashboardscreen: "home", profile: "home",
    board: "home", boardscreen: "home", ranks: "home",
    gameover: "survival", gameoverscreen: "survival",
    // Realm mappings
    sunny: "campaign", cloud: "puzzle", rainbow: "blitz", moon: "survival", star: "slingshot"
  };

  /* ------------------------------------------------------------ AUDIO GRAPH */
  var ctx = null;
  var masterGain = null;
  var comp = null;
  var masterLp = null;
  var delayNode = null;
  var delayFb = null;
  var delayWet = null;
  var noiseBuffer = null;

  var curTrack = null;
  var curId = "home";
  var pendingId = null;
  var running = false;
  var unlocked = false;
  var timer = null;
  var beat = 0;
  var nextTime = 0;
  var feverActive = false;

  function ensureContext() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch (e) {
      return null;
    }

    masterGain = ctx.createGain();
    masterGain.gain.value = 0;

    masterLp = ctx.createBiquadFilter();
    masterLp.type = "lowpass";
    masterLp.frequency.value = 3500;
    masterLp.Q.value = 0.7;
    masterLp.connect(masterGain);

    /* Spatial stereo delay with subtle feedback */
    delayNode = ctx.createDelay(1.5);
    delayNode.delayTime.value = 0.35;
    delayFb = ctx.createGain();
    delayFb.gain.value = 0.28;
    delayWet = ctx.createGain();
    delayWet.gain.value = 0.22;

    delayNode.connect(delayFb);
    delayFb.connect(delayNode);
    delayNode.connect(delayWet);
    delayWet.connect(masterLp);

    if (ctx.createDynamicsCompressor) {
      comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16;
      comp.knee.value = 24;
      comp.ratio.value = 4;
      comp.attack.value = 0.003;
      comp.release.value = 0.18;
      masterGain.connect(comp);
      comp.connect(ctx.destination);
    } else {
      masterGain.connect(ctx.destination);
    }

    createNoiseBuffer();
    return ctx;
  }

  function createNoiseBuffer() {
    if (!ctx) return;
    var len = Math.floor(ctx.sampleRate * 2.5);
    noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuffer.getChannelData(0);
    var last = 0;
    for (var i = 0; i < len; i++) {
      var white = Math.random() * 2 - 1;
      // Pink / Brown filtered noise
      last = (last + 0.025 * white) / 1.025;
      d[i] = last * 3.5;
    }
  }

  /* ----------------------------------------------------------- INSTRUMENTS */
  function playKick(t, isHeavy) {
    if (!ctx) return;
    try {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      var startF = isHeavy ? 150 : 120;
      var endF = isHeavy ? 32 : 40;
      var dur = isHeavy ? 0.24 : 0.16;

      o.type = "sine";
      o.frequency.setValueAtTime(startF, t);
      o.frequency.exponentialRampToValueAtTime(endF, t + dur);

      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(isHeavy ? 0.45 : 0.35, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0008, t + dur);

      o.connect(g);
      g.connect(masterLp);
      o.start(t);
      o.stop(t + dur + 0.02);
    } catch (e) {}
  }

  function playSnare(t, isGated) {
    if (!ctx || !noiseBuffer) return;
    try {
      var dur = isGated ? 0.18 : 0.12;
      var src = ctx.createBufferSource();
      src.buffer = noiseBuffer;

      var filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = isGated ? 2200 : 1800;
      filter.Q.value = 1.2;

      var g = ctx.createGain();
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.24, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);

      // Body tone
      var o = ctx.createOscillator();
      var og = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(190, t);
      o.frequency.exponentialRampToValueAtTime(90, t + 0.08);
      og.gain.setValueAtTime(0.18, t);
      og.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      src.connect(filter);
      filter.connect(g);
      g.connect(masterLp);

      o.connect(og);
      og.connect(masterLp);

      src.start(t);
      src.stop(t + dur + 0.02);
      o.start(t);
      o.stop(t + 0.09);
    } catch (e) {}
  }

  function playHiHat(t, open) {
    if (!ctx || !noiseBuffer) return;
    try {
      var dur = open ? 0.14 : 0.038;
      var src = ctx.createBufferSource();
      src.buffer = noiseBuffer;

      var hp = ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 7500;

      var g = ctx.createGain();
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(open ? 0.12 : 0.085, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);

      src.connect(hp);
      hp.connect(g);
      g.connect(masterLp);

      src.start(t);
      src.stop(t + dur + 0.02);
    } catch (e) {}
  }

  function playWoodblock(t, hi) {
    if (!ctx) return;
    try {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      var bp = ctx.createBiquadFilter();

      bp.type = "bandpass";
      bp.frequency.value = hi ? 1200 : 840;
      bp.Q.value = 6.0;

      o.type = "sine";
      o.frequency.setValueAtTime(hi ? 1150 : 820, t);
      o.frequency.exponentialRampToValueAtTime(hi ? 600 : 450, t + 0.05);

      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.16, t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      o.connect(bp);
      bp.connect(g);
      g.connect(masterLp);

      o.start(t);
      o.stop(t + 0.06);
    } catch (e) {}
  }

  function playBrush(t) {
    if (!ctx || !noiseBuffer) return;
    try {
      var src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      var bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 3200;
      bp.Q.value = 0.8;

      var g = ctx.createGain();
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      src.connect(bp);
      bp.connect(g);
      g.connect(masterLp);
      src.start(t);
      src.stop(t + 0.1);
    } catch (e) {}
  }

  function playBass(t, midi, dur, wave, isPluck) {
    if (!ctx || !midi) return;
    try {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      var f = ctx.createBiquadFilter();

      var fFreq = isPluck ? 1600 : 850;
      f.type = "lowpass";
      f.frequency.setValueAtTime(fFreq, t);
      f.frequency.exponentialRampToValueAtTime(220, t + (dur * 0.75));

      o.type = wave || "triangle";
      o.frequency.setValueAtTime(hz(midi), t);

      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.24, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);

      o.connect(f);
      f.connect(g);
      g.connect(masterLp);

      o.start(t);
      o.stop(t + dur + 0.05);
    } catch (e) {}
  }

  function playChord(t, notes, dur, wave, filterFreq, echo) {
    if (!ctx || !notes || !notes.length) return;
    try {
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.07 / Math.sqrt(notes.length), t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0008, t + dur);

      var lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.setValueAtTime(filterFreq || 1800, t);
      lp.frequency.linearRampToValueAtTime((filterFreq || 1800) * 0.7, t + dur);

      g.connect(lp);
      lp.connect(masterLp);
      if (echo && delayNode) lp.connect(delayNode);

      for (var i = 0; i < notes.length; i++) {
        var o = ctx.createOscillator();
        o.type = wave || "sine";
        o.frequency.setValueAtTime(hz(notes[i]), t);
        o.detune.value = (i % 2 === 0 ? 3 : -3);
        o.connect(g);
        o.start(t);
        o.stop(t + dur + 0.08);
      }
    } catch (e) {}
  }

  function playMelody(t, midi, dur, wave, filterFreq, echo) {
    if (!ctx || !midi) return;
    try {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      var f = ctx.createBiquadFilter();

      f.type = "lowpass";
      f.frequency.setValueAtTime(filterFreq || 2400, t);

      o.type = wave || "triangle";
      o.frequency.setValueAtTime(hz(midi), t);

      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.09, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);

      o.connect(f);
      f.connect(g);
      g.connect(masterLp);
      if (echo && delayNode) g.connect(delayNode);

      o.start(t);
      o.stop(t + dur + 0.06);
    } catch (e) {}
  }

  function playFeverLayer(t, spb) {
    if (!ctx || !feverActive) return;
    try {
      var scale = [72, 74, 76, 79, 81, 84, 86, 88];
      var note = scale[Math.floor(Math.random() * scale.length)];
      var o = ctx.createOscillator();
      var g = ctx.createGain();

      o.type = "sine";
      o.frequency.setValueAtTime(hz(note), t);

      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(0.06, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, t + spb * 0.7);

      o.connect(g);
      g.connect(masterLp);
      if (delayNode) g.connect(delayNode);

      o.start(t);
      o.stop(t + spb);
    } catch (e) {}
  }

  /* ------------------------------------------------------------- SCHEDULER */
  function scheduleBeat(t, spb, trk) {
    if (!trk) return;
    var beatInBar = beat % 4;
    var barIdx = Math.floor(beat / 4);
    var chordIdx = barIdx % trk.chords.length;
    var currentChord = trk.chords[chordIdx];
    var currentBass = trk.bassLine[chordIdx];
    var currentMelody = trk.melody[chordIdx];

    // 1. DRUMS & PERCUSSION
    switch (trk.type) {
      case "lounge": // Home: soft brush on 2 & 4, gentle kick on 1 and 3-and
        if (beatInBar === 0) playKick(t, false);
        if (beatInBar === 2) {
          playKick(t + spb * 0.5, false);
        }
        if (beatInBar === 1 || beatInBar === 3) playBrush(t);
        playHiHat(t + spb * 0.5, false);
        break;

      case "adventure": // Campaign: punchy kick 1 & 3, snare 2 & 4
        if (beatInBar === 0 || beatInBar === 2) playKick(t, false);
        if (beatInBar === 1 || beatInBar === 3) playSnare(t, false);
        playHiHat(t, false);
        playHiHat(t + spb * 0.5, beatInBar === 3);
        break;

      case "synthwave": // Blitz: 4-on-the-floor kick, tight snare on 2 and 4, running 16ths
        playKick(t, true);
        if (beatInBar === 1 || beatInBar === 3) playSnare(t, true);
        playHiHat(t, false);
        playHiHat(t + spb * 0.25, false);
        playHiHat(t + spb * 0.5, beatInBar === 2);
        playHiHat(t + spb * 0.75, false);
        break;

      case "ambient": // Puzzle: peaceful, no harsh drums! Gentle chime on beat 0
        if (beatInBar === 0 && barIdx % 2 === 0) {
          playWoodblock(t, false);
        }
        break;

      case "carnival": // Slingshot: lively woodblock & bounce
        if (beatInBar === 0) playKick(t, false);
        if (beatInBar === 1 || beatInBar === 3) playWoodblock(t, true);
        if (beatInBar === 2) playWoodblock(t, false);
        playHiHat(t + spb * 0.5, beatInBar === 3);
        break;

      case "tension": // Survival: deep heartbeat kick, rolling hats
        if (beatInBar === 0 || beatInBar === 2) playKick(t, true);
        if (beatInBar === 1 || beatInBar === 3) playSnare(t, false);
        playHiHat(t, false);
        playHiHat(t + spb * 0.5, false);
        break;

      case "combat": // Mid-boss: heavy kicks & gated snares
        playKick(t, true);
        if (beatInBar === 2) playKick(t + spb * 0.5, true);
        if (beatInBar === 1 || beatInBar === 3) playSnare(t, true);
        playHiHat(t + spb * 0.5, true);
        break;

      case "boss": // Apex Boss: driving double-kicks & massive hits
        playKick(t, true);
        if (beatInBar === 1 || beatInBar === 3) {
          playSnare(t, true);
          playKick(t + spb * 0.5, true);
        }
        playHiHat(t, false);
        playHiHat(t + spb * 0.5, true);
        break;

      case "waltz": // Shop: upbeat swing
        if (beatInBar === 0) playKick(t, false);
        if (beatInBar === 1 || beatInBar === 2) playBrush(t);
        playHiHat(t + spb * 0.66, false);
        break;
    }

    // 2. BASS
    if (currentBass) {
      var bassNote = currentBass[beatInBar];
      if (bassNote) {
        var isSlap = (trk.type === "carnival" || trk.type === "waltz");
        var wave = (trk.type === "synthwave" || trk.type === "combat" || trk.type === "boss") ? "sawtooth" : "triangle";
        playBass(t, bassNote, spb * 0.85, wave, isSlap);
        if (trk.type === "synthwave") {
          // 16th-note driving bass pulse
          playBass(t + spb * 0.5, bassNote + 12, spb * 0.4, "sawtooth", true);
        }
      }
    }

    // 3. CHORDS / PADS
    if (currentChord) {
      if (beatInBar === 0) {
        var waveType = (trk.type === "synthwave" || trk.type === "boss") ? "sawtooth" : "sine";
        var filterCut = (trk.type === "ambient") ? 1400 : (trk.type === "boss" ? 2800 : 2000);
        playChord(t, currentChord, spb * 3.8, waveType, filterCut, trk.type === "ambient" || trk.type === "lounge");
      } else if (trk.type === "carnival" || trk.type === "waltz") {
        // Off-beat rhythmic comping chords
        if (beatInBar === 1 || beatInBar === 2 || beatInBar === 3) {
          playChord(t, currentChord, spb * 0.45, "triangle", 1800, false);
        }
      }
    }

    // 4. MELODY
    if (currentMelody) {
      var melIdx1 = beatInBar * 2;
      var melIdx2 = beatInBar * 2 + 1;
      var m1 = currentMelody[melIdx1];
      var m2 = currentMelody[melIdx2];

      var leadWave = (trk.type === "ambient") ? "sine" : (trk.type === "boss" || trk.type === "combat" ? "sawtooth" : "triangle");
      var echoOn = (trk.type === "ambient" || trk.type === "lounge" || trk.type === "adventure");

      if (m1) {
        playMelody(t, m1, spb * 0.42, leadWave, 2600, echoOn);
      }
      if (m2) {
        playMelody(t + spb * 0.5, m2, spb * 0.42, leadWave, 2600, echoOn);
      }
    }

    // 5. FEVER OVER-LAYER
    if (feverActive) {
      playFeverLayer(t, spb * 0.25);
      playFeverLayer(t + spb * 0.25, spb * 0.25);
      playFeverLayer(t + spb * 0.5, spb * 0.25);
      playFeverLayer(t + spb * 0.75, spb * 0.25);
    }
  }

  function tick() {
    if (!running || !curTrack || !ctx) return;
    if (ctx.state === "suspended") return;
    var spb = 60 / curTrack.bpm;
    if (nextTime < ctx.currentTime) nextTime = ctx.currentTime + 0.05;
    while (nextTime < ctx.currentTime + LOOKAHEAD) {
      scheduleBeat(nextTime, spb, curTrack);
      nextTime += spb;
      beat++;
    }
  }

  /* ------------------------------------------------------------- TRANSPORT */
  function fadeMaster(to, secs) {
    if (!ctx || !masterGain) return;
    var now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
    masterGain.gain.linearRampToValueAtTime(Math.max(0.0001, to), now + (secs || FADE_SECS));
  }

  function resolveTrackId(name) {
    if (!name) return "home";
    var clean = String(name).toLowerCase().trim();
    if (TRACK_DEFS[clean]) return clean;
    if (TRACK_ALIASES[clean]) return TRACK_ALIASES[clean];
    return "home";
  }

  function startTrack(id) {
    var resolved = resolveTrackId(id);
    var trk = TRACK_DEFS[resolved] || TRACK_DEFS.home;
    curId = resolved;
    curTrack = trk;

    if (!want()) {
      pendingId = resolved;
      return;
    }
    if (!ensureContext()) return;
    if (!unlocked) {
      pendingId = resolved;
      return;
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(function () {});
    }

    if (masterLp) {
      var now = ctx.currentTime;
      masterLp.frequency.cancelScheduledValues(now);
      masterLp.frequency.setValueAtTime(masterLp.frequency.value, now);
      masterLp.frequency.linearRampToValueAtTime(trk.type === "ambient" ? 2200 : 3800, now + 0.5);
    }

    if (!running) {
      running = true;
      beat = 0;
      nextTime = ctx.currentTime + 0.1;
      clearInterval(timer);
      timer = setInterval(tick, TICK_MS);
      tick();
    }

    fadeMaster(0.38 * (trk.gain || 1), FADE_SECS);
  }

  function stop(fast) {
    pendingId = null;
    if (!ctx) {
      running = false;
      return;
    }
    fadeMaster(0.0001, fast ? 0.2 : 0.6);
    var wasRunning = running;
    running = false;
    clearInterval(timer);
    timer = null;
    if (wasRunning) {
      setTimeout(function () {
        if (!running && ctx && ctx.state === "running" && ctx.suspend) {
          try {
            ctx.suspend();
          } catch (e) {}
        }
      }, fast ? 250 : 700);
    }
  }

  function play(name) {
    var resolved = resolveTrackId(name);
    if (resolved === curId && running && want()) return;
    startTrack(resolved);
  }

  function playMode(mode) {
    play(mode);
  }

  function setRealm(realm) {
    var m = TRACK_ALIASES[String(realm).toLowerCase()];
    if (m) play(m);
  }

  function setFever(active) {
    feverActive = !!active;
  }

  function apply() {
    if (want()) {
      if (ctx && ctx.state === "suspended" && unlocked) {
        ctx.resume().catch(function () {});
      }
      startTrack(curId || "home");
    } else {
      stop(true);
    }
  }

  /* ---------------------------------------------------- AUTOPLAY UNLOCKING */
  var GESTURES = ["pointerdown", "touchend", "mousedown", "keydown"];
  function onGesture() {
    if (unlocked) return;
    unlocked = true;
    for (var i = 0; i < GESTURES.length; i++) {
      window.removeEventListener(GESTURES[i], onGesture, true);
    }
    if (!ensureContext()) return;
    if (ctx.state === "suspended") {
      ctx.resume().catch(function () {});
    }
    if (want()) {
      startTrack(pendingId || curId || "home");
    }
    pendingId = null;
  }

  function listenForGesture() {
    for (var i = 0; i < GESTURES.length; i++) {
      window.addEventListener(GESTURES[i], onGesture, true);
    }
  }

  function init(name) {
    listenForGesture();
    curId = resolveTrackId(name || "home");
    if (want()) pendingId = curId;
    return BB.Music;
  }

  document.addEventListener("visibilitychange", function () {
    if (!ctx) return;
    if (document.hidden) {
      if (running) fadeMaster(0.0001, 0.3);
    } else if (running && want()) {
      if (ctx.state === "suspended") {
        ctx.resume().catch(function () {});
      }
      fadeMaster(0.38 * ((curTrack && curTrack.gain) || 1), 0.7);
    }
  });

  function getTrackInfo(trackId) {
    var t = TRACK_DEFS[resolveTrackId(trackId || curId)] || TRACK_DEFS.home;
    return {
      id: t.id,
      title: t.title,
      style: t.style,
      bpm: t.bpm,
      key: t.key,
      creator: "Balloon Blitz Soundworks",
      license: "Creative Commons Zero (CC0 1.0) / Public Domain"
    };
  }

  function getTracks() {
    var list = [];
    Object.keys(TRACK_DEFS).forEach(function (k) {
      var t = TRACK_DEFS[k];
      list.push({
        id: t.id,
        title: t.title,
        style: t.style,
        bpm: t.bpm,
        key: t.key,
        creator: "Balloon Blitz Soundworks",
        license: "CC0 1.0 (Public Domain)"
      });
    });
    return list;
  }

  /* -------------------------------------------------------------------- API */
  BB.Music = {
    __procedural: true,
    init: init,
    play: play,
    playMode: playMode,
    setRealm: setRealm,
    setMood: play,
    setFever: setFever,
    apply: apply,
    stop: stop,
    fadeOut: function () { stop(false); },
    getTrackInfo: getTrackInfo,
    getTracks: getTracks,
    moods: Object.keys(TRACK_DEFS),
    get want() { return want(); },
    get playing() { return !!running; },
    get track() { return curId; },
    get ready() { return !!unlocked; }
  };

  init("home");
})();
