/*! Balloon Blitz · Sky Realms — Procedural Sound Design & Audio Effects
 *  100% Royalty-Free & Copyright-Free Procedural Audio Architecture.
 *  Synthesized in real-time via Web Audio API.
 *  See /CREDITS.md for sound design catalog and licensing details.
 */
window.BB = window.BB || {};
BB.Audio = (function () {
  "use strict";

  function MobileAudio() {
    this.ctx = null;
    this.muted = false;
    // Pentatonic scale for harmonic combo scaling
    this.scale = [
      261.63, 293.66, 329.63, 392.00, 440.00, // C4 - A4
      523.25, 587.33, 659.25, 783.99, 880.00, // C5 - A5
      1046.50, 1174.66, 1318.51, 1567.98, 1760.00 // C6 - A6
    ];
    this.lastAimTime = 0;
  }

  MobileAudio.prototype.settings = function () {
    return (BB.Save && BB.Save.data && BB.Save.data.settings) || { sound: true, vibration: true, effects: true };
  };

  MobileAudio.prototype.init = function () {
    if (!this.ctx) {
      var A = window.AudioContext || window.webkitAudioContext;
      if (A) {
        try { this.ctx = new A(); } catch (e) {}
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(function () {});
    }
  };

  MobileAudio.prototype.vibrate = function (p) {
    try {
      if (this.settings().vibration && navigator.vibrate) navigator.vibrate(p);
    } catch (e) {}
  };

  MobileAudio.prototype.toggleMute = function () {
    this.muted = !this.muted;
    return this.muted;
  };

  /* ------------------------------------------------------------- BALLOON POPS */
  MobileAudio.prototype.pop = function (combo, type) {
    combo = combo || 1;
    this.vibrate(16);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime;
      var noteIdx = Math.min(this.scale.length - 1, (combo - 1) % this.scale.length);
      var f = this.scale[noteIdx];

      // Transient pop air impulse (fast click)
      var clickO = this.ctx.createOscillator();
      var clickG = this.ctx.createGain();
      clickO.type = "sine";
      clickO.frequency.setValueAtTime(800, n);
      clickO.frequency.exponentialRampToValueAtTime(140, n + 0.025);
      clickG.gain.setValueAtTime(0.26, n);
      clickG.gain.exponentialRampToValueAtTime(0.001, n + 0.025);
      clickO.connect(clickG);
      clickG.connect(this.ctx.destination);
      clickO.start(n);
      clickO.stop(n + 0.03);

      // Tonal resonant balloon bubble body
      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();

      var tName = String(type || "").toUpperCase();
      if (tName === "BLUE") {
        // Water droplet splash pop
        o.type = "sine";
        o.frequency.setValueAtTime(f * 1.6, n);
        o.frequency.exponentialRampToValueAtTime(f * 0.7, n + 0.12);
        g.gain.setValueAtTime(0.24, n);
        g.gain.exponentialRampToValueAtTime(0.001, n + 0.12);
      } else if (tName === "GREEN") {
        // Snappy wooden acoustic pop
        o.type = "triangle";
        o.frequency.setValueAtTime(f * 1.3, n);
        o.frequency.exponentialRampToValueAtTime(f * 0.4, n + 0.08);
        g.gain.setValueAtTime(0.25, n);
        g.gain.exponentialRampToValueAtTime(0.001, n + 0.08);
      } else if (tName === "PINK") {
        // Double squish pop
        o.type = "sine";
        o.frequency.setValueAtTime(f * 1.8, n);
        o.frequency.exponentialRampToValueAtTime(f * 0.6, n + 0.06);
        g.gain.setValueAtTime(0.22, n);
        g.gain.exponentialRampToValueAtTime(0.001, n + 0.06);

        // Second micro-burst
        var o2 = this.ctx.createOscillator();
        var g2 = this.ctx.createGain();
        o2.type = "triangle";
        o2.frequency.setValueAtTime(f * 1.2, n + 0.025);
        o2.frequency.exponentialRampToValueAtTime(f * 0.5, n + 0.09);
        g2.gain.setValueAtTime(0.18, n + 0.025);
        g2.gain.exponentialRampToValueAtTime(0.001, n + 0.09);
        o2.connect(g2);
        g2.connect(this.ctx.destination);
        o2.start(n + 0.025);
        o2.stop(n + 0.1);
      } else {
        // Classic crisp cheerful pop
        o.type = "sine";
        o.frequency.setValueAtTime(f * 1.4, n);
        o.frequency.exponentialRampToValueAtTime(f * 0.5, n + 0.1);
        g.gain.setValueAtTime(0.25, n);
        g.gain.exponentialRampToValueAtTime(0.001, n + 0.1);
      }

      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(n);
      o.stop(n + 0.14);
    } catch (e) {}
  };

  /* -------------------------------------------------------- SPECIAL BALLOONS */
  MobileAudio.prototype.bomb = function () {
    this.vibrate([50, 40, 90]);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime;

      // 1. Deep cinematic sub-kick drop (150Hz -> 25Hz)
      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(150, n);
      o.frequency.exponentialRampToValueAtTime(25, n + 0.55);
      g.gain.setValueAtTime(0.7, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + 0.55);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(n);
      o.stop(n + 0.6);

      // 2. Distorted mid crunch
      var o2 = this.ctx.createOscillator();
      var g2 = this.ctx.createGain();
      o2.type = "sawtooth";
      o2.frequency.setValueAtTime(110, n);
      o2.frequency.exponentialRampToValueAtTime(30, n + 0.35);
      g2.gain.setValueAtTime(0.4, n);
      g2.gain.exponentialRampToValueAtTime(0.001, n + 0.35);
      o2.connect(g2);
      g2.connect(this.ctx.destination);
      o2.start(n);
      o2.stop(n + 0.4);
    } catch (e) {}
  };

  MobileAudio.prototype.freeze = function () {
    this.vibrate([25, 25, 25]);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime, self = this;
      // Crystalline frost chime cascade
      var notes = [523.25, 783.99, 1046.50, 1567.98, 2093.00];
      notes.forEach(function (f, i) {
        var o = self.ctx.createOscillator();
        var g = self.ctx.createGain();
        var t = n + i * 0.045;
        o.type = "sine";
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        o.connect(g);
        g.connect(self.ctx.destination);
        o.start(t);
        o.stop(t + 0.3);
      });
    } catch (e) {}
  };

  MobileAudio.prototype.gold = function () {
    this.vibrate(20);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime, self = this;
      var notes = [880, 1174.66, 1760, 2349.32];
      notes.forEach(function (f, i) {
        var o = self.ctx.createOscillator();
        var g = self.ctx.createGain();
        var t = n + i * 0.035;
        o.type = "triangle";
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.16, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.connect(g);
        g.connect(self.ctx.destination);
        o.start(t);
        o.stop(t + 0.28);
      });
    } catch (e) {}
  };

  MobileAudio.prototype.powerup = function () {
    this.vibrate([30, 30, 60]);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime, self = this;
      var notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach(function (f, i) {
        var o = self.ctx.createOscillator();
        var g = self.ctx.createGain();
        var t = n + i * 0.05;
        o.type = "triangle";
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.22, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        o.connect(g);
        g.connect(self.ctx.destination);
        o.start(t);
        o.stop(t + 0.35);
      });
    } catch (e) {}
  };

  /* --------------------------------------------------- SLINGSHOT MECHANICS */
  MobileAudio.prototype.slingshotAim = function (tension) {
    if (!this.ctx || this.muted || !this.settings().sound) return;
    var now = performance.now();
    if (now - this.lastAimTime < 70) return;
    this.lastAimTime = now;
    try {
      var n = this.ctx.currentTime;
      var f = 160 + Math.min(1, Math.max(0, tension || 0)) * 280;
      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(f, n);
      o.frequency.linearRampToValueAtTime(f + 25, n + 0.04);
      g.gain.setValueAtTime(0.06, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + 0.04);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(n);
      o.stop(n + 0.05);
    } catch (e) {}
  };

  MobileAudio.prototype.slingshotTwang = function () {
    this.vibrate(25);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime;
      // High snap
      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(540, n);
      o.frequency.exponentialRampToValueAtTime(110, n + 0.16);
      g.gain.setValueAtTime(0.38, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + 0.16);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(n);
      o.stop(n + 0.18);

      // Flight air whoosh
      var o2 = this.ctx.createOscillator();
      var g2 = this.ctx.createGain();
      o2.type = "sine";
      o2.frequency.setValueAtTime(750, n + 0.02);
      o2.frequency.exponentialRampToValueAtTime(320, n + 0.2);
      g2.gain.setValueAtTime(0.15, n + 0.02);
      g2.gain.exponentialRampToValueAtTime(0.001, n + 0.2);
      o2.connect(g2);
      g2.connect(this.ctx.destination);
      o2.start(n + 0.02);
      o2.stop(n + 0.22);
    } catch (e) {}
  };

  MobileAudio.prototype.wallBounce = function () {
    this.vibrate(15);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime;
      var rndPitch = 520 + (Math.random() * 120 - 60);
      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(rndPitch, n);
      o.frequency.exponentialRampToValueAtTime(rndPitch * 0.45, n + 0.075);
      g.gain.setValueAtTime(0.24, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + 0.075);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(n);
      o.stop(n + 0.08);
    } catch (e) {}
  };

  MobileAudio.prototype.laser = function () {
    this.vibrate(20);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime;
      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(1800, n);
      o.frequency.exponentialRampToValueAtTime(280, n + 0.12);
      g.gain.setValueAtTime(0.25, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + 0.12);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(n);
      o.stop(n + 0.14);
    } catch (e) {}
  };

  MobileAudio.prototype.ray = function () {
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime;
      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(950, n);
      o.frequency.exponentialRampToValueAtTime(420, n + 0.1);
      g.gain.setValueAtTime(0.18, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + 0.1);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(n);
      o.stop(n + 0.12);
    } catch (e) {}
  };

  /* ----------------------------------------------------------- BOSS COMBAT */
  MobileAudio.prototype.bossHit = function (remHp, maxHp, isMidBoss) {
    this.vibrate(25);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime;
      // Pitch deepens as boss takes more damage
      var ratio = Math.max(0.2, (remHp || 1) / (maxHp || 10));
      var baseF = isMidBoss ? (220 * ratio + 80) : (180 * ratio + 60);

      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(baseF * 1.5, n);
      o.frequency.exponentialRampToValueAtTime(baseF * 0.5, n + 0.18);
      g.gain.setValueAtTime(0.35, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + 0.18);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(n);
      o.stop(n + 0.2);

      // Metallic spark armor impact
      var o2 = this.ctx.createOscillator();
      var g2 = this.ctx.createGain();
      o2.type = "sine";
      o2.frequency.setValueAtTime(1400, n);
      o2.frequency.exponentialRampToValueAtTime(400, n + 0.08);
      g2.gain.setValueAtTime(0.2, n);
      g2.gain.exponentialRampToValueAtTime(0.001, n + 0.08);
      o2.connect(g2);
      g2.connect(this.ctx.destination);
      o2.start(n);
      o2.stop(n + 0.09);
    } catch (e) {}
  };

  MobileAudio.prototype.bossDefeat = function (isMidBoss) {
    this.vibrate([60, 40, 80, 50, 120]);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      this.bomb();
      var self = this;
      setTimeout(function () { self.bomb(); }, 160);
      setTimeout(function () { self.victory(); }, 380);
    } catch (e) {}
  };

  /* ------------------------------------------------------------- GAMEPLAY */
  MobileAudio.prototype.fever = function () {
    this.vibrate([40, 20, 60]);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime;
      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(220, n);
      o.frequency.exponentialRampToValueAtTime(1320, n + 0.35);
      g.gain.setValueAtTime(0.001, n);
      g.gain.linearRampToValueAtTime(0.32, n + 0.25);
      g.gain.exponentialRampToValueAtTime(0.001, n + 0.4);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(n);
      o.stop(n + 0.45);
    } catch (e) {}
  };

  MobileAudio.prototype.coin = function () {
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime, self = this;
      [987.77, 1318.51].forEach(function (f, i) {
        var o = self.ctx.createOscillator();
        var g = self.ctx.createGain();
        var t = n + i * 0.06;
        o.type = "sine";
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.18, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        o.connect(g);
        g.connect(self.ctx.destination);
        o.start(t);
        o.stop(t + 0.18);
      });
    } catch (e) {}
  };

  MobileAudio.prototype.uiClick = function () {
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime;
      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(620, n);
      o.frequency.exponentialRampToValueAtTime(180, n + 0.035);
      g.gain.setValueAtTime(0.12, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + 0.035);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(n);
      o.stop(n + 0.04);
    } catch (e) {}
  };

  MobileAudio.prototype.star = function (num) {
    this.vibrate(20);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime;
      var f = [523.25, 659.25, 783.99, 1046.50][(num || 1) % 4];
      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(f, n);
      g.gain.setValueAtTime(0.24, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + 0.35);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(n);
      o.stop(n + 0.4);
    } catch (e) {}
  };

  MobileAudio.prototype.lifeLost = function () {
    this.vibrate([60, 40, 100]);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var n = this.ctx.currentTime;
      var o = this.ctx.createOscillator();
      var g = this.ctx.createGain();
      o.type = "sawtooth";
      o.frequency.setValueAtTime(260, n);
      o.frequency.exponentialRampToValueAtTime(65, n + 0.3);
      g.gain.setValueAtTime(0.36, n);
      g.gain.exponentialRampToValueAtTime(0.001, n + 0.3);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(n);
      o.stop(n + 0.32);
    } catch (e) {}
  };

  MobileAudio.prototype.victory = function () {
    this.vibrate([40, 30, 40, 30, 80]);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var self = this;
      var chords = [
        [523.25, 659.25, 783.99], // C major
        [587.33, 739.99, 880.00], // D major
        [659.25, 830.61, 987.77], // E major
        [783.99, 987.77, 1174.66, 1567.98] // G major / octave
      ];
      chords.forEach(function (chord, cIdx) {
        var t = self.ctx.currentTime + cIdx * 0.11;
        chord.forEach(function (f) {
          var o = self.ctx.createOscillator();
          var g = self.ctx.createGain();
          o.type = "triangle";
          o.frequency.setValueAtTime(f, t);
          g.gain.setValueAtTime(0.18 / chord.length, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          o.connect(g);
          g.connect(self.ctx.destination);
          o.start(t);
          o.stop(t + 0.38);
        });
      });
    } catch (e) {}
  };

  MobileAudio.prototype.gameOver = function () {
    this.vibrate([60, 50, 120]);
    if (!this.ctx || this.muted || !this.settings().sound) return;
    try {
      var self = this;
      var notes = [440, 415.30, 392.00, 349.23, 329.63];
      notes.forEach(function (f, i) {
        var t = self.ctx.currentTime + i * 0.12;
        var o = self.ctx.createOscillator();
        var g = self.ctx.createGain();
        o.type = "sawtooth";
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.2, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        o.connect(g);
        g.connect(self.ctx.destination);
        o.start(t);
        o.stop(t + 0.3);
      });
    } catch (e) {}
  };

  var sound = new MobileAudio();
  return { sound: sound };
})();
