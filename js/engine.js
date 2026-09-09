/* BB.Engine — core gameplay (part 1 of 2: sprites, entities, slingshot render).
   Part 2 lives in js/engine2.js and must be loaded right after this file. */
window.BB = window.BB || {};
var canvas, ctx, width, height, dpr;
var gameMode = "BLITZ", gameState = "HOME";
var score = 0, timeLeft = 60, combo = 1, maxCombo = 1, comboTimer = 0, balloonsPopped = 0;
var lives = 3, wave = 1, currentLevelId = 1, levelProgressCount = 0, feversThisRun = 0, lifeGrace = 0;
var currentPuzzleId = 1, puzzleDarts = 0, puzzleDartsLeft = 0, puzzleTotalBalloons = 0, puzzleActiveBalloons = 0;
var feverCharge = 0, isFever = false, feverTimer = 0, slowMoTimer = 0;
var shakeIntensity = 0, shakeDuration = 0, runCoins = 0;
var mousePos = { x: 0, y: 0 };
var balloons = [], particles = [], textPopups = [], shockwaves = [], lasers = [], powerupDrops = [], needleRays = [];
var currentWeapon = "pistol", weaponTimer = 0, weaponShownSec = -1;
var bossBalloon = null, bossHp = 0, maxBossHp = 0;
var slingshotDarts = [], slingshotArrowsLeft = 5, slingshotTotalPops = 0, slingshotState = { dragging: false, curX: 0, curY: 0 };
var currentSlingshotStage = 1, slingshotTotalBalloons = 0, slingshotActiveBalloons = 0;
function sound() { return BB.Audio.sound; }
function effectsOn() { return BB.Save.data.settings.effects !== false; }

/* ---------- CARTOON BALLOON SPRITES (kids-game style: dark outline, flat bright fill, bold shine, cute faces) ---------- */
var SPRITES = {};
function hexToRgb(h) {
  var v = h.replace("#", "");
  return { r: parseInt(v.substr(0, 2), 16), g: parseInt(v.substr(2, 2), 16), b: parseInt(v.substr(4, 2), 16) };
}
function mixc(hex, target, t) {
  var c = hexToRgb(hex);
  var f = function (a, b) { return Math.round(a + (b - a) * t); };
  return "rgb(" + f(c.r, target[0]) + "," + f(c.g, target[1]) + "," + f(c.b, target[2]) + ")";
}
function getCartoonOutline(colorHex, kind) {
  if (kind === "bomb") return "#161928";
  if (kind === "gift") return "#2e0854";
  if (kind === "freeze") return "#043c4a";
  var c = hexToRgb(colorHex);
  var r = Math.max(10, Math.round(c.r * 0.32));
  var g = Math.max(10, Math.round(c.g * 0.32));
  var b = Math.max(10, Math.round(c.b * 0.32));
  return "rgb(" + r + "," + g + "," + b + ")";
}

function getSprite(key, color, kind, radius) {
  var id = key + "|" + kind + "|" + radius;
  if (SPRITES[id]) return SPRITES[id];
  var SS = 2;
  var S = Math.ceil(radius * 2 * 1.5 + 14);
  var W = Math.ceil(S * SS);
  var cv = document.createElement("canvas"); cv.width = W; cv.height = W;
  var g = cv.getContext("2d"); g.scale(SS, SS);
  var cx = S / 2, cy = S * 0.46, r = radius;

  // 1) Smooth cartoon balloon silhouette
  function body() {
    g.beginPath();
    g.moveTo(cx - r * 0.14, cy + r * 1.05);
    g.bezierCurveTo(cx - r * 0.96, cy + r * 0.82, cx - r * 1.08, cy - r * 0.25, cx - r * 0.98, cy - r * 0.42);
    g.bezierCurveTo(cx - r * 0.86, cy - r * 1.08, cx - r * 0.36, cy - r * 1.24, cx, cy - r * 1.24);
    g.bezierCurveTo(cx + r * 0.36, cy - r * 1.24, cx + r * 0.86, cy - r * 1.08, cx + r * 0.98, cy - r * 0.42);
    g.bezierCurveTo(cx + r * 1.08, cy - r * 0.25, cx + r * 0.96, cy + r * 0.82, cx + r * 0.14, cy + r * 1.05);
    g.closePath();
  }

  var outline = getCartoonOutline(color, kind);

  // 2) Bright vibrant cartoon base fill
  body();
  if (kind === "bomb") {
    var bg = g.createRadialGradient(cx - r * 0.3, cy - r * 0.4, r * 0.1, cx, cy, r * 1.2);
    bg.addColorStop(0, "#3d4257"); bg.addColorStop(0.6, "#222533"); bg.addColorStop(1, "#11131c");
    g.fillStyle = bg;
  } else if (kind === "gift") {
    var gg = g.createRadialGradient(cx - r * 0.3, cy - r * 0.4, r * 0.1, cx, cy, r * 1.2);
    gg.addColorStop(0, "#a855f7"); gg.addColorStop(0.7, "#7e22ce"); gg.addColorStop(1, "#4c1d95");
    g.fillStyle = gg;
  } else if (kind === "freeze") {
    var fg = g.createRadialGradient(cx - r * 0.3, cy - r * 0.4, r * 0.1, cx, cy, r * 1.2);
    fg.addColorStop(0, "#67e8f9"); fg.addColorStop(0.7, "#06b6d4"); fg.addColorStop(1, "#0e7490");
    g.fillStyle = fg;
  } else {
    var cg = g.createLinearGradient(0, cy - r * 1.24, 0, cy + r * 1.05);
    cg.addColorStop(0, mixc(color, [255, 255, 255], 0.22));
    cg.addColorStop(0.5, color);
    cg.addColorStop(1, mixc(color, [10, 10, 20], 0.25));
    g.fillStyle = cg;
  }
  g.fill();

  // 3) ARTWORK DIRECTLY FROM REFERENCE IMAGE:
  if (key === "RED") {
    // RED BALLOON: CUTE WINK FACE 😉
    var ex = r * 0.30, ey = -r * 0.04;
    g.fillStyle = "#ffffff";
    g.beginPath(); g.ellipse(cx - ex, cy + ey, r * 0.26, r * 0.34, -0.06, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#1e1e2f";
    g.beginPath(); g.arc(cx - ex + r * 0.04, cy + ey, r * 0.16, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#ffffff";
    g.beginPath(); g.arc(cx - ex + r * 0.02, cy + ey - r * 0.06, r * 0.065, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.arc(cx - ex + r * 0.08, cy + ey + r * 0.04, r * 0.03, 0, Math.PI * 2); g.fill();

    g.strokeStyle = "#1e1e2f";
    g.lineWidth = Math.max(3.2, r * 0.12);
    g.lineCap = "round";
    g.beginPath();
    g.arc(cx + ex, cy + ey + r * 0.04, r * 0.20, Math.PI * 1.15, Math.PI * 1.85);
    g.stroke();

    g.strokeStyle = "#1e1e2f";
    g.lineWidth = Math.max(2.6, r * 0.09);
    g.beginPath();
    g.arc(cx, cy + r * 0.20, r * 0.22, Math.PI * 0.15, Math.PI * 0.85);
    g.stroke();

    g.fillStyle = "rgba(255, 70, 110, 0.55)";
    g.beginPath(); g.ellipse(cx - ex - r * 0.04, cy + r * 0.26, r * 0.14, r * 0.08, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(cx + ex + r * 0.04, cy + r * 0.26, r * 0.14, r * 0.08, 0, 0, Math.PI * 2); g.fill();
  }
  else if (key === "PINK") {
    // PINK BALLOON: HUGE ADORABLE CARTOON EYES!
    var ex2 = r * 0.30, ey2 = -r * 0.04;
    var er_w = r * 0.26, er_h = r * 0.34;
    [-ex2, ex2].forEach(function(pos) {
      g.fillStyle = "#ffffff";
      g.beginPath(); g.ellipse(cx + pos, cy + ey2, er_w, er_h, pos > 0 ? 0.06 : -0.06, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#1e1e2f";
      g.beginPath(); g.arc(cx + pos + (pos > 0 ? -r * 0.03 : r * 0.03), cy + ey2, r * 0.16, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#ffffff";
      g.beginPath(); g.arc(cx + pos + (pos > 0 ? -r * 0.05 : r * 0.01), cy + ey2 - r * 0.06, r * 0.065, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(cx + pos + (pos > 0 ? -r * 0.01 : r * 0.05), cy + ey2 + r * 0.04, r * 0.032, 0, Math.PI * 2); g.fill();
    });
    g.strokeStyle = "#1e1e2f"; g.lineWidth = Math.max(2.6, r * 0.09); g.lineCap = "round";
    g.beginPath(); g.arc(cx, cy + r * 0.20, r * 0.22, Math.PI * 0.15, Math.PI * 0.85); g.stroke();
    g.fillStyle = "rgba(255, 40, 90, 0.45)";
    g.beginPath(); g.ellipse(cx - ex2 - r * 0.04, cy + r * 0.26, r * 0.14, r * 0.08, 0, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(cx + ex2 + r * 0.04, cy + r * 0.26, r * 0.14, r * 0.08, 0, 0, Math.PI * 2); g.fill();
  }
  else if (key === "GREEN") {
    g.font = "900 " + Math.floor(r * 1.1) + "px Arial Rounded MT Bold, 'Comic Sans MS', sans-serif";
    g.textAlign = "center"; g.textBaseline = "middle";
    g.lineJoin = "round";
    g.strokeStyle = "#2b0d52"; g.lineWidth = Math.max(4, r * 0.18);
    g.strokeText("A", cx, cy + r * 0.04);
    g.fillStyle = "#a855f7";
    g.fillText("A", cx, cy + r * 0.04);
  }
  else if (key === "BLUE") {
    var hw = r * 0.44, hy = cy + r * 0.06;
    g.save();
    g.beginPath();
    g.moveTo(cx, hy + hw * 0.85);
    g.bezierCurveTo(cx - hw * 1.35, hy + hw * 0.15, cx - hw * 1.15, hy - hw * 0.95, cx, hy - hw * 0.45);
    g.bezierCurveTo(cx + hw * 1.15, hy - hw * 0.95, cx + hw * 1.35, hy + hw * 0.15, cx, hy + hw * 0.85);
    g.closePath();
    g.strokeStyle = "#082c44"; g.lineWidth = Math.max(3.5, r * 0.14); g.lineJoin = "round";
    g.stroke();
    g.fillStyle = "#ff9ec4";
    g.fill();
    g.restore();
  }
  else if (kind === "gold") {
    g.font = "900 " + Math.floor(r * 1.1) + "px Arial Rounded MT Bold, 'Comic Sans MS', sans-serif";
    g.textAlign = "center"; g.textBaseline = "middle";
    g.lineJoin = "round";
    g.strokeStyle = "#52082b"; g.lineWidth = Math.max(4, r * 0.18);
    g.strokeText("2", cx, cy + r * 0.04);
    g.fillStyle = "#ff4785";
    g.fillText("2", cx, cy + r * 0.04);
  }
  else if (kind === "bomb") {
    g.fillStyle = "#ff3344";
    g.beginPath(); g.arc(cx, cy + r * 0.08, r * 0.38, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#ffffff";
    g.font = "900 " + Math.floor(r * 0.50) + "px Arial Rounded MT Bold, sans-serif";
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("!", cx, cy + r * 0.10);
  }
  else if (kind === "freeze") {
    g.strokeStyle = "rgba(255, 255, 255, 0.95)";
    g.lineWidth = Math.max(2.5, r * 0.09); g.lineCap = "round";
    var R1 = r * 0.52;
    g.beginPath();
    for (var s1 = 0; s1 < 3; s1++) {
      var ang = s1 * Math.PI / 3 + Math.PI / 6;
      var dx1 = Math.cos(ang) * R1, dy1 = Math.sin(ang) * R1;
      g.moveTo(cx - dx1, cy - dy1); g.lineTo(cx + dx1, cy + dy1);
    }
    g.stroke();
  }
  else if (kind === "gift") {
    var bw = r * 0.60, bh = r * 0.50, byy = cy + r * 0.06;
    g.fillStyle = "rgba(255, 255, 255, 0.95)";
    g.fillRect(cx - bw / 2, byy - bh / 2, bw, bh);
    g.fillStyle = "#f59e0b";
    g.fillRect(cx - r * 0.07, byy - bh / 2, r * 0.14, bh);
    g.fillRect(cx - bw / 2, byy - r * 0.07, bw, r * 0.14);
  }

  // 4) SIGNATURE BOLD WHITE CARTOON SHINE
  g.save();
  body();
  g.clip();
  g.strokeStyle = "rgba(255, 255, 255, 0.92)";
  g.lineWidth = r * 0.22;
  g.lineCap = "round";
  g.beginPath();
  g.arc(cx - r * 0.15, cy - r * 0.12, r * 0.76, Math.PI * 0.84, Math.PI * 1.36);
  g.stroke();
  g.fillStyle = "rgba(255, 255, 255, 0.92)";
  g.beginPath();
  g.arc(cx - r * 0.18, cy - r * 0.88, r * 0.08, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // 5) THICK BOLD CARTOON OUTLINE
  body();
  g.strokeStyle = outline;
  g.lineWidth = Math.max(3.2, r * 0.11);
  g.lineJoin = "round";
  g.stroke();

  // 6) CUTE FLARED CARTOON KNOT
  var knotColor = kind === "bomb" ? "#1e2233" : mixc(color, [10, 10, 20], 0.28);
  g.beginPath();
  g.moveTo(cx - r * 0.14, cy + r * 1.05);
  g.lineTo(cx - r * 0.22, cy + r * 1.28);
  g.quadraticCurveTo(cx, cy + r * 1.34, cx + r * 0.22, cy + r * 1.28);
  g.lineTo(cx + r * 0.14, cy + r * 1.05);
  g.closePath();
  g.fillStyle = knotColor;
  g.fill();
  g.strokeStyle = outline;
  g.lineWidth = Math.max(2.4, r * 0.08);
  g.stroke();

  SPRITES[id] = { cv: cv, half: S / 2, ss: SS };
  return SPRITES[id];
}

function drawSprite(x, y, radius, scale, key, color, kind) {
  var sp = getSprite(key, color, kind, radius);
  ctx.save();
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
  var k = 0.6 + 0.4 * scale;
  ctx.translate(x, y); ctx.scale(k, k);
  var S = sp.cv.width / sp.ss;
  ctx.drawImage(sp.cv, -S / 2, -S / 2 * 0.94, S, S);
  ctx.restore();
}

var dragStart = {};
var lastMovePop = 0;
var inputLockUntil = 0;
function lockInput() { inputLockUntil = Date.now() + 500; }
function isUiTouch(e) {
  try { return !!(e.target && e.target.closest && e.target.closest("button,#mobileHud,#bottomNav,.overlay-view")); }
  catch (err) { return false; }
}

class MobileBalloon {
  getPuzzleAnchor() {
    var stageW = Math.min(width, 420);
    var stageH = Math.min(height, 720);
    var left = (width - stageW) / 2;
    var top = (height - stageH) / 2;
    return { x: left + this.relX * stageW, y: top + this.relY * stageH };
  }
  constructor(y, isPuzzle, specKey, relX, relY, dir) {
    this.isPuzzle = !!isPuzzle;
    this.dir = dir || "RIGHT";
    if (this.isPuzzle) {
      this.spec = BB.Content.SPECS[specKey] || BB.Content.SPECS.RED;
      this.radius = this.spec.r;
      this.relX = relX;
      this.relY = relY;
      var anc = this.getPuzzleAnchor();
      this.anchorX = anc.x;
      this.anchorY = anc.y;
      this.x = this.anchorX;
      this.y = this.anchorY;
      this.drawX = this.x;
      this.speed = 0;
      this.wobble = Math.random() * Math.PI * 2;
      this.popped = false;
      this.spawnScale = 0;
    } else {
      this.reset(y === undefined ? null : y);
      this.spawnScale = 0;
    }
  }
  reset(y) {
    if (this.isPuzzle) return;
    var SPECS = BB.Content.SPECS, r = Math.random(), c = 0, sel = SPECS.RED;
    for (var k in SPECS) { c += SPECS[k].prob; if (r <= c) { sel = SPECS[k]; break; } }
    this.spec = sel; this.radius = sel.r;
    this.x = this.radius + 25 + Math.random() * Math.max(10, width - (this.radius + 25) * 2);
    this.drawX = this.x;
    this.y = (y !== null && y !== undefined) ? y : (height + this.radius + 20 + Math.random() * 80);
    var bonus = (gameMode === "INFINITE") ? (wave - 1) * 0.35 : 0;
    var curLvl = (gameMode === "LEVELS") ? BB.Content.LEVELS[currentLevelId - 1] : null;
    var spdMult = (curLvl && curLvl.speedMult) || 1.0;
    this.speed = (sel.speed + Math.random() * 0.6 + bonus) * spdMult;
    this.wobble = Math.random() * 100; this.popped = false; this.spawnScale = 0;

    this.shield = 0;
    this.isHazard = false;
    if (curLvl && !sel.isBomb && !sel.isGift && !sel.isFreeze) {
      if (curLvl.hasShields && Math.random() < 0.22) {
        this.shield = 1;
      } else if (curLvl.hasHazards && Math.random() < 0.12) {
        this.isHazard = true;
      }
    }
  }
  update(dt, scale) {
    if (this.isPuzzle) {
      if (this.spawnScale < 1) this.spawnScale = Math.min(1, this.spawnScale + dt * 4.5);
      this.wobble += dt * 2.0;
      var anc = this.getPuzzleAnchor();
      this.anchorX = anc.x;
      this.anchorY = anc.y;
      this.drawX = this.anchorX + Math.sin(this.wobble) * 5;
      this.y = this.anchorY + Math.cos(this.wobble * 0.8) * 6;
      return;
    }
    if (this.spawnScale < 1) this.spawnScale = Math.min(1, this.spawnScale + dt * 4);
    var slowZoneY = height * 0.22;
    var inSlow = (slowMoTimer > 0 && this.y > slowZoneY && this.y < height - this.radius);
    this.y -= this.speed * (inSlow ? 0.3 : scale) * 60 * dt;
    this.wobble += dt * 2.5;
    this.drawX = this.x + Math.sin(this.wobble) * 16;
    if (this.y < -this.radius * 2) {
      if (gameState === "PLAYING" && gameMode === "INFINITE" && !this.popped && !this.spec.isBomb && !this.spec.isGift && lifeGrace <= 0) { lifeGrace = 1.2; loseLife(); }
      this.reset(null);
    }
  }
  draw() {
    var x = this.drawX, y = this.y;
    var skin = BB.Economy.skinColors();
    var base = (skin && skin[this.spec.key]) || this.spec.color;
    ctx.save();
    var k = 0.6 + 0.4 * this.spawnScale;
    var r = this.radius * k;

    var sw = Math.sin(this.wobble) * this.radius * 0.22;
    ctx.strokeStyle = "rgba(255,255,255,.45)"; ctx.lineWidth = 1.5; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y + r * 1.15);
    ctx.bezierCurveTo(x + sw * 0.4, y + r * 1.5, x - sw * 0.5, y + r * 1.8, x + sw, y + r * 2.15);
    ctx.stroke();

    drawSprite(x, y, this.radius, this.spawnScale, this.spec.key, base,
      this.spec.isBomb ? "bomb" : this.spec.isGift ? "gift" : this.spec.isGold ? "gold" : this.spec.isFreeze ? "freeze" : "normal");

    if (this.isHazard) {
      ctx.save();
      ctx.strokeStyle = "#ff2a5f";
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "#ff2a5f";
      ctx.shadowBlur = 10;
      var spikes = 8;
      for (var si = 0; si < spikes; si++) {
        var sa = (si / spikes) * Math.PI * 2;
        var sx1 = x + Math.cos(sa) * (r * 0.95);
        var sy1 = y + Math.sin(sa) * (r * 0.95);
        var sx2 = x + Math.cos(sa) * (r * 1.35);
        var sy2 = y + Math.sin(sa) * (r * 1.35);
        ctx.beginPath(); ctx.moveTo(sx1, sy1); ctx.lineTo(sx2, sy2); ctx.stroke();
      }
      ctx.restore();
    }

    if (this.shield > 0) {
      ctx.save();
      ctx.strokeStyle = "#00f5d4";
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "#00f5d4";
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.28, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.8;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      var arcRot = this.wobble * 2;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.28, arcRot, arcRot + Math.PI * 0.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, r * 1.28, arcRot + Math.PI, arcRot + Math.PI * 1.4);
      ctx.stroke();
      ctx.restore();
    }

    if (this.isPuzzle && !this.isSling && this.dir) {
      this.drawArrow(x, y, r);
    }

    if (this.spec.isBomb) {
      ctx.fillStyle = "#d35400";
      ctx.fillRect(x - r * 0.12, y - r * 1.18, r * 0.24, r * 0.08);
      ctx.strokeStyle = "#dcdde1"; ctx.lineWidth = Math.max(1.5, r * 0.08); ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(x, y - r * 1.18);
      ctx.quadraticCurveTo(x + r * 0.16, y - r * 1.34, x + r * 0.26, y - r * 1.28);
      ctx.stroke();
      var sx = x + r * 0.26, sy = y - r * 1.28;
      ctx.fillStyle = "#ff7675";
      ctx.beginPath(); ctx.arc(sx, sy, Math.max(2, r * 0.10), 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffeaa7";
      ctx.beginPath(); ctx.arc(sx, sy, Math.max(1, r * 0.05), 0, Math.PI * 2); ctx.fill();
    }

    ctx.restore();
  }
  drawArrow(x, y, r) {
    var d = this.dir;
    if (!d || d === "ALL" || this.spec.isBomb) return;
    ctx.save();
    ctx.translate(x, y - r * 0.05);

    if (d === "HORIZ") {
      ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(10, 14, 34, 0.95)";
      ctx.lineWidth = Math.max(3.5, r * 0.11);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(-r * 0.44, 0); ctx.lineTo(r * 0.44, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r * 0.52, 0); ctx.lineTo(r * 0.22, -r * 0.22); ctx.lineTo(r * 0.22, r * 0.22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r * 0.52, 0); ctx.lineTo(-r * 0.22, -r * 0.22); ctx.lineTo(-r * 0.22, r * 0.22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#ffd000";
      ctx.beginPath(); ctx.moveTo(r * 0.45, 0); ctx.lineTo(r * 0.24, -r * 0.14); ctx.lineTo(r * 0.24, r * 0.14); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-r * 0.45, 0); ctx.lineTo(-r * 0.24, -r * 0.14); ctx.lineTo(-r * 0.24, r * 0.14); ctx.closePath(); ctx.fill();
      ctx.restore();
      return;
    }
    if (d === "VERT") {
      ctx.rotate(Math.PI / 2);
      ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "rgba(10, 14, 34, 0.95)";
      ctx.lineWidth = Math.max(3.5, r * 0.11);
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(-r * 0.44, 0); ctx.lineTo(r * 0.44, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(r * 0.52, 0); ctx.lineTo(r * 0.22, -r * 0.22); ctx.lineTo(r * 0.22, r * 0.22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-r * 0.52, 0); ctx.lineTo(-r * 0.22, -r * 0.22); ctx.lineTo(-r * 0.22, r * 0.22); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#ffd000";
      ctx.beginPath(); ctx.moveTo(r * 0.45, 0); ctx.lineTo(r * 0.24, -r * 0.14); ctx.lineTo(r * 0.24, r * 0.14); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-r * 0.45, 0); ctx.lineTo(-r * 0.24, -r * 0.14); ctx.lineTo(-r * 0.24, r * 0.14); ctx.closePath(); ctx.fill();
      ctx.restore();
      return;
    }

    var angle = 0;
    if (d === "RIGHT") angle = 0;
    else if (d === "DOWN") angle = Math.PI / 2;
    else if (d === "LEFT") angle = Math.PI;
    else if (d === "UP") angle = -Math.PI / 2;

    ctx.rotate(angle);
    ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "rgba(10, 14, 34, 0.95)";
    ctx.lineWidth = Math.max(3.6, r * 0.12);
    ctx.lineCap = "round"; ctx.lineJoin = "round";

    var aw = r * 0.54, hw = r * 0.34, sw = r * 0.15;
    ctx.beginPath();
    ctx.moveTo(-aw * 0.75, -sw);
    ctx.lineTo(aw * 0.05, -sw);
    ctx.lineTo(aw * 0.05, -hw);
    ctx.lineTo(aw * 0.90, 0);
    ctx.lineTo(aw * 0.05, hw);
    ctx.lineTo(aw * 0.05, sw);
    ctx.lineTo(-aw * 0.75, sw);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.shadowColor = "transparent";
    var ag = ctx.createLinearGradient(-aw * 0.75, 0, aw * 0.90, 0);
    ag.addColorStop(0, "#ffe066");
    ag.addColorStop(1, "#ff9800");
    ctx.fillStyle = ag;
    ctx.beginPath();
    ctx.moveTo(-aw * 0.65, -sw * 0.6);
    ctx.lineTo(aw * 0.02, -sw * 0.6);
    ctx.lineTo(aw * 0.02, -hw * 0.6);
    ctx.lineTo(aw * 0.72, 0);
    ctx.lineTo(aw * 0.02, hw * 0.6);
    ctx.lineTo(aw * 0.02, sw * 0.6);
    ctx.lineTo(-aw * 0.65, sw * 0.6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
  containsPoint(px, py) {
    var hr = this.radius * 1.4 + 15, dx = px - this.drawX, dy = py - this.y;
    return (dx * dx + dy * dy) <= (hr * hr);
  }
}

class BossBalloon {
  constructor(hp) {
    this.radius = 54;
    this.x = width / 2;
    this.y = height * 0.38;
    this.vx = 75;
    this.vy = 40;
    this.hp = hp;
    this.maxHp = hp;
    this.wobble = 0;
    this.popped = false;
  }
  update(dt) {
    this.wobble += dt * 3;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    var pad = this.radius + 20;
    if (this.x < pad) { this.x = pad; this.vx = Math.abs(this.vx); }
    if (this.x > width - pad) { this.x = width - pad; this.vx = -Math.abs(this.vx); }
    if (this.y < height * 0.16 + pad) { this.y = height * 0.16 + pad; this.vy = Math.abs(this.vy); }
    if (this.y > height * 0.65) { this.y = height * 0.65; this.vy = -Math.abs(this.vy); }
  }
  draw() {
    var x = this.x, y = this.y + Math.sin(this.wobble) * 8;
    var r = this.radius;
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 16;

    var bg = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r * 1.2);
    bg.addColorStop(0, "#ff4d6d");
    bg.addColorStop(0.5, "#9333ea");
    bg.addColorStop(1, "#3b0764");
    ctx.fillStyle = bg;
    ctx.strokeStyle = "#ffd000";
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.beginPath();
    ctx.ellipse(x - r * 0.35, y - r * 0.35, r * 0.24, r * 0.12, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(x - r * 0.28, y - r * 0.08, r * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + r * 0.28, y - r * 0.08, r * 0.18, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath(); ctx.arc(x - r * 0.24, y - r * 0.08, r * 0.09, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + r * 0.32, y - r * 0.08, r * 0.09, 0, Math.PI * 2); ctx.fill();

    ctx.font = "34px -apple-system, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("👑", x, y - r * 1.05);

    var barW = 110, barH = 10;
    var pct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = "rgba(0,0,0,0.7)";
    ctx.fillRect(x - barW / 2 - 2, y + r * 1.15 - 2, barW + 4, barH + 4);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x - barW / 2, y + r * 1.15, barW, barH);
    ctx.fillStyle = "#10b981";
    ctx.fillRect(x - barW / 2, y + r * 1.15, barW * pct, barH);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - barW / 2, y + r * 1.15, barW, barH);

    ctx.font = "900 10px -apple-system, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(this.hp + " / " + this.maxHp + " HP", x, y + r * 1.15 + barH / 2 + 1);

    ctx.restore();
  }
  containsPoint(px, py) {
    var dx = px - this.x, dy = py - this.y;
    return (dx * dx + dy * dy) <= ((this.radius + 15) * (this.radius + 15));
  }
}

class MobileParticle {
  constructor(x, y, color, heavy) {
    this.x = x; this.y = y; this.color = color;
    var a = Math.random() * Math.PI * 2;
    var s = (heavy ? 4 : 2.6) + Math.random() * (heavy ? 7 : 4.5);
    this.vx = Math.cos(a) * s; this.vy = Math.sin(a) * s;
    this.shard = Math.random() < 0.38;
    this.size = this.shard ? (3 + Math.random() * 3) : (1.8 + Math.random() * 2.4);
    this.rot = Math.random() * Math.PI; this.vr = (Math.random() - 0.5) * 0.25;
    this.life = 1; this.decay = 0.024 + Math.random() * 0.026;
  }
  update(dt) {
    this.x += this.vx * 60 * dt; this.y += this.vy * 60 * dt;
    this.vy += 0.18 * 60 * dt; this.vx *= (1 - Math.min(1, 0.9 * dt));
    this.life -= this.decay * 60 * dt; this.rot += this.vr;
  }
  draw() {
    var a = this.life;
    a = a * a * (3 - 2 * a);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    if (this.shard) {
      ctx.translate(this.x, this.y); ctx.rotate(this.rot);
      ctx.fillStyle = this.color;
      var s = this.size;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(-s / 2, -s / 2, s, s, s * 0.35); else ctx.rect(-s / 2, -s / 2, s, s);
      ctx.fill();
    } else {
      ctx.fillStyle = this.color;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
}
class MobileTextPopup {
  constructor(t, x, y, c, big) {
    this.text = t; this.x = x; this.y = y;
    this.color = c || "#ffd700"; this.isBig = !!big; this.life = 1;
  }
  update(dt) { this.y -= 40 * dt; this.life -= 1.3 * dt; }
  draw() {
    var a = this.life;
    a = Math.min(1, a * 1.6);
    ctx.save(); ctx.globalAlpha = Math.max(0, a);
    ctx.font = this.isBig ? "900 24px -apple-system,sans-serif" : "bold 18px -apple-system,sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(4,6,14,.85)"; ctx.lineWidth = 4;
    ctx.strokeText(this.text, this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}
class MobileShockwave {
  constructor(x, y, m, color) { this.x = x; this.y = y; this.r = 8; this.maxR = m; this.life = 1; this.color = color || "#ff5e3a"; }
  update(dt) { this.r += (this.maxR - this.r) * 14 * dt; this.life -= 2.4 * dt; }
  draw() {
    var a = this.life * this.life;
    ctx.save(); ctx.globalAlpha = Math.max(0, a);
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = this.color; ctx.lineWidth = 3 * this.life; ctx.stroke();
    ctx.restore();
  }
}
class MobileNeedleRay {
  constructor(x1, y1, x2, y2, color) {
    this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2;
    this.color = color || "#ffffff";
    this.life = 1;
  }
  update(dt) { this.life -= 3.8 * dt; }
  draw() {
    if (this.life <= 0) return;
    ctx.save();
    var a = Math.max(0, this.life);
    ctx.globalAlpha = a;

    ctx.strokeStyle = this.color;
    ctx.lineWidth = Math.max(5 * a, 2);
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = Math.max(2.2 * a, 1);
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(this.x2, this.y2, 5.5 * a, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

class SlingshotProjectile {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 13;
    this.life = 4.2;
    this.trail = [];
    this.pierceCount = 0;
  }
  update(dt) {
    this.life -= dt;
    this.vy += 340 * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.x < this.radius) {
      this.x = this.radius;
      this.vx = -this.vx * 0.78;
      triggerShake(4, 0.1);
      sound().wallBounce();
      burst(this.x, this.y, "#ffd000", 8);
    } else if (this.x > width - this.radius) {
      this.x = width - this.radius;
      this.vx = -this.vx * 0.78;
      triggerShake(4, 0.1);
      sound().wallBounce();
      burst(this.x, this.y, "#ffd000", 8);
    }

    this.trail.push({ x: this.x, y: this.y, a: 1 });
    if (this.trail.length > 14) this.trail.shift();
    for (var i = 0; i < this.trail.length; i++) this.trail[i].a -= dt * 2.5;

    for (var b = balloons.length - 1; b >= 0; b--) {
      var bl = balloons[b];
      if (!bl.popped && bl.containsPoint(this.x, this.y)) {
        this.pierceCount++;
        popBalloon(bl);
        triggerShake(5, 0.12);

        this.vx *= 0.90;
        this.vy *= 0.90;

        var bonusPts = this.pierceCount * 100;
        score += bonusPts;
        if (this.pierceCount === 1) {
          textPopups.push(new MobileTextPopup("HIT! 🏹", this.x, this.y - 20, "#ffd000"));
        } else if (this.pierceCount === 2) {
          textPopups.push(new MobileTextPopup("DOUBLE PIERCE! 🏹 x2", this.x, this.y - 20, "#00f5d4"));
        } else if (this.pierceCount >= 3) {
          textPopups.push(new MobileTextPopup("TRICK SHOT! 🎯 +" + bonusPts, this.x, this.y - 20, "#ffbe0b", true));
          sound().victory();
        }
        updateHud();
        var rem = balloons.filter(function (o) { return !o.popped; }).length;
        slingshotActiveBalloons = rem;
        if (rem === 0) {
          setTimeout(winSlingshotStage, 380);
        }
      }
    }
  }
  draw() {
    ctx.save();
    for (var i = 1; i < this.trail.length; i++) {
      var p1 = this.trail[i - 1], p2 = this.trail[i];
      ctx.strokeStyle = "rgba(0, 245, 212, " + Math.max(0, p2.a * 0.75) + ")";
      ctx.lineWidth = 4.0 * p2.a;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    var angle = Math.atan2(this.vy, this.vx);
    drawFantasyArrow(this.x, this.y, angle, 54, true);
    ctx.restore();
  }
}

function drawFantasyArrow(x, y, angle, length, inFlight) {
  var len = length || 54;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  if (inFlight) {
    ctx.translate(-len * 0.5, 0);
  }

  ctx.fillStyle = "#64748b";
  ctx.beginPath();
  ctx.rect(-3, -2.5, 4, 5);
  ctx.fill();

  ctx.fillStyle = "#2d3748";
  ctx.strokeStyle = "#1a202c";
  ctx.lineWidth = 1.3;
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(4, -9);
  ctx.lineTo(13, -9);
  ctx.lineTo(10, -4.5);
  ctx.lineTo(17, -4.5);
  ctx.lineTo(24, 0);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(4, 9);
  ctx.lineTo(13, 9);
  ctx.lineTo(10, 4.5);
  ctx.lineTo(17, 4.5);
  ctx.lineTo(24, 0);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.strokeStyle = "#422817";
  ctx.lineWidth = 3.6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len - 18, 0);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(3, -0.8);
  ctx.lineTo(len - 18, -0.8);
  ctx.stroke();

  var tipX = len - 18;
  ctx.fillStyle = "#cbd5e1";
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.rect(tipX - 4, -3.5, 5, 7);
  ctx.fill(); ctx.stroke();

  ctx.shadowColor = "#00f5d4";
  ctx.shadowBlur = inFlight ? 14 : 8;

  ctx.fillStyle = "#00f5d4";
  ctx.strokeStyle = "#0891b2";
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.moveTo(tipX, -2);
  ctx.lineTo(tipX + 6, -8);
  ctx.lineTo(tipX + 18, -4);
  ctx.lineTo(tipX + 6, -1);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(tipX, 2);
  ctx.lineTo(tipX + 6, 8);
  ctx.lineTo(tipX + 18, 4);
  ctx.lineTo(tipX + 6, 1);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.moveTo(tipX + 2, 0);
  ctx.lineTo(tipX + 8, -3);
  ctx.lineTo(tipX + 16, 0);
  ctx.lineTo(tipX + 8, 3);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function getSlingshotVectors() {
  var slingX = width / 2;
  var slingY = height - 105;
  var anchorY = slingY + 12;
  var MAX_PULL = 85;

  if (!slingshotState.dragging) {
    return {
      slingX: slingX,
      slingY: slingY,
      anchorY: anchorY,
      pouchX: slingX,
      pouchY: anchorY,
      dist: 0,
      vx: 0,
      vy: 0,
      active: false
    };
  }

  var rawDx = slingshotState.curX - slingX;
  var rawDy = slingshotState.curY - anchorY;

  if (rawDy < 5) rawDy = 5;

  var rawDist = Math.hypot(rawDx, rawDy);
  var clampedDist = Math.min(MAX_PULL, rawDist);
  var pullRatio = rawDist > 0 ? clampedDist / rawDist : 0;

  var pullDx = rawDx * pullRatio;
  var pullDy = rawDy * pullRatio;

  var pouchX = slingX + pullDx;
  var pouchY = anchorY + pullDy;

  var shootDx = -pullDx;
  var shootDy = -pullDy;
  var shootDist = Math.hypot(shootDx, shootDy);

  var powerRatio = clampedDist / MAX_PULL;
  var speed = 400 + powerRatio * 860;

  var vx = shootDist > 0 ? (shootDx / shootDist) * speed : 0;
  var vy = shootDist > 0 ? (shootDy / shootDist) * speed : -speed;

  return {
    slingX: slingX,
    slingY: slingY,
    anchorY: anchorY,
    pouchX: pouchX,
    pouchY: pouchY,
    dist: clampedDist,
    vx: vx,
    vy: vy,
    active: clampedDist > 16
  };
}

function drawSlingshot() {
  if (gameMode !== "SLING") return;
  var s = getSlingshotVectors();
  var slingX = s.slingX;
  var slingY = s.slingY;

  var tension = Math.min(1, s.dist / 85);
  var flexIn = tension * 6;
  var flexBack = tension * 4;

  var leftTipX = slingX - 74 + flexIn, leftTipY = slingY + 10 + flexBack;
  var rightTipX = slingX + 74 - flexIn, rightTipY = slingY + 10 + flexBack;

  ctx.save();

  if (s.active && slingshotArrowsLeft > 0) {
    var simX = slingX, simY = slingY - 30;
    var simVx = s.vx, simVy = s.vy;
    var simDt = 0.032;

    for (var i = 0; i < 20; i++) {
      simVy += 340 * simDt;
      simX += simVx * simDt;
      simY += simVy * simDt;
      if (simX < 14) { simX = 14; simVx = -simVx * 0.78; }
      if (simX > width - 14) { simX = width - 14; simVx = -simVx * 0.78; }

      var dotAlpha = Math.max(0.12, 1 - (i / 20));
      ctx.fillStyle = "rgba(0, 245, 212, " + dotAlpha + ")";
      ctx.shadowColor = "#00f5d4";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(simX, simY, 4.5 * dotAlpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  var pouchX = s.pouchX;
  var pouchY = s.pouchY;

  ctx.save();
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2.4;
  ctx.shadowColor = "#00f5d4";
  ctx.shadowBlur = 10;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(leftTipX, leftTipY);
  ctx.lineTo(pouchX, pouchY);
  ctx.lineTo(rightTipX, rightTipY);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(pouchX, pouchY, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  if (slingshotArrowsLeft > 0) {
    var arrowAngle = s.active
      ? Math.atan2(s.vy, s.vx)
      : -Math.PI / 2;
    drawFantasyArrow(pouchX, pouchY, arrowAngle, 64, false);
  }

  ctx.save();
  var bowTilt = s.active ? (Math.atan2(s.vy, s.vx) + Math.PI / 2) * 0.35 : 0;
  ctx.translate(slingX, slingY);
  ctx.rotate(bowTilt);

  ctx.shadowColor = "rgba(0,0,0,0.65)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  function drawSculptedLimb(isRight) {
    ctx.save();
    if (isRight) ctx.scale(-1, 1);

    ctx.strokeStyle = "#252b39";
    ctx.lineWidth = 7.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(-10, 0);
    ctx.bezierCurveTo(-26, -5, -46, -18, -62, -22);
    ctx.bezierCurveTo(-72, -22, -78, -10, -74 + flexIn, 10 + flexBack);
    ctx.stroke();

    ctx.strokeStyle = "#10141d";
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.fillStyle = "#252b39";
    ctx.strokeStyle = "#10141d";
    ctx.lineWidth = 1.4;

    ctx.beginPath();
    ctx.moveTo(-38, -14);
    ctx.lineTo(-44, -25);
    ctx.lineTo(-49, -17);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-60, -21);
    ctx.lineTo(-67, -32);
    ctx.lineTo(-72, -20);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    ctx.strokeStyle = "#00f5d4";
    ctx.shadowColor = "#00f5d4";
    ctx.shadowBlur = 8;
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.bezierCurveTo(-26, -4, -46, -16, -60, -20);
    ctx.bezierCurveTo(-66, -20, -70, -10, -68 + flexIn, 4 + flexBack);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#b45309";
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 1.2;
    var tipX = -74 + flexIn, tipY = 10 + flexBack;
    ctx.fillRect(tipX - 3, tipY - 4, 7, 9);
    ctx.strokeRect(tipX - 3, tipY - 4, 7, 9);

    ctx.restore();
  }

  drawSculptedLimb(false);
  drawSculptedLimb(true);

  ctx.shadowColor = "#00f5d4";
  ctx.shadowBlur = 9;

  ctx.fillStyle = "#00f5d4";
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 2.2;
  ctx.fillRect(-11, -6, 22, 12);
  ctx.strokeRect(-11, -6, 22, 12);

  ctx.strokeStyle = "#0369a1";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-5, -6); ctx.lineTo(-5, 6);
  ctx.moveTo(0, -6); ctx.lineTo(0, 6);
  ctx.moveTo(5, -6); ctx.lineTo(5, 6);
  ctx.stroke();

  ctx.restore();

  ctx.restore();
}
