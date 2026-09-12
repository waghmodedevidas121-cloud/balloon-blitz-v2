/* BB.Engine — part 2 of 2: powerups, modes, scoring, HUD, input, main loop.
   Requires js/engine.js to be loaded first. */
function sfxPowerup() {
  var s = sound(); if (!s.ctx || s.muted || !s.settings().sound) return;
  try {
    var now = s.ctx.currentTime;
    [330, 440, 660, 880].forEach(function (freq, idx) {
      var o = s.ctx.createOscillator(), g = s.ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(freq, now + idx * 0.06);
      g.gain.setValueAtTime(0.2, now + idx * 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
      o.connect(g); g.connect(s.ctx.destination);
      o.start(now + idx * 0.06); o.stop(now + idx * 0.06 + 0.18);
    });
  } catch (e) {}
}
class PowerupDrop {
  constructor(x, y, forceId) {
    this.x = x; this.y = y; this.vy = 0.6; this.life = 8; this.radius = 22;
    var pool = (gameMode === "INFINITE") ? ["gatling", "shotgun", "laser", "life"] : ["gatling", "shotgun", "laser", "time"];
    var id = forceId || pool[Math.floor(Math.random() * pool.length)];
    this.type = BB.Content.POWERUPS.filter(function (p) { return p.id === id; })[0];
  }
  update(dt) { this.vy += 2.2 * dt; this.y += this.vy * 60 * dt; this.life -= dt; }
  draw() {
    ctx.save(); ctx.translate(this.x, this.y);
    ctx.beginPath(); ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(18,24,52,.92)";
    ctx.shadowColor = this.type.color; ctx.shadowBlur = 16; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = this.type.color; ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.font = "16px sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(this.type.icon, 0, 1); ctx.restore();
  }
  containsPoint(px, py) { return Math.hypot(px - this.x, py - this.y) <= this.radius + 16; }
}
class LaserBeam {
  constructor(x) { this.x = x; this.life = 0.25; }
  update(dt) { this.life -= dt; }
  draw() {
    ctx.save(); ctx.globalAlpha = Math.max(0, this.life / 0.25);
    ctx.strokeStyle = "#00f5d4"; ctx.lineWidth = 14;
    ctx.shadowColor = "#00f5d4"; ctx.shadowBlur = 24;
    ctx.beginPath(); ctx.moveTo(this.x, height); ctx.lineTo(this.x, 0); ctx.stroke();
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 4; ctx.stroke(); ctx.restore();
  }
}
function grantAbility(b) {
  var pool = (gameMode === "INFINITE") ? ["gatling", "shotgun", "laser", "life"] : ["gatling", "shotgun", "laser", "time"];
  var id = pool[Math.floor(Math.random() * pool.length)];
  var bx = b.drawX, by = b.y;
  sound().pop(combo);
  burst(bx, by, "#c26bff", 16); burst(bx, by, "#ffd700", 8); spawnRipple(bx, by, "gold"); addFever(6); earnCoins(3);
  powerupDrops.push(new PowerupDrop(bx, by, id));
  textPopups.push(new MobileTextPopup("CATCH IT! 🎁", bx, by - 24, "#ffd23f", true));
  combo++;
  if (combo > maxCombo) maxCombo = combo;
  if (combo > BB.Save.data.maxCombo) BB.Save.data.maxCombo = combo;
  comboTimer = 2.4; updateHud();
}
function collectDrop(d) {
  if (d.type.id === "time") {
    timeLeft += 10; sfxPowerup();
    textPopups.push(new MobileTextPopup("+10s ⏱️", d.x, d.y - 20, "#33ff77", true));
  } else if (d.type.id === "life") {
    lives = Math.min(3, lives + 1); sfxPowerup();
    textPopups.push(new MobileTextPopup("+1 LIFE ❤️", d.x, d.y - 20, "#ff5e7a", true));
  } else activateWeapon(d.type.id, d.x, d.y);
  updateHud();
}
function activateWeapon(id, x, y) {
  var p = BB.Content.POWERUPS.filter(function (q) { return q.id === id; })[0];
  if (!p) return;
  currentWeapon = id; weaponTimer = 10; weaponShownSec = -1;
  sfxPowerup();
  textPopups.push(new MobileTextPopup(p.name.toUpperCase() + "! " + p.icon, x, y - 24, p.color, true));
  updateWeaponBadge();
}
function resetWeapon() { currentWeapon = "pistol"; weaponTimer = 0; weaponShownSec = -1; updateWeaponBadge(); }
function weaponHint() {
  if (gameMode === "BLITZ") return isFever ? ("🔥 FEVER x2 — " + Math.ceil(feverTimer) + "s") : "👆 Tap or Drag to Pop!";
  if (gameMode === "INFINITE") return "🌊 Wave " + wave + " • Speed rising";
  return "🎯 Clear the objective!";
}
function updateWeaponBadge() {
  var w = document.getElementById("mWName"), ic = document.getElementById("mWIcon");
  if (!w || !ic) return;
  if (currentWeapon !== "pistol" && weaponTimer > 0) {
    var p = BB.Content.POWERUPS.filter(function (q) { return q.id === currentWeapon; })[0];
    ic.textContent = p.icon; w.textContent = p.name + " (" + Math.ceil(weaponTimer) + "s)";
  } else { ic.textContent = "👆"; w.textContent = weaponHint(); }
}
function burst(x, y, color, n, heavy) {
  if (!effectsOn()) n = Math.min(n, 8);
  for (var i = 0; i < n; i++) {
    if (particles.length > 320) particles.shift();
    particles.push(new MobileParticle(x, y, color, heavy));
  }
}
function triggerShake(i, du) {
  if (!effectsOn()) return;
  shakeIntensity = Math.max(shakeIntensity, i); shakeDuration = Math.max(shakeDuration, du);
}
function spawnRipple(x, y, cls) { if (BB.UI) BB.UI.ripple(x, y, cls); }
function initBalloons() {
  balloons.length = 0;
  var c = Math.min(22, Math.max(14, Math.floor(width / 50)));
  for (var i = 0; i < c; i++) balloons.push(new MobileBalloon(Math.random() * (height + 100)));
}
function resetRun() {
  score = 0; combo = 1; maxCombo = 1; comboTimer = 0; balloonsPopped = 0;
  feverCharge = 0; isFever = false; feverTimer = 0; slowMoTimer = 0;
  feversThisRun = 0; runCoins = 0; lifeGrace = 0;
  bossBalloon = null; bossHp = 0; maxBossHp = 0;
  currentWeapon = "pistol"; weaponTimer = 0; weaponShownSec = -1;
  powerupDrops.length = 0; lasers.length = 0; shakeDuration = 0; needleRays.length = 0;
  document.body.classList.remove("fever-active");
  document.getElementById("mFeverBar").style.width = "0%";
  document.getElementById("mFeverPct").innerText = "0%";
}
function startBlitz() {
  sound().init(); BB.Music.playMode("BLITZ");
  BB.Ads.notifyRunStart(); lockInput();
  gameMode = "BLITZ"; gameState = "PLAYING"; resetRun(); timeLeft = 60;
  BB.Save.data.gamesPlayed = (BB.Save.data.gamesPlayed || 0) + 1; BB.Save.save();
  initBalloons(); updateHud(); BB.UI.show(null);
  BB.UI.announce("⚡ BLITZ!", "60 seconds — go!", "#ffd23f");
}
function initSlingshotStage(id) {
  balloons.length = 0;
  slingshotDarts.length = 0;
  var stg = (BB.Content.SLING_STAGES && BB.Content.SLING_STAGES[id - 1]) || BB.Content.SLING_STAGES[0];
  slingshotArrowsLeft = stg.arrows;
  stg.balloons.forEach(function (b) {
    var nb = new MobileBalloon(null, true, b.key, b.x, b.y);
    nb.isSling = true;
    balloons.push(nb);
  });
  slingshotTotalBalloons = balloons.length;
  slingshotActiveBalloons = balloons.length;
}
function startSlingshot(stageId) {
  sound().init();
  try { BB.Music.play("blitz"); } catch (e) {}
  BB.Ads.notifyRunStart(); lockInput();
  currentSlingshotStage = stageId || 1;
  gameMode = "SLING"; gameState = "PLAYING"; resetRun();
  initSlingshotStage(currentSlingshotStage);
  slingshotState.dragging = false;
  BB.Save.data.gamesPlayed = (BB.Save.data.gamesPlayed || 0) + 1; BB.Save.save();
  updateHud(); BB.UI.show(null);
  var stg = BB.Content.SLING_STAGES[currentSlingshotStage - 1];
  BB.UI.announce("🏹 STAGE " + currentSlingshotStage + ": " + stg.name.toUpperCase(), stg.desc, "#f97316");
}
function startInfinite() {
  sound().init(); BB.Music.playMode("survival");
  BB.Ads.notifyRunStart(); lockInput();
  gameMode = "INFINITE"; gameState = "PLAYING"; resetRun(); lives = 3; wave = 1;
  BB.Save.data.gamesPlayed = (BB.Save.data.gamesPlayed || 0) + 1; BB.Save.save();
  initBalloons(); updateHud(); BB.UI.show(null);
  BB.UI.announce("♾️ SURVIVE!", "Protect 3 lives", "#a29bfe");
}
function startLevel(id) {
  sound().init(); BB.Music.playMode("LEVELS");
  BB.Ads.notifyRunStart(); lockInput(); currentLevelId = id;
  var l = BB.Content.LEVELS[id - 1] || BB.Content.LEVELS[0];
  gameMode = "LEVELS"; gameState = "PLAYING"; resetRun();
  timeLeft = l.time; levelProgressCount = 0;
  if (l.isBoss) {
    bossHp = l.target;
    maxBossHp = l.target;
    bossBalloon = new BossBalloon(bossHp);
  }
  BB.Save.data.gamesPlayed = (BB.Save.data.gamesPlayed || 0) + 1; BB.Save.save();
  initBalloons(); updateHud(); BB.UI.show(null);
  BB.UI.announce(l.isBoss ? "👑 BOSS STAGE " + id : "STAGE " + id, l.desc.toUpperCase(), l.isBoss ? "#ffd000" : "#00f5d4");
}
function initPuzzle(id) {
  balloons.length = 0;
  needleRays.length = 0;
  var pz = (BB.Content.PUZZLES && BB.Content.PUZZLES[id - 1]) || BB.Content.PUZZLES[0];
  puzzleDarts = pz.darts;
  puzzleDartsLeft = pz.darts;
  pz.balloons.forEach(function (b) {
    balloons.push(new MobileBalloon(null, true, b.key, b.x, b.y, b.dir));
  });
  puzzleTotalBalloons = balloons.length;
  puzzleActiveBalloons = balloons.length;
}
function startPuzzle(id) {
  sound().init();
  try { BB.Music.play("campaign"); } catch (e) {}
  BB.Ads.notifyRunStart(); lockInput(); currentPuzzleId = id;
  gameMode = "PUZZLE"; gameState = "PLAYING"; resetRun();
  BB.Save.data.gamesPlayed = (BB.Save.data.gamesPlayed || 0) + 1; BB.Save.save();
  initPuzzle(id); updateHud(); BB.UI.show(null);
  var pz = BB.Content.PUZZLES[id - 1];
  BB.UI.announce("🧩 PUZZLE " + id + ": " + pz.name.toUpperCase(), pz.desc, "#00f5d4");
}
function loseLife() {
  if (gameState !== "PLAYING" || gameMode !== "INFINITE") return;
  lives = Math.max(0, lives - 1);
  sound().lifeLost(); triggerShake(10, 0.3); BB.UI.flash(0.18);
  textPopups.push(new MobileTextPopup("LIFE LOST! 💔", width / 2, height / 2, "#ff3366", true));
  BB.UI.announce("💔 LIFE LOST", lives > 0 ? lives + " left" : "", "#ff5e7a");
  updateHud(); if (lives <= 0) endGame();
}
function addFever(amt) {
  if (isFever) return;
  feverCharge = Math.min(100, feverCharge + amt);
  document.getElementById("mFeverBar").style.width = feverCharge + "%";
  document.getElementById("mFeverPct").innerText = Math.floor(feverCharge) + "%";
  if (feverCharge >= 100) {
    isFever = true; feverTimer = 7.0; feversThisRun++;
    BB.Save.data.fevers = (BB.Save.data.fevers || 0) + 1;
    document.body.classList.add("fever-active");
    sound().victory(); BB.UI.flash(0.4); triggerShake(8, 0.35);
    document.getElementById("mFeverLabel").innerText = "🔥 FEVER x2!";
    BB.UI.announce("🔥 FEVER MODE!", "2X SCORE — 7s", "#ffd700");
    textPopups.push(new MobileTextPopup("FEVER MODE!! 🔥", width / 2, height / 2, "#ffd700", true));
    BB.Rewards.track("fever", 1); BB.Save.save();
    if (gameMode === "LEVELS" && BB.Content.LEVELS[currentLevelId - 1].type === "fever") {
      levelProgressCount++; checkLevelWin();
    }
    var fresh = BB.Achievements.check();
    if (fresh.length) BB.UI.announce("🏆 " + fresh[0].name.toUpperCase(), "Achievement unlocked", "#ffd23f");
  }
}
function endFever() {
  isFever = false; feverCharge = 0;
  document.body.classList.remove("fever-active");
  document.getElementById("mFeverBar").style.width = "0%";
  document.getElementById("mFeverPct").innerText = "0%";
  document.getElementById("mFeverLabel").innerText = "🔥 FEVER";
}
function earnCoins(n) { runCoins += n; BB.Economy.addCoins(n); }
function findTargetInRay(sourceB, dx, dy) {
  var best = null, bestDist = Infinity;
  var corridor = sourceB.radius * 1.5;

  balloons.forEach(function (o) {
    if (o.popped || o === sourceB) return;
    var vx = o.drawX - sourceB.drawX;
    var vy = o.y - sourceB.y;
    var proj = vx * dx + vy * dy;
    if (proj <= 12) return;

    var perp = Math.abs(vx * (-dy) + vy * dx);
    if (perp <= corridor) {
      if (proj < bestDist) {
        bestDist = proj;
        best = o;
      }
    }
  });

  return { target: best, dist: bestDist };
}
function fireDirectionalRay(sourceB, dx, dy, rayColor, depth) {
  var res = findTargetInRay(sourceB, dx, dy);
  if (res.target) {
    var tb = res.target;
    needleRays.push(new MobileNeedleRay(sourceB.drawX, sourceB.y, tb.drawX, tb.y, rayColor));
    setTimeout(function () {
      if (!tb.popped && (gameState === "PLAYING" || gameState === "LEVEL_COMPLETE")) {
        popBalloon(tb, true, depth + 1);
      }
    }, 140);
  } else {
    var reach = Math.max(width, height) * 0.95;
    var endX = sourceB.drawX + dx * reach;
    var endY = sourceB.y + dy * reach;
    needleRays.push(new MobileNeedleRay(sourceB.drawX, sourceB.y, endX, endY, rayColor));
  }
}
function chainPop(sourceB, targetB, delay, rayColor, depth) {
  setTimeout(function () {
    if (targetB && !targetB.popped && (gameState === "PLAYING" || gameState === "LEVEL_COMPLETE")) {
      needleRays.push(new MobileNeedleRay(sourceB.drawX, sourceB.y, targetB.drawX, targetB.y, rayColor || "#ffffff"));
      popBalloon(targetB, true, (depth || 0) + 1);
    }
  }, delay);
}
function popBalloon(b, isChain, chainDepth) {
  if (b.popped) return;
  b.popped = true; balloonsPopped++;
  BB.Save.data.totalPops++;
  BB.Rewards.track("pop", 1);
  var bx = b.drawX, by = b.y;
  var depth = chainDepth || 1;
  addFever(b.spec.points ? b.spec.points * 0.16 : 7);

  if (gameMode === "PUZZLE") {
    var d = b.dir || "RIGHT";
    var rColor = (b.spec && b.spec.color) || "#ffffff";
    sound().pop(Math.min(10, depth));
    burst(bx, by, rColor, 14);
    spawnRipple(bx, by, "");
    earnCoins(1);
    textPopups.push(new MobileTextPopup(isChain ? "CHAIN x" + depth + "!" : "POP!", bx, by - 15, rColor));

    if (b.spec.isBomb || d === "ALL") {
      sound().bomb();
      BB.Save.data.bombsPopped = (BB.Save.data.bombsPopped || 0) + 1;
      triggerShake(12, 0.35); BB.UI.flash(0.2);
      shockwaves.push(new MobileShockwave(bx, by, 180, "#ff5e3a"));
      var allDirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      allDirs.forEach(function (pair) {
        fireDirectionalRay(b, pair[0], pair[1], "#ff5e3a", depth);
      });
    } else if (d === "HORIZ") {
      fireDirectionalRay(b, -1, 0, rColor, depth);
      fireDirectionalRay(b, 1, 0, rColor, depth);
    } else if (d === "VERT") {
      fireDirectionalRay(b, 0, -1, rColor, depth);
      fireDirectionalRay(b, 0, 1, rColor, depth);
    } else if (d === "RIGHT") {
      fireDirectionalRay(b, 1, 0, rColor, depth);
    } else if (d === "LEFT") {
      fireDirectionalRay(b, -1, 0, rColor, depth);
    } else if (d === "UP") {
      fireDirectionalRay(b, 0, -1, rColor, depth);
    } else if (d === "DOWN") {
      fireDirectionalRay(b, 0, 1, rColor, depth);
    }

    var unp = balloons.filter(function (o) { return !o.popped; }).length;
    puzzleActiveBalloons = unp;
    updateHud();
    setTimeout(checkPuzzleStatus, 450);
    return;
  }
  if (b.spec.isBomb) {
    sound().bomb(); BB.Save.data.bombsPopped = (BB.Save.data.bombsPopped || 0) + 1;
    triggerShake(14, 0.4); BB.UI.flash(0.25);
    shockwaves.push(new MobileShockwave(bx, by, 220, "#ff5e3a"));
    burst(bx, by, "#ff5e3a", 18, true); burst(bx, by, "#ffd23f", 10, true); textPopups.push(new MobileTextPopup("BOOM! 💥", bx, by - 20, "#ff4444", true));
    spawnRipple(bx, by, "bomb"); earnCoins(2);
    balloons.forEach(function (o) {
      if (!o.popped && o !== b && Math.hypot(o.drawX - bx, o.y - by) < 180) {
        setTimeout(function () { popBalloon(o); }, 60);
      }
    });
    if (gameMode === "LEVELS" && BB.Content.LEVELS[currentLevelId - 1].type === "bomb") {
      levelProgressCount++; checkLevelWin();
    }
  } else if (b.spec.isFreeze) {
    sound().freeze(); slowMoTimer = 4.5;
    burst(bx, by, "#7df9ff", 14); burst(bx, by, "#ffffff", 6); shockwaves.push(new MobileShockwave(bx, by, 72, "#7df9ff")); textPopups.push(new MobileTextPopup("SLOW-MO! ❄️", bx, by - 20, "#7df9ff", true));
    spawnRipple(bx, by, "freeze"); earnCoins(2);
    if (gameMode === "LEVELS" && BB.Content.LEVELS[currentLevelId - 1].type === "freeze") {
      levelProgressCount++; checkLevelWin();
    }
  } else if (b.spec.isGift) { grantAbility(b);
  } else {
    sound().pop(combo);
    if (b.spec.isGold) {
      burst(bx, by, "#ffd23f", 16, true); burst(bx, by, "#fff6c9", 8); shockwaves.push(new MobileShockwave(bx, by, 64, "#ffd23f")); triggerShake(5, 0.18); spawnRipple(bx, by, "gold"); earnCoins(5);
    } else { burst(bx, by, (BB.Economy.skinColors() || {})[b.spec.key] || b.spec.color, 12); spawnRipple(bx, by, ""); earnCoins(1); }
    var pts = (b.spec.points || 10) * combo * (isFever ? 2 : 1);
    score += pts; combo++;
    if (combo > maxCombo) maxCombo = combo;
    if (combo > BB.Save.data.maxCombo) BB.Save.data.maxCombo = combo;
    comboTimer = 2.4;
    textPopups.push(new MobileTextPopup("+" + pts, bx, by - 15, b.spec.isGold ? "#ffd700" : "#ffffff"));
    if (combo === 8 || combo === 12 || combo === 20) BB.UI.announce("⚡ COMBO x" + combo, "Keep popping!", "#00f5d4");
    if (gameMode === "LEVELS") {
      var cur = BB.Content.LEVELS[currentLevelId - 1];
      if (!cur.type) levelProgressCount++;
      else if (cur.type === "gold" && b.spec.isGold) levelProgressCount++;
      else if (cur.type === "combo") levelProgressCount = Math.max(levelProgressCount, combo);
      else if (cur.type === "score") levelProgressCount = score;
      checkLevelWin();
    }
  }
  if (gameMode === "INFINITE" && balloonsPopped % 20 === 0) {
    wave++;
    if (wave > BB.Save.data.maxWave) BB.Save.data.maxWave = wave;
    earnCoins(10); triggerShake(6, 0.25);
    BB.UI.announce("🌊 WAVE " + wave, "Speed up!", "#ffd23f");
    textPopups.push(new MobileTextPopup("WAVE " + wave + "! ⚡", width / 2, height / 2, "#ffd23f", true));
  }
  updateHud();
  var fr = BB.Achievements.check();
  if (fr.length) BB.UI.announce("🏆 " + fr[0].name.toUpperCase(), "Achievement unlocked", "#ffd23f");
  BB.Save.save();
  if (!b.isPuzzle && !b.isSling) setTimeout(function () { b.reset(null); }, 400);
  if (gameMode === "SLING") {
    setTimeout(function () {
      if (gameState === "PLAYING" && gameMode === "SLING") {
        var unp = balloons.filter(function (o) { return !o.popped; }).length;
        slingshotActiveBalloons = unp;
        updateHud();
        if (unp === 0) {
          winSlingshotStage();
        }
      }
    }, 280);
  }
}
function checkPuzzleStatus() {
  if (gameState !== "PLAYING" || gameMode !== "PUZZLE") return;
  var unpopped = balloons.filter(function (o) { return !o.popped; }).length;
  puzzleActiveBalloons = unpopped;
  updateHud();
  if (unpopped === 0) {
    winPuzzle();
  } else if (puzzleDartsLeft <= 0) {
    setTimeout(function () {
      if (gameState !== "PLAYING" || gameMode !== "PUZZLE") return;
      var rem = balloons.filter(function (o) { return !o.popped; }).length;
      if (rem === 0) winPuzzle();
      else failPuzzle();
    }, 350);
  }
}
function winPuzzle() {
  gameState = "LEVEL_COMPLETE";
  sound().victory(); endFever();
  var pz = BB.Content.PUZZLES[currentPuzzleId - 1];
  var stars = (pz.darts === 1) ? 3 : (puzzleDartsLeft >= 1 ? 3 : 2);
  var pp = BB.Save.data.puzzleProgress;
  if (!pp) pp = BB.Save.data.puzzleProgress = { 1: { unlocked: true, stars: 0 } };
  if (!pp[currentPuzzleId]) pp[currentPuzzleId] = { unlocked: true, stars: 0 };
  pp[currentPuzzleId].stars = Math.max(pp[currentPuzzleId].stars, stars);
  if (currentPuzzleId < BB.Content.PUZZLES.length) {
    if (!pp[currentPuzzleId + 1]) pp[currentPuzzleId + 1] = { unlocked: true, stars: 0 };
    else pp[currentPuzzleId + 1].unlocked = true;
  }
  var bonus = 70 + stars * 25;
  BB.Economy.addCoins(bonus);
  BB.Economy.addGems(stars >= 3 ? 1 : 0);
  var rec = BB.Player.recordGame("PUZZLE", { score: 1000 * stars, pops: puzzleTotalBalloons, combo: maxCombo, wave: 0 });
  BB.Save.save(); BB.Achievements.check();
  BB.UI.showLevelComplete({
    stars: stars,
    score: 1000 * stars,
    time: puzzleDartsLeft + " Left",
    coins: bonus + rec.coins,
    xp: rec.xp,
    levelUp: rec.levelUp,
    isPuzzle: true,
    puzzleId: currentPuzzleId
  });
}
function failPuzzle() {
  gameState = "GAMEOVER";
  sound().lifeLost(); endFever();
  var unpopped = balloons.filter(function (o) { return !o.popped; }).length;
  BB.UI.showGameOver({
    isPuzzle: true,
    puzzleId: currentPuzzleId,
    score: (puzzleTotalBalloons - unpopped) * 100,
    pops: puzzleTotalBalloons - unpopped,
    combo: maxCombo,
    wave: 0,
    coins: (puzzleTotalBalloons - unpopped) * 2,
    xp: (puzzleTotalBalloons - unpopped) * 3,
    unpopped: unpopped
  });
}
function winSlingshotStage() {
  if (gameState !== "PLAYING" || gameMode !== "SLING") return;
  gameState = "LEVEL_COMPLETE";
  sound().victory(); endFever();
  var stg = BB.Content.SLING_STAGES[currentSlingshotStage - 1] || BB.Content.SLING_STAGES[0];
  var stars = slingshotArrowsLeft >= 1 ? 3 : 2;
  var sp = BB.Save.data.slingshotProgress;
  if (!sp) sp = BB.Save.data.slingshotProgress = { 1: { unlocked: true, stars: 0 } };
  if (!sp[currentSlingshotStage]) sp[currentSlingshotStage] = { unlocked: true, stars: 0 };
  sp[currentSlingshotStage].stars = Math.max(sp[currentSlingshotStage].stars, stars);
  if (currentSlingshotStage < BB.Content.SLING_STAGES.length) {
    if (!sp[currentSlingshotStage + 1]) sp[currentSlingshotStage + 1] = { unlocked: true, stars: 0 };
    else sp[currentSlingshotStage + 1].unlocked = true;
  }
  var bonus = 80 + stars * 30;
  BB.Economy.addCoins(bonus);
  BB.Economy.addGems(stars >= 3 ? 1 : 0);
  var rec = BB.Player.recordGame("SLING", { score: score || (1000 * stars), pops: slingshotTotalBalloons, combo: maxCombo, wave: 0 });
  BB.Save.save(); BB.Achievements.check();
  BB.UI.showLevelComplete({
    stars: stars,
    score: score || (1000 * stars),
    time: slingshotArrowsLeft + " Left",
    coins: bonus + rec.coins,
    xp: rec.xp,
    levelUp: rec.levelUp,
    isSlingshot: true,
    slingshotId: currentSlingshotStage
  });
}
function failSlingshotStage() {
  if (gameState !== "PLAYING" || gameMode !== "SLING") return;
  gameState = "GAMEOVER";
  sound().lifeLost(); endFever();
  var unpopped = balloons.filter(function (o) { return !o.popped; }).length;
  BB.UI.showGameOver({
    isSlingshot: true,
    slingshotId: currentSlingshotStage,
    score: score,
    pops: slingshotTotalBalloons - unpopped,
    combo: maxCombo,
    wave: 0,
    coins: (slingshotTotalBalloons - unpopped) * 2,
    xp: (slingshotTotalBalloons - unpopped) * 3,
    unpopped: unpopped
  });
}
function checkLevelWin() {
  var cur = BB.Content.LEVELS[currentLevelId - 1];
  if (levelProgressCount >= cur.target) {
    gameState = "LEVEL_COMPLETE"; sound().victory(); endFever();
    var stars = timeLeft >= 12 ? 3 : (timeLeft >= 5 ? 2 : 1);
    var lp = BB.Save.data.levelsProgress;
    if (!lp[currentLevelId]) lp[currentLevelId] = { unlocked: true, stars: 0 };
    lp[currentLevelId].stars = Math.max(lp[currentLevelId].stars, stars);
    if (currentLevelId < (BB.Content.MAX_LEVELS || 500)) {
      if (!lp[currentLevelId + 1]) lp[currentLevelId + 1] = { unlocked: true, stars: 0 };
      else lp[currentLevelId + 1].unlocked = true;
    }
    var bonus = 50 + stars * 25;
    BB.Economy.addGems(stars >= 3 ? 1 : 0);
    BB.Economy.addCoins(bonus);
    var rec = BB.Player.recordGame("LEVELS", { score: score, pops: balloonsPopped, combo: maxCombo, wave: 0 });
    BB.Rewards.track("score", score);
    BB.Save.save(); BB.Achievements.check();
    BB.UI.showLevelComplete({ stars: stars, score: score, time: Math.ceil(timeLeft), coins: bonus + rec.coins, xp: rec.xp, levelUp: rec.levelUp });
  }
}
function endGame() {
  gameState = "GAMEOVER"; endFever();
  var before = Math.max(BB.Save.data.blitzHighScore || 0, BB.Save.data.infiniteHighScore || 0);
  var rec = BB.Player.recordGame(gameMode, { score: score, pops: balloonsPopped, combo: maxCombo, wave: wave });
  BB.Economy.addCoins(rec.coins);
  BB.Board.addScore(gameMode, score);
  BB.Rewards.track("score", score);
  BB.Save.save(); BB.Achievements.check();
  var isHigh = score > before && score > 0;
  BB.UI.showGameOver({ score: score, pops: balloonsPopped, combo: maxCombo, wave: wave, coins: rec.coins, xp: rec.xp, isHigh: isHigh, levelUp: rec.levelUp });
  try { BB.Ads.onGameOver(); } catch (e) {}
}
function updateHud() {
  document.getElementById("mScoreVal").innerText = score;
  var best = Math.max(BB.Save.data.blitzHighScore || 0, BB.Save.data.infiniteHighScore || 0, score);
  document.getElementById("mBestVal").innerText = best;
  document.getElementById("mComboVal").innerText = "x" + combo;
  document.getElementById("mCoinVal").innerText = BB.Save.data.coins || 0;
  if (combo > 1) {
    document.body.classList.add("combo-active");
  } else {
    document.body.classList.remove("combo-active");
  }
  var resetBtn = document.getElementById("hudResetPuzzleBtn");
  if (resetBtn) resetBtn.style.display = (gameMode === "PUZZLE" || gameMode === "SLING") ? "flex" : "none";

  if (gameMode === "BLITZ") {
    document.getElementById("hudModeVal").innerText = "BLITZ";
    document.getElementById("mTargetLbl").innerText = "TIME";
    document.getElementById("mTargetVal").innerText = Math.ceil(timeLeft);
  } else if (gameMode === "INFINITE") {
    document.getElementById("hudModeVal").innerText = "WAVE " + wave;
    document.getElementById("mTargetLbl").innerText = "LIVES";
    var h = ""; for (var i = 0; i < Math.max(0, lives); i++) h += "❤️";
    document.getElementById("mTargetVal").innerText = h || "💀";
  } else if (gameMode === "LEVELS") {
    var l = BB.Content.LEVELS[currentLevelId - 1];
    document.getElementById("hudModeVal").innerText = (l && l.isBoss ? "👑 BOSS " : "STG ") + currentLevelId;
    document.getElementById("mTargetLbl").innerText = "TIME";
    document.getElementById("mTargetVal").innerText = Math.ceil(timeLeft);
    var banner = document.getElementById("mobileObjBanner");
    if (banner && l) {
      banner.style.display = "block";
      if (l.isBoss) {
        banner.innerText = "👑 BOSS BATTLE: " + (bossHp || 0) + "/" + (maxBossHp || 0) + " HP (" + Math.ceil(timeLeft) + "s)";
      } else {
        banner.innerText = "LVL " + currentLevelId + ": " + l.desc + " (" + levelProgressCount + "/" + l.target + ")";
      }
    }
  } else if (gameMode === "PUZZLE") {
    var pz = (BB.Content.PUZZLES && BB.Content.PUZZLES[currentPuzzleId - 1]) || { name: "Puzzle", darts: 1 };
    document.getElementById("hudModeVal").innerText = "PUZZLE " + currentPuzzleId;
    document.getElementById("mTargetLbl").innerText = "DARTS";
    document.getElementById("mTargetVal").innerText = "🎯 " + puzzleDartsLeft;
    var banner = document.getElementById("mobileObjBanner");
    if (banner) {
      banner.style.display = "block";
      banner.innerText = "🧩 PUZZLE " + currentPuzzleId + ": " + pz.name + " (" + puzzleActiveBalloons + " left)";
    }
  } else if (gameMode === "SLING") {
    var stg = (BB.Content.SLING_STAGES && BB.Content.SLING_STAGES[currentSlingshotStage - 1]) || { name: "Slingshot", arrows: 2 };
    document.getElementById("hudModeVal").innerText = "SLING " + currentSlingshotStage;
    document.getElementById("mTargetLbl").innerText = "ARROWS";
    document.getElementById("mTargetVal").innerText = "🏹 " + slingshotArrowsLeft;
    var banner = document.getElementById("mobileObjBanner");
    if (banner) {
      banner.style.display = "block";
      banner.innerText = "🏹 STAGE " + currentSlingshotStage + ": " + stg.name + " (" + slingshotActiveBalloons + " left)";
    }
  }
  updateWeaponBadge();
}
function handleTouchAt(x, y) {
  if (gameState !== "PLAYING") return;
  fireAt(x, y);
}
function fireAt(px, py) {
  if (gameMode === "SLING") {
    return;
  }
  if (gameMode === "PUZZLE") {
    if (puzzleDartsLeft <= 0) return;
    spawnRipple(px, py, "");
    var hitTarget = null;
    for (var pi = balloons.length - 1; pi >= 0; pi--) {
      var pb = balloons[pi];
      if (!pb.popped && pb.containsPoint(px, py)) { hitTarget = pb; break; }
    }
    if (hitTarget) {
      puzzleDartsLeft--;
      popBalloon(hitTarget);
      updateHud();
    }
    return;
  }

  if (bossBalloon && !bossBalloon.popped && bossBalloon.containsPoint(px, py)) {
    bossBalloon.hp--;
    bossHp = bossBalloon.hp;
    triggerShake(7, 0.16);
    sound().laser();
    burst(px, py, "#ffd000", 14);
    textPopups.push(new MobileTextPopup("-1 HP! 👑", px, py - 20, "#ff4444"));
    levelProgressCount++;
    if (bossBalloon.hp <= 0) {
      bossBalloon.popped = true;
      burst(bossBalloon.x, bossBalloon.y, "#ffd700", 45, true);
      shockwaves.push(new MobileShockwave(bossBalloon.x, bossBalloon.y, 250, "#ffd700"));
      sound().victory();
      setTimeout(checkLevelWin, 350);
    }
    updateHud();
    return;
  }

  for (var i = powerupDrops.length - 1; i >= 0; i--) {
    var dp = powerupDrops[i];
    if (dp.containsPoint(px, py)) { powerupDrops.splice(i, 1); collectDrop(dp); return; }
  }
  spawnRipple(px, py, "");
  var i, b;
  if (currentWeapon === "laser") {
    lasers.push(new LaserBeam(px)); triggerShake(8, 0.2); sound().vibrate(30);
    balloons.forEach(function (bl) {
      if (!bl.popped && Math.abs(bl.drawX - px) < bl.radius + 18) popBalloon(bl);
    });
    return;
  }
  if (currentWeapon === "shotgun") {
    var hitS = false;
    [-46, 0, 46].forEach(function (ox) {
      for (var j = balloons.length - 1; j >= 0; j--) {
        var sb = balloons[j];
        if (!sb.popped && sb.containsPoint(px + ox, py)) { popBalloon(sb); hitS = true; break; }
      }
    });
    if (!hitS && combo > 1) { combo = 1; updateHud(); }
    return;
  }
  var hit = false, best = null;
  for (i = balloons.length - 1; i >= 0; i--) {
    b = balloons[i];
    if (!b.popped && b.containsPoint(px, py)) {
      if (b.isHazard) {
        score = Math.max(0, score - 200);
        combo = 1;
        triggerShake(12, 0.35); BB.UI.flash(0.2);
        sound().bomb();
        burst(px, py, "#ff2a5f", 20, true);
        textPopups.push(new MobileTextPopup("OUCH! 🦔 -200", px, py - 20, "#ff2a5f", true));
        b.popped = true;
        setTimeout(function () { b.reset(null); }, 400);
        updateHud();
        return;
      }
      if (b.shield > 0) {
        b.shield = 0;
        sound().laser();
        triggerShake(6, 0.15);
        burst(b.drawX, b.y, "#00f5d4", 16);
        textPopups.push(new MobileTextPopup("SHIELD BROKEN! 🛡️", b.drawX, b.y - 20, "#00f5d4"));
        var curLvl = BB.Content.LEVELS[currentLevelId - 1];
        if (curLvl && curLvl.type === "shield") {
          levelProgressCount++;
          checkLevelWin();
        }
        updateHud();
        return;
      }
      popBalloon(b); hit = true; best = b; break;
    }
  }
  if (currentWeapon === "gatling" && hit) {
    var extra = 0;
    var near = balloons.filter(function (o) { return !o.popped && o !== best; })
      .map(function (o) { return { o: o, d: Math.hypot(o.drawX - px, o.y - py) }; })
      .sort(function (a, c) { return a.d - c.d; });
    for (var k = 0; k < near.length; k++) {
      if (extra >= 2 || near[k].d > 140) break;
      popBalloon(near[k].o); extra++;
    }
  }
  if (!hit && combo > 1) { combo = 1; updateHud(); }
}
function loop(curT) {
  var dt = Math.min((curT - lastT) / 1000, 0.1); lastT = curT;
  if (isFever) {
    feverTimer -= dt;
    document.getElementById("mFeverPct").innerText = Math.ceil(Math.max(0, feverTimer)) + "s";
    if (feverTimer <= 0) endFever();
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (shakeDuration > 0) {
    shakeDuration -= dt;
    ctx.translate((Math.random() - 0.5) * shakeIntensity, (Math.random() - 0.5) * shakeIntensity);
    if (shakeDuration <= 0) shakeIntensity = 0;
  }
  ctx.clearRect(-20, -20, width + 40, height + 40);
  var scale = slowMoTimer > 0 ? 1.0 : (isFever ? 1.35 : 1.0);
  if (slowMoTimer > 0) slowMoTimer -= dt;
  if (lifeGrace > 0) lifeGrace -= dt;
  var frozen = (gameState === "PAUSED");
  if (slowMoTimer > 0) { ctx.fillStyle = "rgba(0,245,212,.05)"; ctx.fillRect(0, 0, width, height); ctx.fillStyle = "rgba(0,245,212,.03)"; ctx.fillRect(0, height * 0.22, width, height * 0.78); }
  if (isFever) { var h = (curT * 0.15) % 360; ctx.fillStyle = "hsla(" + h + ",70%,55%,.04)"; ctx.fillRect(0, 0, width, height); }
  if (bossBalloon && !bossBalloon.popped) {
    if (!frozen) bossBalloon.update(dt);
    bossBalloon.draw();
  }
  for (var i = 0; i < balloons.length; i++) { var b = balloons[i]; if (!frozen) b.update(dt, scale); if (!b.popped) b.draw(); }
  for (var d = powerupDrops.length - 1; d >= 0; d--) {
    var dr = powerupDrops[d]; if (!frozen) dr.update(dt); dr.draw();
    if (dr.life <= 0 || dr.y > height + 40) powerupDrops.splice(d, 1);
  }
  for (var lb = lasers.length - 1; lb >= 0; lb--) {
    var bm = lasers[lb]; bm.update(dt); bm.draw();
    if (bm.life <= 0) lasers.splice(lb, 1);
  }
  if (weaponTimer > 0) {
    weaponTimer -= dt;
    var ws = Math.ceil(weaponTimer);
    if (ws !== weaponShownSec) { weaponShownSec = ws; updateWeaponBadge(); }
    if (weaponTimer <= 0) resetWeapon();
  }
  for (var nr = needleRays.length - 1; nr >= 0; nr--) {
    var ray = needleRays[nr]; ray.update(dt); ray.draw();
    if (ray.life <= 0) needleRays.splice(nr, 1);
  }
  for (var j = shockwaves.length - 1; j >= 0; j--) { var s = shockwaves[j]; s.update(dt); s.draw(); if (s.life <= 0) shockwaves.splice(j, 1); }
  for (var k = particles.length - 1; k >= 0; k--) { var p = particles[k]; p.update(dt); p.draw(); if (p.life <= 0) particles.splice(k, 1); }
  for (var t = textPopups.length - 1; t >= 0; t--) { var tp = textPopups[t]; tp.update(dt); tp.draw(); if (tp.life <= 0) textPopups.splice(t, 1); }
  if (gameMode === "SLING") {
    for (var sd = slingshotDarts.length - 1; sd >= 0; sd--) {
      var sDart = slingshotDarts[sd];
      if (!frozen) sDart.update(dt);
      sDart.draw();
      if (sDart.life <= 0 || sDart.y > height + 60) {
        slingshotDarts.splice(sd, 1);
        if (slingshotArrowsLeft <= 0 && slingshotDarts.length === 0) {
          setTimeout(function () {
            if (gameState === "PLAYING" && gameMode === "SLING") endGame();
          }, 600);
        }
      }
    }
    drawSlingshot();
  }
  if (comboTimer > 0) { comboTimer -= dt; if (comboTimer <= 0 && combo > 1) { combo = 1; updateHud(); } }
  if (gameState === "PLAYING" && (gameMode === "BLITZ" || gameMode === "LEVELS")) {
    timeLeft -= dt;
    if (timeLeft <= 0) {
      timeLeft = 0; updateHud();
      if (gameMode === "LEVELS" && levelProgressCount >= BB.Content.LEVELS[currentLevelId - 1].target) checkLevelWin();
      else endGame();
    } else updateHud();
  }
  requestAnimationFrame(loop);
}
var lastT = performance.now();
function resizeCanvas() {
  width = window.innerWidth; height = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
  mousePos.x = width / 2; mousePos.y = height / 2;
}
BB.Engine = {
  lockInput: function () { inputLockUntil = Date.now() + 500; },
  init: function (id) {
    canvas = document.getElementById(id); ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", function () { setTimeout(resizeCanvas, 150); });
    window.addEventListener("pointerdown", function (e) {
      BB.Audio.sound.init(); if (isUiTouch(e)) return;
      if (Date.now() < inputLockUntil) return;
      if (gameMode === "SLING") {
        if (e.clientY > height * 0.45) {
          slingshotState.dragging = true;
          slingshotState.curX = e.clientX;
          slingshotState.curY = e.clientY;
          return;
        }
      }
      if (e.pointerId !== undefined) dragStart[e.pointerId] = { x: e.clientX, y: e.clientY };
      handleTouchAt(e.clientX, e.clientY);
    });
    window.addEventListener("pointermove", function (e) {
      if (gameMode === "SLING" && slingshotState.dragging) {
        slingshotState.curX = e.clientX;
        slingshotState.curY = e.clientY;
      }
    });
    window.addEventListener("pointerup", function (e) {
      if (gameMode === "SLING" && slingshotState.dragging) {
        var s = getSlingshotVectors();
        slingshotState.dragging = false;
        if (s.active && slingshotArrowsLeft > 0) {
          slingshotArrowsLeft--;
          sound().slingshotTwang();
          triggerShake(5, 0.12);
          slingshotDarts.push(new SlingshotProjectile(s.slingX, s.anchorY - 15, s.vx, s.vy));
          updateHud();
        }
        return;
      }
      if (e.pointerId !== undefined) delete dragStart[e.pointerId];
    });
    window.addEventListener("pointercancel", function (e) {
      if (gameMode === "SLING") slingshotState.dragging = false;
      if (e.pointerId !== undefined) delete dragStart[e.pointerId];
    });
    window.addEventListener("touchmove", function (e) {
      BB.Audio.sound.init(); if (isUiTouch(e)) return;
      if (gameMode === "SLING" && slingshotState.dragging && e.touches.length > 0) {
        slingshotState.curX = e.touches[0].clientX;
        slingshotState.curY = e.touches[0].clientY;
        return;
      }
      var now = performance.now(); if (now - lastMovePop < 140) return;
      for (var i = 0; i < e.changedTouches.length; i++) {
        var t = e.changedTouches[i];
        var st = dragStart[t.identifier]; if (!st) continue;
        var dx = t.clientX - st.x, dy = t.clientY - st.y;
        if (dx * dx + dy * dy < 60 * 60) continue;
        lastMovePop = now;
        handleTouchAt(t.clientX, t.clientY);
        break;
      }
    }, { passive: true });
    window.addEventListener("touchend", function (e) {
      for (var i = 0; i < e.changedTouches.length; i++) delete dragStart[e.changedTouches[i].identifier];
    });
    window.addEventListener("touchcancel", function (e) {
      for (var i = 0; i < e.changedTouches.length; i++) delete dragStart[e.changedTouches[i].identifier];
    });
    document.addEventListener("gesturestart", function (e) { e.preventDefault(); });
    document.addEventListener("dblclick", function (e) { e.preventDefault(); }, { passive: false });
    initBalloons();
    requestAnimationFrame(loop);
  },
  dims: function () { return { w: width, h: height }; },
  state: function () {
    return { mode: gameMode, state: gameState, score: score, combo: combo, lives: lives, wave: wave, level: currentLevelId, puzzle: currentPuzzleId, slingshot: currentSlingshotStage };
  },
  startPuzzle: startPuzzle,
  startSlingshot: startSlingshot,
  resetSlingshot: function () { if (gameMode === "SLING") startSlingshot(currentSlingshotStage); },
  resetPuzzle: function () {
    if (gameMode === "PUZZLE") startPuzzle(currentPuzzleId);
    else if (gameMode === "SLING") startSlingshot(currentSlingshotStage);
  }
};
