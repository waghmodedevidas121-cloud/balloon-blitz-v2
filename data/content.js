/* BB.Content — content-driven catalog with 600 Progressive Levels, 24 Worlds & 25 Tactical Puzzles. */
window.BB = window.BB || {};

(function () {
  var WORLDS = [
    { id: 1,  name: "Sunny Valley",      icon: "☀️", start: 1,   end: 25 },
    { id: 2,  name: "Rainbow Meadow",     icon: "🌈", start: 26,  end: 50 },
    { id: 3,  name: "Neon Carnival",      icon: "🎪", start: 51,  end: 75 },
    { id: 4,  name: "Thunder Grove",      icon: "⚡", start: 76,  end: 100 },
    { id: 5,  name: "Candy Kingdom",      icon: "🍭", start: 101, end: 125 },
    { id: 6,  name: "Frost Glacier",      icon: "❄️", start: 126, end: 150 },
    { id: 7,  name: "Molten Volcano",     icon: "🌋", start: 151, end: 175 },
    { id: 8,  name: "Mystic Jungle",      icon: "🌴", start: 176, end: 200 },
    { id: 9,  name: "Crystal Cavern",     icon: "💎", start: 201, end: 225 },
    { id: 10, name: "Sky Citadel",        icon: "🏰", start: 226, end: 250 },
    { id: 11, name: "Starry Twilight",    icon: "✨", start: 251, end: 275 },
    { id: 12, name: "Deep Coral",         icon: "🌊", start: 276, end: 300 },
    { id: 13, name: "Cyber Metropolis",   icon: "🏙️", start: 301, end: 325 },
    { id: 14, name: "Solar Flares",       icon: "☀️", start: 326, end: 350 },
    { id: 15, name: "Phantom Castle",     icon: "👻", start: 351, end: 375 },
    { id: 16, name: "Diamond Peaks",      icon: "🔷", start: 376, end: 400 },
    { id: 17, name: "Dragon's Lair",      icon: "🐉", start: 401, end: 425 },
    { id: 18, name: "Vortex Nebula",      icon: "🌀", start: 426, end: 450 },
    { id: 19, name: "Galactic Gates",     icon: "🚀", start: 451, end: 475 },
    { id: 20, name: "Cosmic Apex",        icon: "👑", start: 476, end: 500 },
    { id: 21, name: "Celestial Haven",    icon: "🌌", start: 501, end: 525 },
    { id: 22, name: "Chrono Spire",       icon: "⏳", start: 526, end: 550 },
    { id: 23, name: "Solar Eclipse",      icon: "🌑", start: 551, end: 575 },
    { id: 24, name: "Eternal Infinity",   icon: "♾️", start: 576, end: 600 }
  ];

  function generate600Levels() {
    var arr = [];
    var worldThemes = [
      { id: 1,  name: "Sunny Valley",      focus: "moves_color", hasHazards: false, hasShields: false, hasWind: false },
      { id: 2,  name: "Rainbow Meadow",     focus: "sequence_hazard", hasHazards: true, hasShields: false, hasWind: false },
      { id: 3,  name: "Neon Carnival",      focus: "shield_bomb", hasHazards: false, hasShields: true, hasWind: false },
      { id: 4,  name: "Thunder Grove",      focus: "wind_escort", hasHazards: true, hasShields: false, hasWind: true },
      { id: 5,  name: "Candy Kingdom",      focus: "color_shield", hasHazards: false, hasShields: true, hasWind: false },
      { id: 6,  name: "Frost Glacier",      focus: "freeze_drift", hasHazards: true, hasShields: true, hasWind: true },
      { id: 7,  name: "Molten Volcano",     focus: "bomb_hazard", hasHazards: true, hasShields: false, hasWind: true },
      { id: 8,  name: "Mystic Jungle",      focus: "sequence_escort", hasHazards: true, hasShields: true, hasWind: false },
      { id: 9,  name: "Crystal Cavern",     focus: "gold_shield", hasHazards: true, hasShields: true, hasWind: false },
      { id: 10, name: "Sky Citadel",        focus: "wind_shield_boss", hasHazards: true, hasShields: true, hasWind: true },
      { id: 11, name: "Starry Twilight",    focus: "sequence_color", hasHazards: true, hasShields: true, hasWind: false },
      { id: 12, name: "Deep Coral",         focus: "drift_escort", hasHazards: true, hasShields: true, hasWind: true },
      { id: 13, name: "Cyber Metropolis",   focus: "shield_bomb", hasHazards: true, hasShields: true, hasWind: false },
      { id: 14, name: "Solar Flares",       focus: "bomb_hazard", hasHazards: true, hasShields: true, hasWind: true },
      { id: 15, name: "Phantom Castle",     focus: "sequence_hazard", hasHazards: true, hasShields: true, hasWind: false },
      { id: 16, name: "Diamond Peaks",      focus: "shield_escort", hasHazards: true, hasShields: true, hasWind: true },
      { id: 17, name: "Dragon's Lair",      focus: "boss_hazard", hasHazards: true, hasShields: true, hasWind: true },
      { id: 18, name: "Vortex Nebula",      focus: "wind_sequence", hasHazards: true, hasShields: true, hasWind: true },
      { id: 19, name: "Galactic Gates",     focus: "shield_color", hasHazards: true, hasShields: true, hasWind: true },
      { id: 20, name: "Cosmic Apex",        focus: "apex_trials", hasHazards: true, hasShields: true, hasWind: true },
      { id: 21, name: "Celestial Haven",    focus: "apex_trials", hasHazards: true, hasShields: true, hasWind: true },
      { id: 22, name: "Chrono Spire",       focus: "apex_trials", hasHazards: true, hasShields: true, hasWind: true },
      { id: 23, name: "Solar Eclipse",      focus: "apex_trials", hasHazards: true, hasShields: true, hasWind: true },
      { id: 24, name: "Eternal Infinity",   focus: "infinity_master", hasHazards: true, hasShields: true, hasWind: true }
    ];

    var colorList = ["BLUE", "RED", "GREEN", "PINK", "GOLD"];
    var colorEmojis = { BLUE: "🔵", RED: "🔴", GREEN: "🍏", PINK: "🌸", GOLD: "⭐" };
    var colorNames = { BLUE: "Blue", RED: "Red", GREEN: "Green", PINK: "Pink", GOLD: "Gold" };

    for (var i = 1; i <= 600; i++) {
      var worldIdx = Math.floor((i - 1) / 25);
      var wInfo = worldThemes[worldIdx] || worldThemes[worldThemes.length - 1];
      var stageInWorld = ((i - 1) % 25) + 1;
      var speedScale = 1.0 + Math.min(0.18, (i - 1) * 0.0003);

      var isBoss = (stageInWorld === 25 || stageInWorld === 10 || stageInWorld === 20);
      var isMidBoss = (stageInWorld === 5 || stageInWorld === 15);

      if (isBoss) {
        var bossHp = Math.min(55, 14 + Math.floor(i * 0.07) + (stageInWorld === 25 ? 6 : 0));
        var bossMoves = Math.max(16, Math.floor(bossHp * 1.35) + 5);
        var bossName = stageInWorld === 25 ? (wInfo.name + " Monarch") : (stageInWorld === 20 ? "Dread Blimp" : "Sky Vanguard");
        arr.push({
          id: i,
          world: worldIdx + 1,
          worldName: wInfo.name,
          stageInWorld: stageInWorld,
          isBoss: true,
          target: bossHp,
          moves: bossMoves,
          time: 45,
          desc: "Defeat " + bossName + " (" + bossHp + " HP)",
          type: "boss",
          speedMult: speedScale,
          hasShields: wInfo.hasShields || (i > 50),
          hasHazards: wInfo.hasHazards || (i > 30),
          hasWind: wInfo.hasWind,
          windSpeed: wInfo.hasWind ? (i % 2 === 0 ? 30 : -30) : 0
        });
      } else if (isMidBoss) {
        var miniHp = Math.min(28, 8 + Math.floor(i * 0.04));
        var miniMoves = Math.max(12, Math.floor(miniHp * 1.35) + 3);
        arr.push({
          id: i,
          world: worldIdx + 1,
          worldName: wInfo.name,
          stageInWorld: stageInWorld,
          isMidBoss: true,
          target: miniHp,
          moves: miniMoves,
          time: 40,
          desc: "Defeat Mini Blimp (" + miniHp + " HP)",
          type: "midboss",
          speedMult: speedScale * 1.08,
          hasShields: wInfo.hasShields,
          hasHazards: wInfo.hasHazards,
          hasWind: wInfo.hasWind,
          windSpeed: wInfo.hasWind ? 24 : 0
        });
      } else {
        var stgType = "pop";
        var tgt = 15;
        var moves = 16;
        var descStr = "";
        var targetCol = null;
        var seq = null;
        var isEscort = false;
        var hasHazards = wInfo.hasHazards;
        var hasShields = wInfo.hasShields;
        var hasWind = wInfo.hasWind;

        // Tutorial Stages (World 1: 1-4)
        if (i === 1) {
          stgType = "pop"; tgt = 12; moves = 15;
          descStr = "Pop 12 balloons with smart moves!";
        } else if (i === 2) {
          stgType = "color"; targetCol = "BLUE"; tgt = 6; moves = 12;
          descStr = "Harvest 6 Blue 🔵 balloons";
        } else if (i === 3) {
          stgType = "color"; targetCol = "RED"; tgt = 6; moves = 12;
          descStr = "Harvest 6 Red 🔴 balloons";
        } else if (i === 4) {
          stgType = "gold"; tgt = 3; moves = 10;
          descStr = "Collect 3 Gold ⭐ balloons";
        } else {
          var pattern = stageInWorld % 7;
          if (wInfo.focus.indexOf("escort") !== -1 && (stageInWorld === 8 || stageInWorld === 18 || stageInWorld === 23)) {
            stgType = "escort";
            isEscort = true;
            tgt = 1;
            moves = 24;
            hasHazards = true;
            descStr = "Escort Traveler 🎈 safely to the clouds! (3 ❤️)";
          } else if (wInfo.focus.indexOf("sequence") !== -1 && (stageInWorld === 3 || stageInWorld === 9 || stageInWorld === 17)) {
            stgType = "sequence";
            seq = (i % 2 === 0) ? ["RED", "BLUE", "GREEN"] : ["BLUE", "GOLD", "RED"];
            tgt = seq.length * (stageInWorld > 12 ? 2 : 1);
            moves = 12 + Math.floor(stageInWorld * 0.4);
            var seqDesc = seq.map(function (k) { return colorEmojis[k]; }).join(" ➔ ");
            descStr = "Sequence: " + seqDesc;
          } else if (pattern === 1 || pattern === 4) {
            stgType = "color";
            targetCol = colorList[(i + stageInWorld) % colorList.length];
            tgt = Math.min(18, 5 + Math.floor(stageInWorld * 0.45));
            moves = tgt + Math.max(5, 10 - Math.floor(i * 0.012));
            descStr = "Harvest " + tgt + " " + colorNames[targetCol] + " " + colorEmojis[targetCol] + " balloons";
          } else if (pattern === 2 && (hasShields || i >= 26)) {
            stgType = "shield";
            hasShields = true;
            tgt = Math.min(16, 4 + Math.floor(stageInWorld * 0.4));
            moves = tgt + 6;
            descStr = "Shatter " + tgt + " Armored Shields 🛡️";
          } else if (pattern === 3) {
            stgType = "bomb";
            tgt = Math.min(10, 3 + Math.floor(stageInWorld * 0.25));
            moves = tgt + 5;
            descStr = "Detonate " + tgt + " Bomb chains 💥";
          } else if (pattern === 5) {
            if (stageInWorld % 2 === 0) {
              stgType = "gold";
              tgt = Math.min(8, 3 + Math.floor(stageInWorld * 0.2));
              moves = tgt + 6;
              descStr = "Collect " + tgt + " Gold ⭐ balloons";
            } else {
              stgType = "freeze";
              tgt = Math.min(8, 3 + Math.floor(stageInWorld * 0.2));
              moves = tgt + 5;
              descStr = "Pop " + tgt + " Slow-Mo ❄️ balloons";
            }
          } else {
            stgType = "pop";
            tgt = Math.min(28, 10 + Math.floor(stageInWorld * 0.7));
            moves = Math.max(tgt + 5, Math.ceil(tgt * 1.25));
            descStr = "Pop " + tgt + " balloons in " + moves + " moves";
          }
        }

        arr.push({
          id: i,
          world: worldIdx + 1,
          worldName: wInfo.name,
          stageInWorld: stageInWorld,
          target: tgt,
          moves: moves,
          time: 40,
          desc: descStr,
          type: stgType,
          targetColor: targetCol,
          sequence: seq,
          isEscort: isEscort,
          speedMult: speedScale,
          hasShields: hasShields,
          hasHazards: hasHazards,
          hasWind: hasWind,
          windSpeed: hasWind ? (i % 2 === 0 ? 30 : -30) : 0
        });
      }
    }
    return arr;
  }

  window.BB.Content = {
    WORLDS: WORLDS,
    LEVELS: generate600Levels(),
    MAX_LEVELS: 600,
  PUZZLES: [
    {
      id: 1,
      name: "The First Domino",
      desc: "1 Dart: Follow the arrows! Find the starting trigger!",
      darts: 1,
      balloons: [
        { key: "RED", x: 0.22, y: 0.45, dir: "RIGHT" },
        { key: "RED", x: 0.50, y: 0.45, dir: "RIGHT" },
        { key: "RED", x: 0.78, y: 0.45, dir: "UP" }
      ]
    },
    {
      id: 2,
      name: "The Square Loop",
      desc: "1 Dart: A continuous 4-way loop! Any node clears it!",
      darts: 1,
      balloons: [
        { key: "BLUE", x: 0.32, y: 0.32, dir: "RIGHT" },
        { key: "BLUE", x: 0.68, y: 0.32, dir: "DOWN" },
        { key: "BLUE", x: 0.68, y: 0.58, dir: "LEFT" },
        { key: "BLUE", x: 0.32, y: 0.58, dir: "UP" }
      ]
    },
    {
      id: 3,
      name: "Double Fork",
      desc: "1 Dart: Center balloon shoots both left and right (↔️)!",
      darts: 1,
      balloons: [
        { key: "GOLD",  x: 0.50, y: 0.45, dir: "HORIZ" },
        { key: "GREEN", x: 0.22, y: 0.45, dir: "UP" },
        { key: "GREEN", x: 0.22, y: 0.26, dir: "RIGHT" },
        { key: "PINK",  x: 0.78, y: 0.45, dir: "DOWN" },
        { key: "PINK",  x: 0.78, y: 0.64, dir: "LEFT" }
      ]
    },
    {
      id: 4,
      name: "The Snake Path",
      desc: "1 Dart: Trace backwards to find the snake head!",
      darts: 1,
      balloons: [
        { key: "RED",  x: 0.22, y: 0.32, dir: "DOWN" },
        { key: "PINK", x: 0.78, y: 0.32, dir: "LEFT" },
        { key: "RED",  x: 0.22, y: 0.58, dir: "RIGHT" },
        { key: "PINK", x: 0.78, y: 0.58, dir: "UP" },
        { key: "GOLD", x: 0.78, y: 0.45, dir: "LEFT" }
      ]
    },
    {
      id: 5,
      name: "Bomb Detonator",
      desc: "1 Dart: Guide the needle into the 4-way Bomb!",
      darts: 1,
      balloons: [
        { key: "BOMB",  x: 0.50, y: 0.45, dir: "ALL" },
        { key: "RED",   x: 0.50, y: 0.24, dir: "DOWN" },
        { key: "BLUE",  x: 0.22, y: 0.45, dir: "DOWN" },
        { key: "BLUE",  x: 0.22, y: 0.66, dir: "RIGHT" },
        { key: "GREEN", x: 0.78, y: 0.45, dir: "UP" },
        { key: "GREEN", x: 0.78, y: 0.24, dir: "LEFT" },
        { key: "PINK",  x: 0.50, y: 0.66, dir: "LEFT" }
      ]
    },
    {
      id: 6,
      name: "Twin Circuits",
      desc: "2 Darts: Two separate arrow circuits!",
      darts: 2,
      balloons: [
        { key: "RED",  x: 0.30, y: 0.30, dir: "DOWN" },
        { key: "RED",  x: 0.30, y: 0.45, dir: "DOWN" },
        { key: "RED",  x: 0.30, y: 0.60, dir: "RIGHT" },
        { key: "BLUE", x: 0.70, y: 0.60, dir: "UP" },
        { key: "BLUE", x: 0.70, y: 0.45, dir: "UP" },
        { key: "BLUE", x: 0.70, y: 0.30, dir: "LEFT" }
      ]
    },
    {
      id: 7,
      name: "Crossfire Split",
      desc: "2 Darts: Master vertical (↕️) and horizontal (↔️) beamers!",
      darts: 2,
      balloons: [
        { key: "GOLD",  x: 0.50, y: 0.45, dir: "VERT" },
        { key: "GOLD",  x: 0.50, y: 0.30, dir: "HORIZ" },
        { key: "PINK",  x: 0.50, y: 0.16, dir: "LEFT" },
        { key: "PINK",  x: 0.50, y: 0.62, dir: "RIGHT" },
        { key: "GREEN", x: 0.22, y: 0.30, dir: "DOWN" },
        { key: "GREEN", x: 0.78, y: 0.30, dir: "DOWN" },
        { key: "BLUE",  x: 0.78, y: 0.62, dir: "LEFT" }
      ]
    },
    {
      id: 8,
      name: "The Matrix",
      desc: "2 Darts: Navigate through the grid circuit!",
      darts: 2,
      balloons: [
        { key: "RED",   x: 0.25, y: 0.28, dir: "RIGHT" },
        { key: "RED",   x: 0.50, y: 0.28, dir: "RIGHT" },
        { key: "RED",   x: 0.75, y: 0.28, dir: "DOWN" },
        { key: "BLUE",  x: 0.75, y: 0.45, dir: "LEFT" },
        { key: "BLUE",  x: 0.50, y: 0.45, dir: "DOWN" },
        { key: "BLUE",  x: 0.25, y: 0.45, dir: "UP" },
        { key: "GREEN", x: 0.50, y: 0.62, dir: "RIGHT" },
        { key: "GREEN", x: 0.75, y: 0.62, dir: "UP" }
      ]
    },
    {
      id: 9,
      name: "Sub-Zero Cross",
      desc: "2 Darts: Freeze shatters the row, unlocking the Bomb!",
      darts: 2,
      balloons: [
        { key: "FREEZE", x: 0.50, y: 0.32, dir: "HORIZ" },
        { key: "RED",    x: 0.25, y: 0.32, dir: "DOWN" },
        { key: "RED",    x: 0.75, y: 0.32, dir: "DOWN" },
        { key: "BOMB",   x: 0.50, y: 0.55, dir: "ALL" },
        { key: "GREEN",  x: 0.25, y: 0.55, dir: "RIGHT" },
        { key: "GREEN",  x: 0.75, y: 0.55, dir: "LEFT" }
      ]
    },
    {
      id: 10,
      name: "Grand Arrow Mid-Boss",
      isMidBoss: true,
      desc: "3 Darts: 12 directional balloons! The ultimate puzzle!",
      darts: 3,
      balloons: [
        { key: "GOLD",  x: 0.50, y: 0.44, dir: "ALL" },
        { key: "RED",   x: 0.25, y: 0.26, dir: "RIGHT" },
        { key: "RED",   x: 0.50, y: 0.26, dir: "RIGHT" },
        { key: "RED",   x: 0.75, y: 0.26, dir: "DOWN" },
        { key: "BLUE",  x: 0.75, y: 0.44, dir: "DOWN" },
        { key: "BLUE",  x: 0.75, y: 0.62, dir: "LEFT" },
        { key: "BLUE",  x: 0.50, y: 0.62, dir: "LEFT" },
        { key: "GREEN", x: 0.25, y: 0.62, dir: "UP" },
        { key: "GREEN", x: 0.25, y: 0.44, dir: "UP" },
        { key: "PINK",  x: 0.38, y: 0.35, dir: "DOWN" },
        { key: "PINK",  x: 0.62, y: 0.35, dir: "LEFT" },
        { key: "PINK",  x: 0.50, y: 0.53, dir: "UP" }
      ]
    },
    {
      id: 11,
      name: "The Pinwheel",
      desc: "1 Dart: Start the clockwise whirl into the central TNT core!",
      darts: 1,
      balloons: [
        { key: "RED",   x: 0.20, y: 0.25, dir: "RIGHT" },
        { key: "BLUE",  x: 0.50, y: 0.25, dir: "DOWN" },
        { key: "BOMB",  x: 0.50, y: 0.45, dir: "ALL" },
        { key: "GREEN", x: 0.50, y: 0.65, dir: "LEFT" },
        { key: "PINK",  x: 0.20, y: 0.65, dir: "UP" },
        { key: "GOLD",  x: 0.20, y: 0.45, dir: "RIGHT" },
        { key: "GOLD",  x: 0.80, y: 0.45, dir: "UP" },
        { key: "PINK",  x: 0.80, y: 0.25, dir: "LEFT" }
      ]
    },
    {
      id: 12,
      name: "The Forking Diamond",
      desc: "1 Dart: Dual symmetric beam split into the apex bomb!",
      darts: 1,
      balloons: [
        { key: "RED",   x: 0.50, y: 0.65, dir: "UP" },
        { key: "GOLD",  x: 0.50, y: 0.45, dir: "HORIZ" },
        { key: "BLUE",  x: 0.25, y: 0.45, dir: "UP" },
        { key: "BLUE",  x: 0.75, y: 0.45, dir: "UP" },
        { key: "GREEN", x: 0.25, y: 0.25, dir: "RIGHT" },
        { key: "GREEN", x: 0.75, y: 0.25, dir: "LEFT" },
        { key: "BOMB",  x: 0.50, y: 0.25, dir: "ALL" },
        { key: "PINK",  x: 0.50, y: 0.12, dir: "DOWN" }
      ]
    },
    {
      id: 13,
      name: "Crossroads of Chaos",
      desc: "2 Darts: Solve both interlocking directional circuits!",
      darts: 2,
      balloons: [
        { key: "RED",   x: 0.25, y: 0.25, dir: "DOWN" },
        { key: "BLUE",  x: 0.25, y: 0.50, dir: "RIGHT" },
        { key: "GREEN", x: 0.50, y: 0.50, dir: "DOWN" },
        { key: "PINK",  x: 0.50, y: 0.70, dir: "LEFT" },
        { key: "GOLD",  x: 0.25, y: 0.70, dir: "UP" },
        { key: "RED",   x: 0.75, y: 0.70, dir: "UP" },
        { key: "BLUE",  x: 0.75, y: 0.45, dir: "LEFT" },
        { key: "BOMB",  x: 0.50, y: 0.45, dir: "UP" },
        { key: "GOLD",  x: 0.50, y: 0.25, dir: "RIGHT" },
        { key: "PINK",  x: 0.75, y: 0.25, dir: "DOWN" }
      ]
    },
    {
      id: 14,
      name: "Triple Beam Ricochet",
      desc: "2 Darts: Trigger the horizontal beamers and vertical pillars!",
      darts: 2,
      balloons: [
        { key: "GOLD",  x: 0.50, y: 0.45, dir: "HORIZ" },
        { key: "RED",   x: 0.20, y: 0.45, dir: "UP" },
        { key: "RED",   x: 0.80, y: 0.45, dir: "UP" },
        { key: "PINK",  x: 0.20, y: 0.25, dir: "RIGHT" },
        { key: "PINK",  x: 0.80, y: 0.25, dir: "LEFT" },
        { key: "BOMB",  x: 0.50, y: 0.25, dir: "ALL" },
        { key: "BLUE",  x: 0.20, y: 0.68, dir: "RIGHT" },
        { key: "GREEN", x: 0.50, y: 0.68, dir: "VERT" },
        { key: "GOLD",  x: 0.50, y: 0.56, dir: "UP" },
        { key: "PINK",  x: 0.50, y: 0.78, dir: "DOWN" },
        { key: "BLUE",  x: 0.80, y: 0.68, dir: "UP" },
        { key: "GOLD",  x: 0.80, y: 0.56, dir: "LEFT" }
      ]
    },
    {
      id: 15,
      name: "The Binary Tree",
      desc: "1 Dart: Trace from the trunk to shatter the entire crown!",
      darts: 1,
      balloons: [
        { key: "RED",   x: 0.50, y: 0.72, dir: "UP" },
        { key: "GOLD",  x: 0.50, y: 0.52, dir: "HORIZ" },
        { key: "BLUE",  x: 0.26, y: 0.52, dir: "UP" },
        { key: "GREEN", x: 0.26, y: 0.34, dir: "RIGHT" },
        { key: "BLUE",  x: 0.74, y: 0.52, dir: "UP" },
        { key: "GREEN", x: 0.74, y: 0.34, dir: "LEFT" },
        { key: "BOMB",  x: 0.50, y: 0.34, dir: "ALL" },
        { key: "GOLD",  x: 0.50, y: 0.18, dir: "HORIZ" },
        { key: "PINK",  x: 0.26, y: 0.18, dir: "DOWN" },
        { key: "PINK",  x: 0.74, y: 0.18, dir: "DOWN" }
      ]
    },
    {
      id: 16,
      name: "Sub-Zero Perimeter",
      desc: "2 Darts: Freeze wave split unlocking twin explosive wings!",
      darts: 2,
      balloons: [
        { key: "FREEZE", x: 0.25, y: 0.30, dir: "HORIZ" },
        { key: "RED",    x: 0.12, y: 0.30, dir: "DOWN" },
        { key: "PINK",   x: 0.12, y: 0.60, dir: "RIGHT" },
        { key: "BLUE",   x: 0.38, y: 0.60, dir: "UP" },
        { key: "GREEN",  x: 0.38, y: 0.30, dir: "LEFT" },
        { key: "FREEZE", x: 0.75, y: 0.30, dir: "HORIZ" },
        { key: "RED",    x: 0.62, y: 0.30, dir: "DOWN" },
        { key: "BLUE",   x: 0.62, y: 0.60, dir: "RIGHT" },
        { key: "PINK",   x: 0.88, y: 0.60, dir: "UP" },
        { key: "BOMB",   x: 0.88, y: 0.30, dir: "ALL" },
        { key: "GOLD",   x: 0.88, y: 0.16, dir: "DOWN" }
      ]
    },
    {
      id: 17,
      name: "The Hourglass",
      desc: "1 Dart: Pass through the tight neck to detonate the base!",
      darts: 1,
      balloons: [
        { key: "RED",   x: 0.25, y: 0.22, dir: "RIGHT" },
        { key: "BLUE",  x: 0.75, y: 0.22, dir: "DOWN" },
        { key: "PINK",  x: 0.75, y: 0.38, dir: "LEFT" },
        { key: "BOMB",  x: 0.50, y: 0.38, dir: "DOWN" },
        { key: "GOLD",  x: 0.50, y: 0.54, dir: "HORIZ" },
        { key: "GREEN", x: 0.25, y: 0.54, dir: "DOWN" },
        { key: "GREEN", x: 0.75, y: 0.54, dir: "DOWN" },
        { key: "BLUE",  x: 0.25, y: 0.70, dir: "RIGHT" },
        { key: "PINK",  x: 0.75, y: 0.70, dir: "LEFT" },
        { key: "GOLD",  x: 0.50, y: 0.70, dir: "UP" }
      ]
    },
    {
      id: 18,
      name: "Orbit Core Mid-Boss",
      isMidBoss: true,
      desc: "2 Darts: Clear the inner clockwork and outer orbit loop!",
      darts: 2,
      balloons: [
        { key: "GOLD",  x: 0.50, y: 0.38, dir: "RIGHT" },
        { key: "PINK",  x: 0.65, y: 0.38, dir: "DOWN" },
        { key: "RED",   x: 0.65, y: 0.54, dir: "LEFT" },
        { key: "BLUE",  x: 0.35, y: 0.54, dir: "UP" },
        { key: "GREEN", x: 0.35, y: 0.38, dir: "RIGHT" },
        { key: "BOMB",  x: 0.50, y: 0.20, dir: "ALL" },
        { key: "BLUE",  x: 0.82, y: 0.20, dir: "DOWN" },
        { key: "GREEN", x: 0.82, y: 0.72, dir: "LEFT" },
        { key: "RED",   x: 0.18, y: 0.20, dir: "DOWN" },
        { key: "PINK",  x: 0.18, y: 0.72, dir: "RIGHT" },
        { key: "GOLD",  x: 0.50, y: 0.72, dir: "UP" }
      ]
    },
    {
      id: 19,
      name: "The Zigzag Cascade",
      desc: "1 Dart: Trace back and forth down the zig-zag staircase!",
      darts: 1,
      balloons: [
        { key: "RED",   x: 0.20, y: 0.20, dir: "RIGHT" },
        { key: "BLUE",  x: 0.80, y: 0.20, dir: "DOWN" },
        { key: "GREEN", x: 0.80, y: 0.32, dir: "LEFT" },
        { key: "PINK",  x: 0.20, y: 0.32, dir: "DOWN" },
        { key: "GOLD",  x: 0.20, y: 0.44, dir: "RIGHT" },
        { key: "BLUE",  x: 0.80, y: 0.44, dir: "DOWN" },
        { key: "BOMB",  x: 0.80, y: 0.56, dir: "LEFT" },
        { key: "PINK",  x: 0.20, y: 0.56, dir: "DOWN" },
        { key: "GREEN", x: 0.20, y: 0.68, dir: "RIGHT" },
        { key: "GOLD",  x: 0.50, y: 0.68, dir: "RIGHT" },
        { key: "RED",   x: 0.80, y: 0.68, dir: "UP" }
      ]
    },
    {
      id: 20,
      name: "Cross of the Valkyrie",
      desc: "2 Darts: Master vertical triggers and twin perimeter TNTs!",
      darts: 2,
      balloons: [
        { key: "GOLD",  x: 0.50, y: 0.48, dir: "VERT" },
        { key: "RED",   x: 0.50, y: 0.28, dir: "HORIZ" },
        { key: "BLUE",  x: 0.25, y: 0.28, dir: "DOWN" },
        { key: "BLUE",  x: 0.75, y: 0.28, dir: "DOWN" },
        { key: "GREEN", x: 0.25, y: 0.38, dir: "DOWN" },
        { key: "GREEN", x: 0.75, y: 0.38, dir: "DOWN" },
        { key: "PINK",  x: 0.50, y: 0.68, dir: "HORIZ" },
        { key: "GREEN", x: 0.25, y: 0.68, dir: "UP" },
        { key: "GREEN", x: 0.75, y: 0.68, dir: "UP" },
        { key: "BLUE",  x: 0.25, y: 0.58, dir: "UP" },
        { key: "BLUE",  x: 0.75, y: 0.58, dir: "UP" },
        { key: "BOMB",  x: 0.25, y: 0.48, dir: "HORIZ" },
        { key: "BOMB",  x: 0.75, y: 0.48, dir: "HORIZ" },
        { key: "GOLD",  x: 0.12, y: 0.48, dir: "RIGHT" },
        { key: "GOLD",  x: 0.88, y: 0.48, dir: "LEFT" }
      ]
    },
    {
      id: 21,
      name: "The Quantum Core",
      desc: "2 Darts: Twin quantum circuits converging at the core!",
      darts: 2,
      balloons: [
        { key: "BLUE",   x: 0.25, y: 0.32, dir: "DOWN" },
        { key: "PINK",   x: 0.25, y: 0.54, dir: "RIGHT" },
        { key: "BOMB",   x: 0.42, y: 0.54, dir: "ALL" },
        { key: "RED",    x: 0.42, y: 0.32, dir: "LEFT" },
        { key: "GOLD",   x: 0.42, y: 0.72, dir: "UP" },
        { key: "GREEN",  x: 0.75, y: 0.32, dir: "DOWN" },
        { key: "PINK",   x: 0.75, y: 0.54, dir: "LEFT" },
        { key: "BOMB",   x: 0.58, y: 0.54, dir: "ALL" },
        { key: "RED",    x: 0.58, y: 0.32, dir: "RIGHT" },
        { key: "GOLD",   x: 0.58, y: 0.72, dir: "UP" },
        { key: "FREEZE", x: 0.50, y: 0.32, dir: "DOWN" }
      ]
    },
    {
      id: 22,
      name: "Twin Vortex",
      desc: "2 Darts: Opposing clockwise & counter-clockwise whirlwinds!",
      darts: 2,
      balloons: [
        { key: "RED",   x: 0.20, y: 0.30, dir: "RIGHT" },
        { key: "BLUE",  x: 0.42, y: 0.30, dir: "DOWN" },
        { key: "PINK",  x: 0.42, y: 0.56, dir: "LEFT" },
        { key: "GREEN", x: 0.20, y: 0.56, dir: "UP" },
        { key: "GOLD",  x: 0.20, y: 0.43, dir: "RIGHT" },
        { key: "BOMB",  x: 0.42, y: 0.43, dir: "LEFT" },
        { key: "RED",   x: 0.80, y: 0.30, dir: "LEFT" },
        { key: "BLUE",  x: 0.58, y: 0.30, dir: "DOWN" },
        { key: "PINK",  x: 0.58, y: 0.56, dir: "RIGHT" },
        { key: "GREEN", x: 0.80, y: 0.56, dir: "UP" },
        { key: "GOLD",  x: 0.80, y: 0.43, dir: "LEFT" },
        { key: "BOMB",  x: 0.58, y: 0.43, dir: "RIGHT" }
      ]
    },
    {
      id: 23,
      name: "The Labyrinth Box",
      desc: "2 Darts: Loop the outer perimeter then detonate the inner vault!",
      darts: 2,
      balloons: [
        { key: "RED",    x: 0.18, y: 0.20, dir: "RIGHT" },
        { key: "RED",    x: 0.50, y: 0.20, dir: "RIGHT" },
        { key: "BLUE",   x: 0.82, y: 0.20, dir: "DOWN" },
        { key: "BLUE",   x: 0.82, y: 0.45, dir: "DOWN" },
        { key: "GREEN",  x: 0.82, y: 0.70, dir: "LEFT" },
        { key: "GREEN",  x: 0.50, y: 0.70, dir: "LEFT" },
        { key: "PINK",   x: 0.18, y: 0.70, dir: "UP" },
        { key: "PINK",   x: 0.18, y: 0.45, dir: "UP" },
        { key: "BOMB",   x: 0.50, y: 0.45, dir: "ALL" },
        { key: "GOLD",   x: 0.34, y: 0.45, dir: "UP" },
        { key: "FREEZE", x: 0.34, y: 0.32, dir: "RIGHT" },
        { key: "GOLD",   x: 0.66, y: 0.45, dir: "DOWN" },
        { key: "FREEZE", x: 0.66, y: 0.58, dir: "LEFT" },
        { key: "PINK",   x: 0.50, y: 0.32, dir: "LEFT" },
        { key: "PINK",   x: 0.50, y: 0.58, dir: "RIGHT" }
      ]
    },
    {
      id: 24,
      name: "Cosmic Starburst",
      desc: "3 Darts: Tri-tiered bomb explosions cascading across the screen!",
      darts: 3,
      balloons: [
        { key: "RED",   x: 0.20, y: 0.25, dir: "RIGHT" },
        { key: "BOMB",  x: 0.50, y: 0.25, dir: "ALL" },
        { key: "RED",   x: 0.80, y: 0.25, dir: "LEFT" },
        { key: "GOLD",  x: 0.50, y: 0.12, dir: "DOWN" },
        { key: "BLUE",  x: 0.20, y: 0.45, dir: "RIGHT" },
        { key: "BOMB",  x: 0.50, y: 0.45, dir: "ALL" },
        { key: "BLUE",  x: 0.80, y: 0.45, dir: "LEFT" },
        { key: "GREEN", x: 0.35, y: 0.45, dir: "UP" },
        { key: "GREEN", x: 0.65, y: 0.45, dir: "DOWN" },
        { key: "PINK",  x: 0.20, y: 0.65, dir: "RIGHT" },
        { key: "BOMB",  x: 0.50, y: 0.65, dir: "ALL" },
        { key: "PINK",  x: 0.80, y: 0.65, dir: "LEFT" },
        { key: "GOLD",  x: 0.50, y: 0.78, dir: "UP" }
      ]
    },
    {
      id: 25,
      name: "Grand Apex Master Boss",
      isBoss: true,
      desc: "3 Darts: 16 directional balloons! The ultimate grandmaster finale!",
      darts: 3,
      balloons: [
        { key: "RED",    x: 0.25, y: 0.24, dir: "RIGHT" },
        { key: "BOMB",   x: 0.50, y: 0.24, dir: "ALL" },
        { key: "BLUE",   x: 0.75, y: 0.24, dir: "LEFT" },
        { key: "GOLD",   x: 0.50, y: 0.12, dir: "DOWN" },
        { key: "FREEZE", x: 0.18, y: 0.42, dir: "HORIZ" },
        { key: "PINK",   x: 0.34, y: 0.42, dir: "DOWN" },
        { key: "GREEN",  x: 0.34, y: 0.56, dir: "RIGHT" },
        { key: "FREEZE", x: 0.82, y: 0.42, dir: "HORIZ" },
        { key: "PINK",   x: 0.66, y: 0.42, dir: "DOWN" },
        { key: "GREEN",  x: 0.66, y: 0.56, dir: "LEFT" },
        { key: "GOLD",   x: 0.50, y: 0.42, dir: "VERT" },
        { key: "BOMB",   x: 0.50, y: 0.56, dir: "ALL" },
        { key: "BLUE",   x: 0.25, y: 0.70, dir: "RIGHT" },
        { key: "PINK",   x: 0.50, y: 0.70, dir: "HORIZ" },
        { key: "GOLD",   x: 0.25, y: 0.78, dir: "UP" },
        { key: "GOLD",   x: 0.75, y: 0.78, dir: "UP" },
        { key: "RED",    x: 0.75, y: 0.70, dir: "LEFT" }
      ]
    },
{
        id: 26,
        name: "Spiral Galaxy",
        desc: "1 Dart: Clockwise inward spiral funnels directly into the center TNT bomb!",
        darts: 1,
        balloons: [
            {
                key: "RED",
                x: 0.2,
                y: 0.22,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.8,
                y: 0.22,
                dir: "DOWN"
            },
            {
                key: "GREEN",
                x: 0.8,
                y: 0.68,
                dir: "LEFT"
            },
            {
                key: "PINK",
                x: 0.2,
                y: 0.68,
                dir: "UP"
            },
            {
                key: "GOLD",
                x: 0.2,
                y: 0.38,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.65,
                y: 0.38,
                dir: "DOWN"
            },
            {
                key: "GREEN",
                x: 0.65,
                y: 0.52,
                dir: "LEFT"
            },
            {
                key: "BOMB",
                x: 0.38,
                y: 0.52,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.52,
                dir: "UP"
            }
        ]
    },
    {
        id: 27,
        name: "Dual Pendulum",
        desc: "2 Darts: Left and right synchronized swings meet at the horizontal nexus!",
        darts: 2,
        balloons: [
            {
                key: "RED",
                x: 0.22,
                y: 0.22,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.22,
                y: 0.45,
                dir: "RIGHT"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.45,
                dir: "VERT"
            },
            {
                key: "RED",
                x: 0.78,
                y: 0.22,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.78,
                y: 0.45,
                dir: "LEFT"
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.22,
                dir: "HORIZ"
            },
            {
                key: "PINK",
                x: 0.5,
                y: 0.68,
                dir: "HORIZ"
            },
            {
                key: "BOMB",
                x: 0.22,
                y: 0.68,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.78,
                y: 0.68,
                dir: "ALL"
            }
        ]
    },
    {
        id: 28,
        name: "Hall of Mirrors",
        desc: "2 Darts: Symmetrical reflected lasers trigger the ceiling bomb pair!",
        darts: 2,
        balloons: [
            {
                key: "PINK",
                x: 0.2,
                y: 0.65,
                dir: "RIGHT"
            },
            {
                key: "GREEN",
                x: 0.4,
                y: 0.65,
                dir: "UP"
            },
            {
                key: "BOMB",
                x: 0.4,
                y: 0.3,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.2,
                y: 0.3,
                dir: "RIGHT"
            },
            {
                key: "PINK",
                x: 0.8,
                y: 0.65,
                dir: "LEFT"
            },
            {
                key: "GREEN",
                x: 0.6,
                y: 0.65,
                dir: "UP"
            },
            {
                key: "BOMB",
                x: 0.6,
                y: 0.3,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.8,
                y: 0.3,
                dir: "LEFT"
            }
        ]
    },
    {
        id: 29,
        name: "Cross of Fire",
        desc: "1 Dart: Central horizontal beam activates dual vertical booster columns!",
        darts: 1,
        balloons: [
            {
                key: "GOLD",
                x: 0.5,
                y: 0.48,
                dir: "HORIZ"
            },
            {
                key: "RED",
                x: 0.22,
                y: 0.48,
                dir: "UP"
            },
            {
                key: "BLUE",
                x: 0.78,
                y: 0.48,
                dir: "UP"
            },
            {
                key: "GREEN",
                x: 0.22,
                y: 0.26,
                dir: "RIGHT"
            },
            {
                key: "GREEN",
                x: 0.78,
                y: 0.26,
                dir: "LEFT"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.26,
                dir: "ALL"
            },
            {
                key: "PINK",
                x: 0.5,
                y: 0.12,
                dir: "DOWN"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.7,
                dir: "ALL"
            }
        ]
    },
    {
        id: 30,
        name: "Blimp Core Mid-Boss",
        desc: "2 Darts: High-difficulty Mid-Boss! Shatter outer ring then ignite core!",
        darts: 2,
        isMidBoss: true,
        balloons: [
            {
                key: "FREEZE",
                x: 0.5,
                y: 0.2,
                dir: "HORIZ"
            },
            {
                key: "RED",
                x: 0.2,
                y: 0.2,
                dir: "DOWN"
            },
            {
                key: "RED",
                x: 0.8,
                y: 0.2,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.2,
                y: 0.5,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.8,
                y: 0.5,
                dir: "LEFT"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.5,
                dir: "ALL"
            },
            {
                key: "GREEN",
                x: 0.35,
                y: 0.35,
                dir: "DOWN"
            },
            {
                key: "GREEN",
                x: 0.65,
                y: 0.35,
                dir: "DOWN"
            },
            {
                key: "PINK",
                x: 0.35,
                y: 0.65,
                dir: "RIGHT"
            },
            {
                key: "PINK",
                x: 0.65,
                y: 0.65,
                dir: "UP"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.65,
                dir: "HORIZ"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.78,
                dir: "UP"
            }
        ]
    },
    {
        id: 31,
        name: "Prism Shards",
        desc: "2 Darts: Double freeze crystals fracture lasers into diagonal quadrants!",
        darts: 2,
        balloons: [
            {
                key: "FREEZE",
                x: 0.35,
                y: 0.3,
                dir: "HORIZ"
            },
            {
                key: "RED",
                x: 0.18,
                y: 0.3,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.18,
                y: 0.6,
                dir: "RIGHT"
            },
            {
                key: "FREEZE",
                x: 0.65,
                y: 0.3,
                dir: "HORIZ"
            },
            {
                key: "RED",
                x: 0.82,
                y: 0.3,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.82,
                y: 0.6,
                dir: "LEFT"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.6,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.4,
                dir: "VERT"
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.2,
                dir: "DOWN"
            }
        ]
    },
    {
        id: 32,
        name: "Quad TNT Grid",
        desc: "2 Darts: 4 corner bomb stations! Trigger the perimeter needle circuit!",
        darts: 2,
        balloons: [
            {
                key: "BOMB",
                x: 0.22,
                y: 0.24,
                dir: "ALL"
            },
            {
                key: "BLUE",
                x: 0.5,
                y: 0.24,
                dir: "RIGHT"
            },
            {
                key: "BOMB",
                x: 0.78,
                y: 0.24,
                dir: "ALL"
            },
            {
                key: "RED",
                x: 0.78,
                y: 0.48,
                dir: "DOWN"
            },
            {
                key: "BOMB",
                x: 0.78,
                y: 0.72,
                dir: "ALL"
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.72,
                dir: "LEFT"
            },
            {
                key: "BOMB",
                x: 0.22,
                y: 0.72,
                dir: "ALL"
            },
            {
                key: "PINK",
                x: 0.22,
                y: 0.48,
                dir: "UP"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.48,
                dir: "ALL"
            }
        ]
    },
    {
        id: 33,
        name: "Staircase of Solitude",
        desc: "1 Dart: Trace step-by-step from bottom-left all the way to high heaven!",
        darts: 1,
        balloons: [
            {
                key: "RED",
                x: 0.18,
                y: 0.72,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.34,
                y: 0.72,
                dir: "UP"
            },
            {
                key: "GREEN",
                x: 0.34,
                y: 0.56,
                dir: "RIGHT"
            },
            {
                key: "PINK",
                x: 0.5,
                y: 0.56,
                dir: "UP"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.4,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.66,
                y: 0.4,
                dir: "UP"
            },
            {
                key: "BOMB",
                x: 0.66,
                y: 0.24,
                dir: "ALL"
            },
            {
                key: "RED",
                x: 0.82,
                y: 0.24,
                dir: "DOWN"
            },
            {
                key: "GOLD",
                x: 0.82,
                y: 0.56,
                dir: "LEFT"
            }
        ]
    },
    {
        id: 34,
        name: "Phoenix Wings",
        desc: "2 Darts: Left wing and right wing sweep inward to apex gold core!",
        darts: 2,
        balloons: [
            {
                key: "PINK",
                x: 0.16,
                y: 0.32,
                dir: "DOWN"
            },
            {
                key: "RED",
                x: 0.16,
                y: 0.6,
                dir: "RIGHT"
            },
            {
                key: "GREEN",
                x: 0.36,
                y: 0.6,
                dir: "UP"
            },
            {
                key: "PINK",
                x: 0.84,
                y: 0.32,
                dir: "DOWN"
            },
            {
                key: "RED",
                x: 0.84,
                y: 0.6,
                dir: "LEFT"
            },
            {
                key: "GREEN",
                x: 0.64,
                y: 0.6,
                dir: "UP"
            },
            {
                key: "BOMB",
                x: 0.36,
                y: 0.32,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.64,
                y: 0.32,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.32,
                dir: "VERT"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.6,
                dir: "UP"
            }
        ]
    },
    {
        id: 35,
        name: "Apex Sovereign Boss",
        desc: "3 Darts: Difficult Boss! 16-node tactical matrix with dual bomb rings!",
        darts: 3,
        isBoss: true,
        balloons: [
            {
                key: "GOLD",
                x: 0.5,
                y: 0.15,
                dir: "DOWN"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.3,
                dir: "ALL"
            },
            {
                key: "RED",
                x: 0.22,
                y: 0.3,
                dir: "RIGHT"
            },
            {
                key: "RED",
                x: 0.78,
                y: 0.3,
                dir: "LEFT"
            },
            {
                key: "FREEZE",
                x: 0.22,
                y: 0.45,
                dir: "HORIZ"
            },
            {
                key: "BLUE",
                x: 0.38,
                y: 0.45,
                dir: "DOWN"
            },
            {
                key: "FREEZE",
                x: 0.78,
                y: 0.45,
                dir: "HORIZ"
            },
            {
                key: "BLUE",
                x: 0.62,
                y: 0.45,
                dir: "DOWN"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.58,
                dir: "ALL"
            },
            {
                key: "GREEN",
                x: 0.38,
                y: 0.58,
                dir: "RIGHT"
            },
            {
                key: "GREEN",
                x: 0.62,
                y: 0.58,
                dir: "LEFT"
            },
            {
                key: "PINK",
                x: 0.22,
                y: 0.72,
                dir: "RIGHT"
            },
            {
                key: "PINK",
                x: 0.78,
                y: 0.72,
                dir: "LEFT"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.72,
                dir: "UP"
            },
            {
                key: "GOLD",
                x: 0.38,
                y: 0.3,
                dir: "DOWN"
            },
            {
                key: "GOLD",
                x: 0.62,
                y: 0.3,
                dir: "DOWN"
            }
        ]
    },
    {
        id: 36,
        name: "The Hourglass",
        desc: "2 Darts: Top chamber funnels through center choke into lower reservoir!",
        darts: 2,
        balloons: [
            {
                key: "RED",
                x: 0.25,
                y: 0.22,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.75,
                y: 0.22,
                dir: "LEFT"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.22,
                dir: "DOWN"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.45,
                dir: "ALL"
            },
            {
                key: "GREEN",
                x: 0.3,
                y: 0.65,
                dir: "RIGHT"
            },
            {
                key: "PINK",
                x: 0.7,
                y: 0.65,
                dir: "LEFT"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.65,
                dir: "UP"
            },
            {
                key: "BLUE",
                x: 0.5,
                y: 0.78,
                dir: "UP"
            }
        ]
    },
    {
        id: 37,
        name: "Trinity Rings",
        desc: "3 Darts: 3 interconnected triangular circuits sharing corner nodes!",
        darts: 3,
        balloons: [
            {
                key: "RED",
                x: 0.5,
                y: 0.2,
                dir: "HORIZ"
            },
            {
                key: "BLUE",
                x: 0.25,
                y: 0.4,
                dir: "UP"
            },
            {
                key: "BLUE",
                x: 0.75,
                y: 0.4,
                dir: "UP"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.4,
                dir: "ALL"
            },
            {
                key: "GREEN",
                x: 0.25,
                y: 0.65,
                dir: "RIGHT"
            },
            {
                key: "GREEN",
                x: 0.75,
                y: 0.65,
                dir: "LEFT"
            },
            {
                key: "PINK",
                x: 0.5,
                y: 0.65,
                dir: "VERT"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.8,
                dir: "UP"
            }
        ]
    },
    {
        id: 38,
        name: "Laser Labyrinth",
        desc: "2 Darts: 90-degree corner mirrors guide darts across 8 reflection turns!",
        darts: 2,
        balloons: [
            {
                key: "RED",
                x: 0.18,
                y: 0.25,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.18,
                y: 0.55,
                dir: "RIGHT"
            },
            {
                key: "GREEN",
                x: 0.42,
                y: 0.55,
                dir: "UP"
            },
            {
                key: "PINK",
                x: 0.42,
                y: 0.35,
                dir: "RIGHT"
            },
            {
                key: "GOLD",
                x: 0.65,
                y: 0.35,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.65,
                y: 0.68,
                dir: "RIGHT"
            },
            {
                key: "BOMB",
                x: 0.82,
                y: 0.68,
                dir: "ALL"
            },
            {
                key: "RED",
                x: 0.82,
                y: 0.25,
                dir: "LEFT"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.25,
                dir: "DOWN"
            }
        ]
    },
    {
        id: 39,
        name: "Hypercube Array",
        desc: "2 Darts: Nested 4-balloon inner square inside an 8-balloon outer frame!",
        darts: 2,
        balloons: [
            {
                key: "BLUE",
                x: 0.2,
                y: 0.22,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.8,
                y: 0.22,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.8,
                y: 0.7,
                dir: "LEFT"
            },
            {
                key: "BLUE",
                x: 0.2,
                y: 0.7,
                dir: "UP"
            },
            {
                key: "RED",
                x: 0.38,
                y: 0.38,
                dir: "RIGHT"
            },
            {
                key: "RED",
                x: 0.62,
                y: 0.38,
                dir: "DOWN"
            },
            {
                key: "RED",
                x: 0.62,
                y: 0.54,
                dir: "LEFT"
            },
            {
                key: "RED",
                x: 0.38,
                y: 0.54,
                dir: "UP"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.46,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.22,
                dir: "DOWN"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.7,
                dir: "UP"
            }
        ]
    },
    {
        id: 40,
        name: "Nebula Titan Mid-Boss",
        desc: "3 Darts: Tactical Mid-Boss! Twin bomb pylons flank the cosmic core!",
        darts: 3,
        isMidBoss: true,
        balloons: [
            {
                key: "BOMB",
                x: 0.25,
                y: 0.3,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.75,
                y: 0.3,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.3,
                dir: "VERT"
            },
            {
                key: "FREEZE",
                x: 0.5,
                y: 0.16,
                dir: "HORIZ"
            },
            {
                key: "RED",
                x: 0.25,
                y: 0.5,
                dir: "RIGHT"
            },
            {
                key: "RED",
                x: 0.75,
                y: 0.5,
                dir: "LEFT"
            },
            {
                key: "BLUE",
                x: 0.5,
                y: 0.5,
                dir: "HORIZ"
            },
            {
                key: "GREEN",
                x: 0.35,
                y: 0.66,
                dir: "UP"
            },
            {
                key: "GREEN",
                x: 0.65,
                y: 0.66,
                dir: "UP"
            },
            {
                key: "PINK",
                x: 0.5,
                y: 0.66,
                dir: "VERT"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.8,
                dir: "UP"
            },
            {
                key: "RED",
                x: 0.15,
                y: 0.5,
                dir: "RIGHT"
            },
            {
                key: "RED",
                x: 0.85,
                y: 0.5,
                dir: "LEFT"
            }
        ]
    },
    {
        id: 41,
        name: "Sonic Wave",
        desc: "2 Darts: Sinusoidal cascade oscillating across the field!",
        darts: 2,
        balloons: [
            {
                key: "RED",
                x: 0.18,
                y: 0.35,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.18,
                y: 0.6,
                dir: "RIGHT"
            },
            {
                key: "GREEN",
                x: 0.38,
                y: 0.6,
                dir: "UP"
            },
            {
                key: "PINK",
                x: 0.38,
                y: 0.35,
                dir: "RIGHT"
            },
            {
                key: "GOLD",
                x: 0.62,
                y: 0.35,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.62,
                y: 0.6,
                dir: "RIGHT"
            },
            {
                key: "BOMB",
                x: 0.82,
                y: 0.6,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.82,
                y: 0.35,
                dir: "LEFT"
            },
            {
                key: "PINK",
                x: 0.5,
                y: 0.48,
                dir: "HORIZ"
            }
        ]
    },
    {
        id: 42,
        name: "Cascade Waterfall",
        desc: "1 Dart: Single top domino triggers vertical plunge that bursts horizontally!",
        darts: 1,
        balloons: [
            {
                key: "GOLD",
                x: 0.5,
                y: 0.18,
                dir: "DOWN"
            },
            {
                key: "RED",
                x: 0.5,
                y: 0.34,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.5,
                y: 0.5,
                dir: "DOWN"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.66,
                dir: "ALL"
            },
            {
                key: "GREEN",
                x: 0.22,
                y: 0.66,
                dir: "UP"
            },
            {
                key: "GREEN",
                x: 0.78,
                y: 0.66,
                dir: "UP"
            },
            {
                key: "PINK",
                x: 0.22,
                y: 0.34,
                dir: "RIGHT"
            },
            {
                key: "PINK",
                x: 0.78,
                y: 0.34,
                dir: "LEFT"
            }
        ]
    },
    {
        id: 43,
        name: "Infinity Gate",
        desc: "2 Darts: Figure-8 double circuit intersecting at the central nexus!",
        darts: 2,
        balloons: [
            {
                key: "RED",
                x: 0.3,
                y: 0.25,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.7,
                y: 0.25,
                dir: "DOWN"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.45,
                dir: "ALL"
            },
            {
                key: "GREEN",
                x: 0.3,
                y: 0.65,
                dir: "UP"
            },
            {
                key: "PINK",
                x: 0.7,
                y: 0.65,
                dir: "LEFT"
            },
            {
                key: "BOMB",
                x: 0.3,
                y: 0.45,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.7,
                y: 0.45,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.25,
                dir: "DOWN"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.65,
                dir: "UP"
            }
        ]
    },
    {
        id: 44,
        name: "Solar Flares",
        desc: "2 Darts: Center radiant sun bursts rays outward into 8 orbiting satellites!",
        darts: 2,
        balloons: [
            {
                key: "BOMB",
                x: 0.5,
                y: 0.45,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.2,
                dir: "DOWN"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.7,
                dir: "UP"
            },
            {
                key: "GOLD",
                x: 0.2,
                y: 0.45,
                dir: "RIGHT"
            },
            {
                key: "GOLD",
                x: 0.8,
                y: 0.45,
                dir: "LEFT"
            },
            {
                key: "RED",
                x: 0.28,
                y: 0.28,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.72,
                y: 0.28,
                dir: "DOWN"
            },
            {
                key: "GREEN",
                x: 0.72,
                y: 0.62,
                dir: "LEFT"
            },
            {
                key: "PINK",
                x: 0.28,
                y: 0.62,
                dir: "UP"
            }
        ]
    },
    {
        id: 45,
        name: "Dreadnought Mid-Boss",
        desc: "3 Darts: Heavy Mid-Boss! 15 directional balloons protecting triple bomb array!",
        darts: 3,
        isMidBoss: true,
        balloons: [
            {
                key: "BOMB",
                x: 0.5,
                y: 0.22,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.3,
                y: 0.46,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.7,
                y: 0.46,
                dir: "ALL"
            },
            {
                key: "FREEZE",
                x: 0.5,
                y: 0.46,
                dir: "VERT"
            },
            {
                key: "RED",
                x: 0.16,
                y: 0.22,
                dir: "RIGHT"
            },
            {
                key: "RED",
                x: 0.84,
                y: 0.22,
                dir: "LEFT"
            },
            {
                key: "BLUE",
                x: 0.16,
                y: 0.46,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.84,
                y: 0.46,
                dir: "DOWN"
            },
            {
                key: "GREEN",
                x: 0.3,
                y: 0.68,
                dir: "RIGHT"
            },
            {
                key: "GREEN",
                x: 0.7,
                y: 0.68,
                dir: "LEFT"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.68,
                dir: "UP"
            },
            {
                key: "PINK",
                x: 0.16,
                y: 0.68,
                dir: "RIGHT"
            },
            {
                key: "PINK",
                x: 0.84,
                y: 0.68,
                dir: "LEFT"
            },
            {
                key: "GOLD",
                x: 0.3,
                y: 0.22,
                dir: "DOWN"
            },
            {
                key: "GOLD",
                x: 0.7,
                y: 0.22,
                dir: "DOWN"
            }
        ]
    },
    {
        id: 46,
        name: "Clockwork Gears",
        desc: "2 Darts: Twin interlocking cogs rotating clockwise and counter-clockwise!",
        darts: 2,
        balloons: [
            {
                key: "RED",
                x: 0.3,
                y: 0.28,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.5,
                y: 0.28,
                dir: "DOWN"
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.48,
                dir: "LEFT"
            },
            {
                key: "PINK",
                x: 0.3,
                y: 0.48,
                dir: "UP"
            },
            {
                key: "RED",
                x: 0.7,
                y: 0.48,
                dir: "DOWN"
            },
            {
                key: "BLUE",
                x: 0.7,
                y: 0.68,
                dir: "LEFT"
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.68,
                dir: "UP"
            },
            {
                key: "BOMB",
                x: 0.4,
                y: 0.38,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.6,
                y: 0.58,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.7,
                y: 0.28,
                dir: "DOWN"
            }
        ]
    },
    {
        id: 47,
        name: "Diamond Citadel",
        desc: "2 Darts: Double diamond perimeter shielding the inner golden treasury!",
        darts: 2,
        balloons: [
            {
                key: "GOLD",
                x: 0.5,
                y: 0.45,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.25,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.65,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.3,
                y: 0.45,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.7,
                y: 0.45,
                dir: "ALL"
            },
            {
                key: "BLUE",
                x: 0.2,
                y: 0.25,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.8,
                y: 0.25,
                dir: "LEFT"
            },
            {
                key: "RED",
                x: 0.2,
                y: 0.65,
                dir: "RIGHT"
            },
            {
                key: "RED",
                x: 0.8,
                y: 0.65,
                dir: "LEFT"
            },
            {
                key: "PINK",
                x: 0.5,
                y: 0.12,
                dir: "DOWN"
            },
            {
                key: "PINK",
                x: 0.5,
                y: 0.78,
                dir: "UP"
            }
        ]
    },
    {
        id: 48,
        name: "Quantum Entanglement",
        desc: "2 Darts: Cross-quadrant mirrors where each popped node triggers its twin!",
        darts: 2,
        balloons: [
            {
                key: "RED",
                x: 0.22,
                y: 0.25,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.78,
                y: 0.25,
                dir: "DOWN"
            },
            {
                key: "GREEN",
                x: 0.78,
                y: 0.65,
                dir: "LEFT"
            },
            {
                key: "PINK",
                x: 0.22,
                y: 0.65,
                dir: "UP"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.25,
                dir: "VERT"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.65,
                dir: "VERT"
            },
            {
                key: "BOMB",
                x: 0.22,
                y: 0.45,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.78,
                y: 0.45,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.45,
                dir: "HORIZ"
            }
        ]
    },
    {
        id: 49,
        name: "Celestial Compass",
        desc: "3 Darts: 8-point nautical star with multi-stage cascade reactions!",
        darts: 3,
        balloons: [
            {
                key: "GOLD",
                x: 0.5,
                y: 0.15,
                dir: "DOWN"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.75,
                dir: "UP"
            },
            {
                key: "GOLD",
                x: 0.18,
                y: 0.45,
                dir: "RIGHT"
            },
            {
                key: "GOLD",
                x: 0.82,
                y: 0.45,
                dir: "LEFT"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.45,
                dir: "ALL"
            },
            {
                key: "RED",
                x: 0.32,
                y: 0.3,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.68,
                y: 0.3,
                dir: "DOWN"
            },
            {
                key: "GREEN",
                x: 0.68,
                y: 0.6,
                dir: "LEFT"
            },
            {
                key: "PINK",
                x: 0.32,
                y: 0.6,
                dir: "UP"
            },
            {
                key: "RED",
                x: 0.5,
                y: 0.3,
                dir: "HORIZ"
            },
            {
                key: "BLUE",
                x: 0.5,
                y: 0.6,
                dir: "HORIZ"
            }
        ]
    },
    {
        id: 50,
        name: "Grand Zenith Apex Sovereign",
        desc: "4 Darts: The Grand Finale! 20-node masterwork grid of cascading fireworks!",
        darts: 4,
        isBoss: true,
        balloons: [
            {
                key: "GOLD",
                x: 0.5,
                y: 0.12,
                dir: "DOWN"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.26,
                dir: "ALL"
            },
            {
                key: "RED",
                x: 0.22,
                y: 0.26,
                dir: "RIGHT"
            },
            {
                key: "RED",
                x: 0.78,
                y: 0.26,
                dir: "LEFT"
            },
            {
                key: "FREEZE",
                x: 0.22,
                y: 0.42,
                dir: "HORIZ"
            },
            {
                key: "FREEZE",
                x: 0.78,
                y: 0.42,
                dir: "HORIZ"
            },
            {
                key: "BOMB",
                x: 0.38,
                y: 0.42,
                dir: "ALL"
            },
            {
                key: "BOMB",
                x: 0.62,
                y: 0.42,
                dir: "ALL"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.42,
                dir: "VERT"
            },
            {
                key: "BLUE",
                x: 0.15,
                y: 0.56,
                dir: "RIGHT"
            },
            {
                key: "BLUE",
                x: 0.85,
                y: 0.56,
                dir: "LEFT"
            },
            {
                key: "GREEN",
                x: 0.38,
                y: 0.56,
                dir: "DOWN"
            },
            {
                key: "GREEN",
                x: 0.62,
                y: 0.56,
                dir: "DOWN"
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.56,
                dir: "ALL"
            },
            {
                key: "PINK",
                x: 0.22,
                y: 0.7,
                dir: "RIGHT"
            },
            {
                key: "PINK",
                x: 0.78,
                y: 0.7,
                dir: "LEFT"
            },
            {
                key: "GOLD",
                x: 0.38,
                y: 0.7,
                dir: "UP"
            },
            {
                key: "GOLD",
                x: 0.62,
                y: 0.7,
                dir: "UP"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.7,
                dir: "UP"
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.82,
                dir: "UP"
            }
        ]
    }
  ],
  SLING_STAGES: [
    {
      id: 1,
      name: "The Straight Pierce",
      desc: "2 Arrows: Aim straight through the row of 3 balloons!",
      arrows: 2,
      balloons: [
        { key: "RED", x: 0.50, y: 0.24 },
        { key: "RED", x: 0.50, y: 0.38 },
        { key: "RED", x: 0.50, y: 0.52 }
      ]
    },
    {
      id: 2,
      name: "TNT Barrel Blast",
      desc: "2 Arrows: Hit the center TNT Bomb to clear the ring!",
      arrows: 2,
      balloons: [
        { key: "BOMB",  x: 0.50, y: 0.38 },
        { key: "BLUE",  x: 0.34, y: 0.30 },
        { key: "BLUE",  x: 0.66, y: 0.30 },
        { key: "PINK",  x: 0.28, y: 0.46 },
        { key: "PINK",  x: 0.72, y: 0.46 },
        { key: "GREEN", x: 0.50, y: 0.54 }
      ]
    },
    {
      id: 3,
      name: "Wall Bounce Bank",
      desc: "2 Arrows: Bank off the left or right wall for a trickshot!",
      arrows: 2,
      balloons: [
        { key: "GOLD",  x: 0.18, y: 0.26 },
        { key: "GOLD",  x: 0.82, y: 0.26 },
        { key: "RED",   x: 0.18, y: 0.42 },
        { key: "RED",   x: 0.82, y: 0.42 }
      ]
    },
    {
      id: 4,
      name: "The Arc Bridge",
      desc: "2 Arrows: Match the gravity curve to pierce all 5!",
      arrows: 2,
      balloons: [
        { key: "BLUE",  x: 0.24, y: 0.44 },
        { key: "BLUE",  x: 0.37, y: 0.32 },
        { key: "GOLD",  x: 0.50, y: 0.26 },
        { key: "BLUE",  x: 0.63, y: 0.32 },
        { key: "BLUE",  x: 0.76, y: 0.44 }
      ]
    },
    {
      id: 5,
      name: "Pyramid Stack",
      desc: "2 Arrows: Hit the TNT foundation to topple the pyramid!",
      arrows: 2,
      balloons: [
        { key: "BOMB",  x: 0.50, y: 0.54 },
        { key: "GREEN", x: 0.36, y: 0.42 },
        { key: "GREEN", x: 0.64, y: 0.42 },
        { key: "PINK",  x: 0.43, y: 0.30 },
        { key: "PINK",  x: 0.57, y: 0.30 },
        { key: "GOLD",  x: 0.50, y: 0.18 }
      ]
    },
    {
      id: 6,
      name: "Twin Pillars",
      desc: "2 Arrows: 1 piercing arrow down each pillar!",
      arrows: 2,
      balloons: [
        { key: "RED",  x: 0.30, y: 0.24 },
        { key: "RED",  x: 0.30, y: 0.38 },
        { key: "RED",  x: 0.30, y: 0.52 },
        { key: "BLUE", x: 0.70, y: 0.24 },
        { key: "BLUE", x: 0.70, y: 0.38 },
        { key: "BLUE", x: 0.70, y: 0.52 }
      ]
    },
    {
      id: 7,
      name: "The Cross Target",
      desc: "2 Arrows: Split shot into the central Bomb!",
      arrows: 2,
      balloons: [
        { key: "BOMB",   x: 0.50, y: 0.40 },
        { key: "FREEZE", x: 0.50, y: 0.22 },
        { key: "FREEZE", x: 0.50, y: 0.58 },
        { key: "PINK",   x: 0.24, y: 0.40 },
        { key: "PINK",   x: 0.76, y: 0.40 }
      ]
    },
    {
      id: 8,
      name: "Sub-Zero Corridor",
      desc: "2 Arrows: Shatter with Freeze to unleash the double chain!",
      arrows: 2,
      balloons: [
        { key: "FREEZE", x: 0.50, y: 0.32 },
        { key: "BOMB",   x: 0.32, y: 0.48 },
        { key: "BOMB",   x: 0.68, y: 0.48 },
        { key: "GOLD",   x: 0.50, y: 0.18 },
        { key: "GREEN",  x: 0.20, y: 0.32 },
        { key: "GREEN",  x: 0.80, y: 0.32 }
      ]
    },
    {
      id: 9,
      name: "Double TNT Vault",
      desc: "2 Arrows: Trigger both explosive vaults!",
      arrows: 2,
      balloons: [
        { key: "BOMB", x: 0.35, y: 0.36 },
        { key: "BOMB", x: 0.65, y: 0.36 },
        { key: "RED",  x: 0.20, y: 0.24 },
        { key: "RED",  x: 0.50, y: 0.24 },
        { key: "RED",  x: 0.80, y: 0.24 },
        { key: "BLUE", x: 0.35, y: 0.52 },
        { key: "BLUE", x: 0.65, y: 0.52 }
      ]
    },
    {
      id: 10,
      name: "Carnival Blimp Mid-Boss",
      desc: "4 Arrows: Defeat the Mini Blimp (5 HP) & clear 11 targets!",
      arrows: 4,
      isMidBoss: true,
      bossHp: 5,
      balloons: [
        { key: "BOMB",  x: 0.50, y: 0.38 },
        { key: "GOLD",  x: 0.35, y: 0.24 },
        { key: "GOLD",  x: 0.65, y: 0.24 },
        { key: "RED",   x: 0.20, y: 0.38 },
        { key: "RED",   x: 0.80, y: 0.38 },
        { key: "BLUE",  x: 0.35, y: 0.52 },
        { key: "BLUE",  x: 0.65, y: 0.52 },
        { key: "PINK",  x: 0.50, y: 0.20 },
        { key: "PINK",  x: 0.50, y: 0.56 },
        { key: "GREEN", x: 0.20, y: 0.56 },
        { key: "GREEN", x: 0.80, y: 0.56 }
      ]
    },
    {
      id: 11,
      name: "Ice Fortress",
      desc: "3 Arrows: Shatter through barriers to reach inner targets!",
      arrows: 3,
      balloons: [
        { key: "FREEZE", x: 0.50, y: 0.30 },
        { key: "GOLD",   x: 0.50, y: 0.18 },
        { key: "RED",    x: 0.30, y: 0.30 },
        { key: "RED",    x: 0.70, y: 0.30 },
        { key: "BLUE",   x: 0.40, y: 0.44 },
        { key: "BLUE",   x: 0.60, y: 0.44 }
      ]
    },
    {
      id: 12,
      name: "Double Wall Bank",
      desc: "3 Arrows: Bank arrow off left and right walls for trickshots!",
      arrows: 3,
      balloons: [
        { key: "GOLD",  x: 0.15, y: 0.24 },
        { key: "GOLD",  x: 0.85, y: 0.24 },
        { key: "BOMB",  x: 0.15, y: 0.42 },
        { key: "BOMB",  x: 0.85, y: 0.42 },
        { key: "RED",   x: 0.50, y: 0.20 }
      ]
    },
    {
      id: 13,
      name: "TNT Domino Cascade",
      desc: "2 Arrows: Trigger the explosive domino chain!",
      arrows: 2,
      balloons: [
        { key: "BOMB",  x: 0.30, y: 0.48 },
        { key: "BOMB",  x: 0.50, y: 0.36 },
        { key: "BOMB",  x: 0.70, y: 0.24 },
        { key: "GREEN", x: 0.20, y: 0.48 },
        { key: "PINK",  x: 0.80, y: 0.24 },
        { key: "GOLD",  x: 0.50, y: 0.20 }
      ]
    },
    {
      id: 14,
      name: "The Triple Pillar",
      desc: "3 Arrows: 3 vertical columns of pure targets!",
      arrows: 3,
      balloons: [
        { key: "RED",   x: 0.25, y: 0.24 },
        { key: "RED",   x: 0.25, y: 0.38 },
        { key: "RED",   x: 0.25, y: 0.52 },
        { key: "GOLD",  x: 0.50, y: 0.20 },
        { key: "BOMB",  x: 0.50, y: 0.34 },
        { key: "GOLD",  x: 0.50, y: 0.48 },
        { key: "BLUE",  x: 0.75, y: 0.24 },
        { key: "BLUE",  x: 0.75, y: 0.38 },
        { key: "BLUE",  x: 0.75, y: 0.52 }
      ]
    },
    {
      id: 15,
      name: "Frozen Citadel",
      desc: "3 Arrows: Freeze blasts clear the exterior shield!",
      arrows: 3,
      balloons: [
        { key: "FREEZE", x: 0.35, y: 0.35 },
        { key: "FREEZE", x: 0.65, y: 0.35 },
        { key: "BOMB",   x: 0.50, y: 0.46 },
        { key: "GOLD",   x: 0.50, y: 0.22 },
        { key: "PINK",   x: 0.20, y: 0.24 },
        { key: "PINK",   x: 0.80, y: 0.24 },
        { key: "GREEN",  x: 0.50, y: 0.58 }
      ]
    },
    {
      id: 16,
      name: "The Orbiting Crown",
      desc: "3 Arrows: Golden crown formation surrounding a TNT core!",
      arrows: 3,
      balloons: [
        { key: "BOMB",  x: 0.50, y: 0.36 },
        { key: "GOLD",  x: 0.36, y: 0.22 },
        { key: "GOLD",  x: 0.50, y: 0.18 },
        { key: "GOLD",  x: 0.64, y: 0.22 },
        { key: "BLUE",  x: 0.28, y: 0.36 },
        { key: "BLUE",  x: 0.72, y: 0.36 },
        { key: "RED",   x: 0.36, y: 0.50 },
        { key: "RED",   x: 0.64, y: 0.50 }
      ]
    },
    {
      id: 17,
      name: "Ricochet Alley",
      desc: "3 Arrows: Double bounce trickshots required!",
      arrows: 3,
      balloons: [
        { key: "RED",   x: 0.16, y: 0.20 },
        { key: "RED",   x: 0.84, y: 0.20 },
        { key: "BLUE",  x: 0.16, y: 0.34 },
        { key: "BLUE",  x: 0.84, y: 0.34 },
        { key: "GOLD",  x: 0.50, y: 0.28 },
        { key: "BOMB",  x: 0.50, y: 0.42 }
      ]
    },
    {
      id: 18,
      name: "Sub-Zero Vault",
      desc: "3 Arrows: Dual freeze keys to blast the vault!",
      arrows: 3,
      balloons: [
        { key: "FREEZE", x: 0.30, y: 0.28 },
        { key: "FREEZE", x: 0.70, y: 0.28 },
        { key: "BOMB",   x: 0.50, y: 0.36 },
        { key: "PINK",   x: 0.20, y: 0.42 },
        { key: "PINK",   x: 0.80, y: 0.42 },
        { key: "GOLD",   x: 0.40, y: 0.50 },
        { key: "GOLD",   x: 0.60, y: 0.50 }
      ]
    },
    {
      id: 19,
      name: "The Grand Matrix",
      desc: "4 Arrows: 12 targets in a magnificent 3x4 grid!",
      arrows: 4,
      balloons: [
        { key: "RED",   x: 0.25, y: 0.20 },
        { key: "GOLD",  x: 0.50, y: 0.20 },
        { key: "RED",   x: 0.75, y: 0.20 },
        { key: "BLUE",  x: 0.25, y: 0.32 },
        { key: "BOMB",  x: 0.50, y: 0.32 },
        { key: "BLUE",  x: 0.75, y: 0.32 },
        { key: "GREEN", x: 0.25, y: 0.44 },
        { key: "BOMB",  x: 0.50, y: 0.44 },
        { key: "GREEN", x: 0.75, y: 0.44 },
        { key: "PINK",  x: 0.25, y: 0.56 },
        { key: "GOLD",  x: 0.50, y: 0.56 },
        { key: "PINK",  x: 0.75, y: 0.56 }
      ]
    },
    {
      id: 20,
      name: "Armored Blimp Mid-Boss",
      desc: "4 Arrows: Defeat the Armored Mid-Boss (6 HP) & breach fort!",
      arrows: 4,
      isMidBoss: true,
      bossHp: 6,
      balloons: [
        { key: "BOMB",   x: 0.50, y: 0.36 },
        { key: "FREEZE", x: 0.35, y: 0.24 },
        { key: "FREEZE", x: 0.65, y: 0.24 },
        { key: "GOLD",   x: 0.50, y: 0.18 },
        { key: "RED",    x: 0.20, y: 0.36 },
        { key: "RED",    x: 0.80, y: 0.36 },
        { key: "BLUE",   x: 0.35, y: 0.48 },
        { key: "BLUE",   x: 0.65, y: 0.48 },
        { key: "GREEN",  x: 0.50, y: 0.56 }
      ]
    },
    {
      id: 21,
      name: "Twin Diamond Peaks",
      desc: "3 Arrows: Double diamond targets requiring clean center shots!",
      arrows: 3,
      balloons: [
        { key: "RED",  x: 0.30, y: 0.22 },
        { key: "GOLD", x: 0.20, y: 0.32 },
        { key: "GOLD", x: 0.40, y: 0.32 },
        { key: "BOMB", x: 0.30, y: 0.42 },
        { key: "BLUE", x: 0.70, y: 0.22 },
        { key: "GOLD", x: 0.60, y: 0.32 },
        { key: "GOLD", x: 0.80, y: 0.32 },
        { key: "BOMB", x: 0.70, y: 0.42 }
      ]
    },
    {
      id: 22,
      name: "The Slalom Course",
      desc: "3 Arrows: S-curved obstacle course testing your aim arc!",
      arrows: 3,
      balloons: [
        { key: "RED",   x: 0.25, y: 0.20 },
        { key: "BLUE",  x: 0.45, y: 0.28 },
        { key: "BOMB",  x: 0.65, y: 0.36 },
        { key: "GREEN", x: 0.45, y: 0.44 },
        { key: "PINK",  x: 0.25, y: 0.52 },
        { key: "GOLD",  x: 0.75, y: 0.22 }
      ]
    },
    {
      id: 23,
      name: "Double Helix",
      desc: "4 Arrows: Interlocking twin spirals of candy balloons!",
      arrows: 4,
      balloons: [
        { key: "RED",   x: 0.35, y: 0.18 },
        { key: "BLUE",  x: 0.65, y: 0.18 },
        { key: "BOMB",  x: 0.50, y: 0.26 },
        { key: "BLUE",  x: 0.35, y: 0.34 },
        { key: "RED",   x: 0.65, y: 0.34 },
        { key: "BOMB",  x: 0.50, y: 0.42 },
        { key: "GREEN", x: 0.35, y: 0.50 },
        { key: "PINK",  x: 0.65, y: 0.50 },
        { key: "GOLD",  x: 0.50, y: 0.58 }
      ]
    },
    {
      id: 24,
      name: "Explosive Crossfire",
      desc: "4 Arrows: Quad bombs guarding the inner gold treasure!",
      arrows: 4,
      balloons: [
        { key: "GOLD", x: 0.50, y: 0.36 },
        { key: "BOMB", x: 0.50, y: 0.22 },
        { key: "BOMB", x: 0.50, y: 0.50 },
        { key: "BOMB", x: 0.30, y: 0.36 },
        { key: "BOMB", x: 0.70, y: 0.36 },
        { key: "RED",  x: 0.20, y: 0.22 },
        { key: "RED",  x: 0.80, y: 0.22 },
        { key: "BLUE", x: 0.20, y: 0.50 },
        { key: "BLUE", x: 0.80, y: 0.50 }
      ]
    },
    {
      id: 25,
      name: "Grand Archery Titan Boss",
      desc: "6 Arrows: Defeat Apex Titan Boss (8 HP) & clear 15 targets!",
      arrows: 6,
      isBoss: true,
      bossHp: 8,
      balloons: [
        { key: "GOLD",   x: 0.50, y: 0.16 },
        { key: "FREEZE", x: 0.35, y: 0.24 },
        { key: "FREEZE", x: 0.65, y: 0.24 },
        { key: "BOMB",   x: 0.50, y: 0.32 },
        { key: "RED",    x: 0.20, y: 0.28 },
        { key: "RED",    x: 0.80, y: 0.28 },
        { key: "BLUE",   x: 0.20, y: 0.42 },
        { key: "BLUE",   x: 0.80, y: 0.42 },
        { key: "BOMB",   x: 0.35, y: 0.46 },
        { key: "BOMB",   x: 0.65, y: 0.46 },
        { key: "PINK",   x: 0.50, y: 0.46 },
        { key: "GREEN",  x: 0.25, y: 0.56 },
        { key: "GREEN",  x: 0.75, y: 0.56 },
        { key: "GOLD",   x: 0.40, y: 0.58 },
        { key: "GOLD",   x: 0.60, y: 0.58 }
      ]
    },
{
        id: 26,
        name: "Ricochet Canyon",
        desc: "3 Arrows: Bank your shots off the left and right canyon walls!",
        arrows: 3,
        balloons: [
            {
                key: "GOLD",
                x: 0.16,
                y: 0.22
            },
            {
                key: "GOLD",
                x: 0.84,
                y: 0.22
            },
            {
                key: "RED",
                x: 0.16,
                y: 0.36
            },
            {
                key: "RED",
                x: 0.84,
                y: 0.36
            },
            {
                key: "BLUE",
                x: 0.5,
                y: 0.46
            },
            {
                key: "PINK",
                x: 0.5,
                y: 0.3
            }
        ]
    },
    {
        id: 27,
        name: "The Floating Island",
        desc: "3 Arrows: High-elevation cluster requiring maximum slingshot tension!",
        arrows: 3,
        balloons: [
            {
                key: "GOLD",
                x: 0.5,
                y: 0.16
            },
            {
                key: "FREEZE",
                x: 0.36,
                y: 0.22
            },
            {
                key: "FREEZE",
                x: 0.64,
                y: 0.22
            },
            {
                key: "RED",
                x: 0.25,
                y: 0.28
            },
            {
                key: "RED",
                x: 0.75,
                y: 0.28
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.34
            }
        ]
    },
    {
        id: 28,
        name: "TNT Pendulum",
        desc: "3 Arrows: Center explosive blast will wipe out the orbiting ring!",
        arrows: 3,
        balloons: [
            {
                key: "BOMB",
                x: 0.5,
                y: 0.36
            },
            {
                key: "GOLD",
                x: 0.32,
                y: 0.26
            },
            {
                key: "GOLD",
                x: 0.68,
                y: 0.26
            },
            {
                key: "BLUE",
                x: 0.24,
                y: 0.46
            },
            {
                key: "BLUE",
                x: 0.76,
                y: 0.46
            },
            {
                key: "PINK",
                x: 0.5,
                y: 0.52
            }
        ]
    },
    {
        id: 29,
        name: "Double Barrier Breach",
        desc: "3 Arrows: Shatter through dual ice barriers to reach gold cores!",
        arrows: 3,
        balloons: [
            {
                key: "FREEZE",
                x: 0.35,
                y: 0.38
            },
            {
                key: "FREEZE",
                x: 0.65,
                y: 0.38
            },
            {
                key: "RED",
                x: 0.2,
                y: 0.28
            },
            {
                key: "RED",
                x: 0.8,
                y: 0.28
            },
            {
                key: "GOLD",
                x: 0.35,
                y: 0.22
            },
            {
                key: "GOLD",
                x: 0.65,
                y: 0.22
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.5
            }
        ]
    },
    {
        id: 30,
        name: "Ironclad Blimp Mid-Boss",
        desc: "5 Arrows: Defeat the Ironclad Mid-Boss (8 HP) and destroy its escorts!",
        arrows: 5,
        isMidBoss: true,
        bossHp: 8,
        balloons: [
            {
                key: "BOMB",
                x: 0.25,
                y: 0.38
            },
            {
                key: "BOMB",
                x: 0.75,
                y: 0.38
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.16
            },
            {
                key: "FREEZE",
                x: 0.35,
                y: 0.46
            },
            {
                key: "FREEZE",
                x: 0.65,
                y: 0.46
            },
            {
                key: "RED",
                x: 0.18,
                y: 0.24
            },
            {
                key: "RED",
                x: 0.82,
                y: 0.24
            },
            {
                key: "BLUE",
                x: 0.5,
                y: 0.56
            }
        ]
    },
    {
        id: 31,
        name: "Satellite Orbit",
        desc: "3 Arrows: High arching shots through the gravitational ring!",
        arrows: 3,
        balloons: [
            {
                key: "GOLD",
                x: 0.5,
                y: 0.34
            },
            {
                key: "BLUE",
                x: 0.3,
                y: 0.24
            },
            {
                key: "BLUE",
                x: 0.7,
                y: 0.24
            },
            {
                key: "GREEN",
                x: 0.22,
                y: 0.38
            },
            {
                key: "GREEN",
                x: 0.78,
                y: 0.38
            },
            {
                key: "PINK",
                x: 0.34,
                y: 0.5
            },
            {
                key: "PINK",
                x: 0.66,
                y: 0.5
            }
        ]
    },
    {
        id: 32,
        name: "The Zig-Zag Slalom",
        desc: "4 Arrows: Staggered columns requiring precision left and right wall banks!",
        arrows: 4,
        balloons: [
            {
                key: "RED",
                x: 0.22,
                y: 0.2
            },
            {
                key: "BLUE",
                x: 0.78,
                y: 0.28
            },
            {
                key: "GREEN",
                x: 0.22,
                y: 0.36
            },
            {
                key: "PINK",
                x: 0.78,
                y: 0.44
            },
            {
                key: "GOLD",
                x: 0.22,
                y: 0.52
            },
            {
                key: "GOLD",
                x: 0.78,
                y: 0.6
            }
        ]
    },
    {
        id: 33,
        name: "Triple Explosive Cluster",
        desc: "3 Arrows: 3 tactical TNT clusters ignite massive chained shockwaves!",
        arrows: 3,
        balloons: [
            {
                key: "BOMB",
                x: 0.25,
                y: 0.28
            },
            {
                key: "BOMB",
                x: 0.75,
                y: 0.28
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.48
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.22
            },
            {
                key: "RED",
                x: 0.15,
                y: 0.38
            },
            {
                key: "RED",
                x: 0.85,
                y: 0.38
            },
            {
                key: "BLUE",
                x: 0.35,
                y: 0.56
            },
            {
                key: "BLUE",
                x: 0.65,
                y: 0.56
            }
        ]
    },
    {
        id: 34,
        name: "High Altitude Piercer",
        desc: "3 Arrows: Ceiling targets perched high above the stratosphere!",
        arrows: 3,
        balloons: [
            {
                key: "GOLD",
                x: 0.35,
                y: 0.14
            },
            {
                key: "GOLD",
                x: 0.65,
                y: 0.14
            },
            {
                key: "FREEZE",
                x: 0.5,
                y: 0.22
            },
            {
                key: "RED",
                x: 0.24,
                y: 0.26
            },
            {
                key: "RED",
                x: 0.76,
                y: 0.26
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.36
            }
        ]
    },
    {
        id: 35,
        name: "Fortress Titan Boss",
        desc: "6 Arrows: Colossal Boss! Defeat Fortress Titan (10 HP) & shatter defenses!",
        arrows: 6,
        isBoss: true,
        bossHp: 10,
        balloons: [
            {
                key: "BOMB",
                x: 0.22,
                y: 0.32
            },
            {
                key: "BOMB",
                x: 0.78,
                y: 0.32
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.16
            },
            {
                key: "FREEZE",
                x: 0.36,
                y: 0.42
            },
            {
                key: "FREEZE",
                x: 0.64,
                y: 0.42
            },
            {
                key: "RED",
                x: 0.16,
                y: 0.48
            },
            {
                key: "RED",
                x: 0.84,
                y: 0.48
            },
            {
                key: "BLUE",
                x: 0.34,
                y: 0.56
            },
            {
                key: "BLUE",
                x: 0.66,
                y: 0.56
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.62
            }
        ]
    },
    {
        id: 36,
        name: "Tunnel of Precision",
        desc: "3 Arrows: Thread the needle right down the narrow middle corridor!",
        arrows: 3,
        balloons: [
            {
                key: "RED",
                x: 0.32,
                y: 0.24
            },
            {
                key: "RED",
                x: 0.68,
                y: 0.24
            },
            {
                key: "BLUE",
                x: 0.32,
                y: 0.38
            },
            {
                key: "BLUE",
                x: 0.68,
                y: 0.38
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.22
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.36
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.5
            }
        ]
    },
    {
        id: 37,
        name: "Diamond Phalanx",
        desc: "4 Arrows: Sturdy diamond guard shielding twin golden treasures!",
        arrows: 4,
        balloons: [
            {
                key: "GOLD",
                x: 0.5,
                y: 0.22
            },
            {
                key: "RED",
                x: 0.34,
                y: 0.32
            },
            {
                key: "RED",
                x: 0.66,
                y: 0.32
            },
            {
                key: "BOMB",
                x: 0.22,
                y: 0.42
            },
            {
                key: "BOMB",
                x: 0.78,
                y: 0.42
            },
            {
                key: "BLUE",
                x: 0.34,
                y: 0.52
            },
            {
                key: "BLUE",
                x: 0.66,
                y: 0.52
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.6
            }
        ]
    },
    {
        id: 38,
        name: "The Bouncing Helix",
        desc: "4 Arrows: Double helix configuration rewarding rapid ricochets!",
        arrows: 4,
        balloons: [
            {
                key: "PINK",
                x: 0.18,
                y: 0.22
            },
            {
                key: "GOLD",
                x: 0.82,
                y: 0.22
            },
            {
                key: "BLUE",
                x: 0.4,
                y: 0.32
            },
            {
                key: "BLUE",
                x: 0.6,
                y: 0.32
            },
            {
                key: "GREEN",
                x: 0.82,
                y: 0.42
            },
            {
                key: "PINK",
                x: 0.18,
                y: 0.42
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.52
            }
        ]
    },
    {
        id: 39,
        name: "Glacial Spires",
        desc: "4 Arrows: Tall columns of freeze ice holding up gold peaks!",
        arrows: 4,
        balloons: [
            {
                key: "GOLD",
                x: 0.25,
                y: 0.18
            },
            {
                key: "FREEZE",
                x: 0.25,
                y: 0.3
            },
            {
                key: "FREEZE",
                x: 0.25,
                y: 0.42
            },
            {
                key: "GOLD",
                x: 0.75,
                y: 0.18
            },
            {
                key: "FREEZE",
                x: 0.75,
                y: 0.3
            },
            {
                key: "FREEZE",
                x: 0.75,
                y: 0.42
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.36
            },
            {
                key: "PINK",
                x: 0.5,
                y: 0.52
            }
        ]
    },
    {
        id: 40,
        name: "Dreadnought Blimp Mid-Boss",
        desc: "6 Arrows: Heavy Mid-Boss! Defeat Dreadnought (10 HP) and breach armored line!",
        arrows: 6,
        isMidBoss: true,
        bossHp: 10,
        balloons: [
            {
                key: "BOMB",
                x: 0.2,
                y: 0.36
            },
            {
                key: "BOMB",
                x: 0.8,
                y: 0.36
            },
            {
                key: "GOLD",
                x: 0.35,
                y: 0.2
            },
            {
                key: "GOLD",
                x: 0.65,
                y: 0.2
            },
            {
                key: "RED",
                x: 0.15,
                y: 0.26
            },
            {
                key: "RED",
                x: 0.85,
                y: 0.26
            },
            {
                key: "BLUE",
                x: 0.35,
                y: 0.48
            },
            {
                key: "BLUE",
                x: 0.65,
                y: 0.48
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.58
            }
        ]
    },
    {
        id: 41,
        name: "Ring of Fire",
        desc: "4 Arrows: Concentric explosive ring surrounding high-value prizes!",
        arrows: 4,
        balloons: [
            {
                key: "GOLD",
                x: 0.5,
                y: 0.34
            },
            {
                key: "BOMB",
                x: 0.32,
                y: 0.24
            },
            {
                key: "BOMB",
                x: 0.68,
                y: 0.24
            },
            {
                key: "BOMB",
                x: 0.24,
                y: 0.38
            },
            {
                key: "BOMB",
                x: 0.76,
                y: 0.38
            },
            {
                key: "BOMB",
                x: 0.36,
                y: 0.48
            },
            {
                key: "BOMB",
                x: 0.64,
                y: 0.48
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.18
            }
        ]
    },
    {
        id: 42,
        name: "Floating Stepping Stones",
        desc: "4 Arrows: Ascending stair pattern across the entire battlefield!",
        arrows: 4,
        balloons: [
            {
                key: "RED",
                x: 0.18,
                y: 0.58
            },
            {
                key: "BLUE",
                x: 0.32,
                y: 0.48
            },
            {
                key: "GREEN",
                x: 0.46,
                y: 0.38
            },
            {
                key: "PINK",
                x: 0.6,
                y: 0.28
            },
            {
                key: "GOLD",
                x: 0.74,
                y: 0.18
            },
            {
                key: "BOMB",
                x: 0.88,
                y: 0.28
            }
        ]
    },
    {
        id: 43,
        name: "Dual Titan Vault",
        desc: "4 Arrows: Twin defensive vaults holding triple gems and gold!",
        arrows: 4,
        balloons: [
            {
                key: "GOLD",
                x: 0.25,
                y: 0.22
            },
            {
                key: "GOLD",
                x: 0.75,
                y: 0.22
            },
            {
                key: "RED",
                x: 0.15,
                y: 0.34
            },
            {
                key: "RED",
                x: 0.35,
                y: 0.34
            },
            {
                key: "BLUE",
                x: 0.65,
                y: 0.34
            },
            {
                key: "BLUE",
                x: 0.85,
                y: 0.34
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.42
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.56
            }
        ]
    },
    {
        id: 44,
        name: "Cascade Domino Arc",
        desc: "4 Arrows: Curved gravity trajectory dropping into a dense balloon basket!",
        arrows: 4,
        balloons: [
            {
                key: "GOLD",
                x: 0.2,
                y: 0.48
            },
            {
                key: "BLUE",
                x: 0.32,
                y: 0.36
            },
            {
                key: "FREEZE",
                x: 0.5,
                y: 0.26
            },
            {
                key: "BLUE",
                x: 0.68,
                y: 0.36
            },
            {
                key: "GOLD",
                x: 0.8,
                y: 0.48
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.44
            },
            {
                key: "PINK",
                x: 0.38,
                y: 0.56
            },
            {
                key: "PINK",
                x: 0.62,
                y: 0.56
            }
        ]
    },
    {
        id: 45,
        name: "Stormbringer Mid-Boss",
        desc: "6 Arrows: Fierce Mid-Boss! Defeat Stormbringer (12 HP) through the barrage!",
        arrows: 6,
        isMidBoss: true,
        bossHp: 12,
        balloons: [
            {
                key: "BOMB",
                x: 0.22,
                y: 0.34
            },
            {
                key: "BOMB",
                x: 0.78,
                y: 0.34
            },
            {
                key: "FREEZE",
                x: 0.5,
                y: 0.18
            },
            {
                key: "GOLD",
                x: 0.35,
                y: 0.46
            },
            {
                key: "GOLD",
                x: 0.65,
                y: 0.46
            },
            {
                key: "RED",
                x: 0.16,
                y: 0.24
            },
            {
                key: "RED",
                x: 0.84,
                y: 0.24
            },
            {
                key: "BLUE",
                x: 0.2,
                y: 0.54
            },
            {
                key: "BLUE",
                x: 0.8,
                y: 0.54
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.62
            }
        ]
    },
    {
        id: 46,
        name: "Laser Corridor",
        desc: "4 Arrows: Low-angle bank shots slicing through tight horizontal arrays!",
        arrows: 4,
        balloons: [
            {
                key: "RED",
                x: 0.22,
                y: 0.24
            },
            {
                key: "RED",
                x: 0.5,
                y: 0.24
            },
            {
                key: "RED",
                x: 0.78,
                y: 0.24
            },
            {
                key: "GOLD",
                x: 0.22,
                y: 0.4
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.4
            },
            {
                key: "GOLD",
                x: 0.78,
                y: 0.4
            },
            {
                key: "BLUE",
                x: 0.35,
                y: 0.54
            },
            {
                key: "BLUE",
                x: 0.65,
                y: 0.54
            }
        ]
    },
    {
        id: 47,
        name: "The Gauntlet",
        desc: "5 Arrows: Multi-depth defense barrier testing force and range regulation!",
        arrows: 5,
        balloons: [
            {
                key: "GOLD",
                x: 0.5,
                y: 0.16
            },
            {
                key: "FREEZE",
                x: 0.3,
                y: 0.26
            },
            {
                key: "FREEZE",
                x: 0.7,
                y: 0.26
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.34
            },
            {
                key: "RED",
                x: 0.18,
                y: 0.38
            },
            {
                key: "RED",
                x: 0.82,
                y: 0.38
            },
            {
                key: "BLUE",
                x: 0.34,
                y: 0.48
            },
            {
                key: "BLUE",
                x: 0.66,
                y: 0.48
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.58
            }
        ]
    },
    {
        id: 48,
        name: "Constellation Star",
        desc: "5 Arrows: 5-pointed star formation with explosive tips and gold nucleus!",
        arrows: 5,
        balloons: [
            {
                key: "GOLD",
                x: 0.5,
                y: 0.34
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.18
            },
            {
                key: "RED",
                x: 0.22,
                y: 0.3
            },
            {
                key: "RED",
                x: 0.78,
                y: 0.3
            },
            {
                key: "BLUE",
                x: 0.3,
                y: 0.52
            },
            {
                key: "BLUE",
                x: 0.7,
                y: 0.52
            },
            {
                key: "GREEN",
                x: 0.38,
                y: 0.4
            },
            {
                key: "GREEN",
                x: 0.62,
                y: 0.4
            }
        ]
    },
    {
        id: 49,
        name: "The Void Horizon",
        desc: "5 Arrows: Distant high-altitude targets scattered across the wide stratosphere!",
        arrows: 5,
        balloons: [
            {
                key: "GOLD",
                x: 0.16,
                y: 0.16
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.16
            },
            {
                key: "GOLD",
                x: 0.84,
                y: 0.16
            },
            {
                key: "BOMB",
                x: 0.33,
                y: 0.28
            },
            {
                key: "BOMB",
                x: 0.67,
                y: 0.28
            },
            {
                key: "RED",
                x: 0.2,
                y: 0.42
            },
            {
                key: "RED",
                x: 0.8,
                y: 0.42
            },
            {
                key: "BLUE",
                x: 0.5,
                y: 0.48
            }
        ]
    },
    {
        id: 50,
        name: "Omega Titan Apex Sovereign",
        desc: "7 Arrows: The Ultimate Slingshot Showdown! Defeat the 15 HP Omega Titan!",
        arrows: 7,
        isBoss: true,
        bossHp: 15,
        balloons: [
            {
                key: "BOMB",
                x: 0.2,
                y: 0.32
            },
            {
                key: "BOMB",
                x: 0.8,
                y: 0.32
            },
            {
                key: "FREEZE",
                x: 0.35,
                y: 0.22
            },
            {
                key: "FREEZE",
                x: 0.65,
                y: 0.22
            },
            {
                key: "GOLD",
                x: 0.5,
                y: 0.14
            },
            {
                key: "RED",
                x: 0.15,
                y: 0.22
            },
            {
                key: "RED",
                x: 0.85,
                y: 0.22
            },
            {
                key: "BLUE",
                x: 0.35,
                y: 0.44
            },
            {
                key: "BLUE",
                x: 0.65,
                y: 0.44
            },
            {
                key: "BOMB",
                x: 0.5,
                y: 0.5
            },
            {
                key: "PINK",
                x: 0.2,
                y: 0.54
            },
            {
                key: "PINK",
                x: 0.8,
                y: 0.54
            },
            {
                key: "GOLD",
                x: 0.35,
                y: 0.62
            },
            {
                key: "GOLD",
                x: 0.65,
                y: 0.62
            },
            {
                key: "GREEN",
                x: 0.5,
                y: 0.68
            }
        ]
    }
  ],
  SPECS: {
    RED:    { key: "RED",    color: "#ff3823", points: 10,  speed: 2.2, r: 36, prob: 0.22 },
    PINK:   { key: "PINK",   color: "#ff4da6", points: 15,  speed: 2.3, r: 36, prob: 0.20 },
    BLUE:   { key: "BLUE",   color: "#1bb2eb", points: 20,  speed: 2.7, r: 34, prob: 0.20 },
    GREEN:  { key: "GREEN",  color: "#42d61a", points: 30,  speed: 3.0, r: 34, prob: 0.16 },
    GOLD:   { key: "GOLD",   color: "#ffcc00", points: 100, speed: 4.4, r: 33, prob: 0.07, isGold: true },
    BOMB:   { key: "BOMB",   color: "#222533", points: 0,   speed: 2.0, r: 36, prob: 0.05, isBomb: true },
    FREEZE: { key: "FREEZE", color: "#00e5ff", points: 25,  speed: 2.3, r: 34, prob: 0.05, isFreeze: true },
    GIFT:   { key: "GIFT",   color: "#a855f7", points: 15,  speed: 2.6, r: 34, prob: 0.05, isGift: true }
  },
  SKINS: [
    { id: "default", name: "Classic Pop", cost: { coins: 0 }, colors: null, desc: "Original arcade look" },
    { id: "candy",   name: "Candy Pop",   cost: { coins: 300 }, colors: { RED: "#ff5da2", BLUE: "#7dd0ff", GREEN: "#7dffb2" }, desc: "Sweet pastel burst" },
    { id: "magma",   name: "Magma Pop",   cost: { coins: 800 }, colors: { RED: "#ff4d00", BLUE: "#ff9a3d", GREEN: "#ffd23f" }, desc: "Hot lava balloons" },
    { id: "royal",   name: "Royal Pop",   cost: { gems: 5 }, colors: { RED: "#c26bff", BLUE: "#6b8cff", GREEN: "#5dffd3" }, desc: "Premium neon royalty" }
  ],
  EFFECTS: [
    { id: "spark", name: "Spark Shards", cost: { coins: 0 }, desc: "Classic square burst" },
    { id: "orbit", name: "Orbit Pop", cost: { coins: 250 }, desc: "Round bubble burst" },
    { id: "comet", name: "Comet Pop", cost: { gems: 3 }, desc: "Bright comet core" }
  ],
  ACHIEVEMENTS: [
    { id: "first_pop",  icon: "🎈", name: "First Pop",          desc: "Pop your first balloon",      reward: { coins: 25 } },
    { id: "bomb10",     icon: "💥", name: "Bomb Expert",        desc: "Detonate 10 bombs",           reward: { coins: 100 } },
    { id: "fever1",     icon: "🔥", name: "Fever Master",       desc: "Trigger Fever Mode",          reward: { coins: 80 } },
    { id: "combo12",    icon: "⚡", name: "Combo King",         desc: "Reach a 12x combo",           reward: { coins: 120 } },
    { id: "pop300",     icon: "👑", name: "Balloon Master",     desc: "Pop 300 balloons total",      reward: { gems: 3 } },
    { id: "camp_done",  icon: "🏆", name: "Campaign Complete",  desc: "Clear all 10 stages",         reward: { gems: 5 } }
  ],
  POWERUPS: [
    { id: "gatling", name: "Gatling Gun", icon: "⚡", color: "#ffd23f" },
    { id: "shotgun", name: "Triple Spread", icon: "🎯", color: "#ff5e7a" },
    { id: "laser", name: "Laser Cannon", icon: "🔆", color: "#00f5d4" },
    { id: "time", name: "+10s Time", icon: "⏱️", color: "#33ff77" },
    { id: "life", name: "+1 Life", icon: "❤️", color: "#ff5e7a" }
  ],
  DAILY: [
    { day: 1, coins: 50, icon: "🪙", label: "+50" },
    { day: 2, coins: 100, icon: "🪙", label: "+100" },
    { day: 3, coins: 150, icon: "🪙", label: "+150" },
    { day: 4, gems: 2, icon: "💎", label: "+2 Gems" },
    { day: 5, coins: 250, icon: "🪙", label: "+250" },
    { day: 6, coins: 400, icon: "🪙", label: "+400" },
    { day: 7, coins: 800, gems: 5, icon: "👑", label: "800 + 5💎" }
  ],
  MISSIONS: [
    { id: "m_pop50",  name: "Warm Fingers", desc: "Pop 50 balloons today",  target: 50,   reward: { coins: 50 }, metric: "pop" },
    { id: "m_score1k", name: "High Roller", desc: "Score 1,000 in one game", target: 1000, reward: { coins: 60 }, metric: "score" },
    { id: "m_fever",  name: "Fever Dream",  desc: "Trigger Fever once",     target: 1,    reward: { coins: 40 }, metric: "fever" }
  ]
};
})();
