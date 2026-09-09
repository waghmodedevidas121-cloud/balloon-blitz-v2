/* BB boot — load, migrate, init engine + UI, daily check. */
(function () {
  // Splash Screen sequence (failsafe: loading can never trap the user)
  var splashText = document.querySelector(".splash-text");
  var splashFill = document.querySelector(".splash-loader-fill");
  var splashDone = false;
  function setProgress(pct, txt) {
    if (splashFill) splashFill.style.width = pct + "%";
    if (txt && splashText) splashText.innerText = txt;
  }
  function hideSplash() {
    if (splashDone) return; splashDone = true;
    var splash = document.getElementById("splashScreen");
    if (splash) splash.classList.add("hidden");
  }
  setTimeout(hideSplash, 5000); // absolute failsafe
  setProgress(40, "INITIALIZING...");

  setTimeout(function() {
    try {
      BB.Save.load();
      BB.Audio.sound.muted = !BB.Save.data.settings.sound;
      BB.Music.init();
      setProgress(70, "LOADING ASSETS...");

      BB.Engine.init("gameCanvas");
      BB.UI.decor();
      BB.UI.bind();
      BB.UI.refreshHome();
      gameState = "HOME";
      setProgress(100, "READY!");

      setTimeout(function() {
        hideSplash();
        try {
          if (!BB.UI.dailyCheck()) BB.UI.show("homeScreen");
        } catch (e) { BB.UI.show("homeScreen"); }
      }, 400); // Hold at 100% for a moment
    } catch (e) {
      hideSplash();
      try { BB.UI.show("homeScreen"); } catch (e2) {}
    }
  }, 100);
})();

/* ---------------------------------------------------------------------------
   V2 ENHANCEMENT: UI skin layer.
   Loads css/enhance.css (SVG textures, glass cards, 3D buttons) on top of the
   original stylesheet and upgrades the bottom-nav markup so each button has a
   separate icon + label element that the skin can style.
   Purely additive: no existing engine/UI code is modified.
--------------------------------------------------------------------------- */
(function () {
  // 1. Stylesheet — injected as early as possible to avoid a flash of old UI.
  (function injectSkin() {
    if (document.querySelector("link[data-bb-skin]")) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "css/enhance.css";
    l.setAttribute("data-bb-skin", "1");
    (document.head || document.documentElement).appendChild(l);
  })();

  function ready(fn) {
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  // 2. Bottom nav: "🏠<br>HOME" -> <span class=nav-ico>🏠</span><span class=nav-lbl>HOME</span>
  function upgradeNav() {
    var nav = document.getElementById("bottomNav");
    if (!nav) return;
    Array.prototype.forEach.call(nav.querySelectorAll("button"), function (b) {
      if (b.__bbSkinned) return;
      b.__bbSkinned = true;
      try {
        if (b.querySelector(".nav-ico")) return;
        var ico = "", lbl = "";
        var parts = b.innerHTML.split(/<br\s*\/?>/i);
        if (parts.length > 1) {
          ico = parts[0].trim();
          lbl = parts.slice(1).join(" ").trim();
        } else if (b.children.length === 0) {
          // no <br>: split leading emoji/symbol from the text label
          var m = /^\s*(\S+?)\s+([\s\S]+)$/.exec(b.textContent || "");
          if (!m) return;
          ico = m[1];
          lbl = m[2].trim();
        } else return;
        if (!ico || !lbl) return;
        b.innerHTML =
          '<span class="nav-ico">' + ico + '</span>' +
          '<span class="nav-lbl">' + lbl + '</span>';
      } catch (e) {}
    });
  }

  ready(function () {
    upgradeNav();
    // re-run after the UI finishes its first render pass
    setTimeout(upgradeNav, 600);
  });
})();

/* ---------------------------------------------------------------------------
   V2 ENHANCEMENT: player profile.
   - Editable player name + avatar (saved in BB.Save, so it survives reloads)
   - Profile hero card on the Profile screen: avatar, name, rank, level, XP bar
   - Header avatar/name stay in sync everywhere
   Purely additive: no existing engine/UI code is modified.
--------------------------------------------------------------------------- */
(function () {
  var AVATARS = ["\uD83C\uDF88", "\uD83E\uDD84", "\uD83D\uDC7E", "\uD83E\uDD8A", "\uD83D\uDC32", "\uD83D\uDC31",
                 "\uD83D\uDC38", "\uD83D\uDC27", "\uD83E\uDD16", "\uD83D\uDC7D", "\uD83C\uDF1F", "\uD83D\uDD25",
                 "\uD83C\uDFAF", "\uD83C\uDFAE", "\uD83D\uDC51", "\uD83E\uDD8B"];
  var MAX_NAME = 14;
  var STYLE_ID = "bbProfileStyle";

  function d() { return (window.BB && BB.Save && BB.Save.data) || {}; }
  function save() { try { BB.Save.save(); } catch (e) {} }

  function profile() {
    var dd = d();
    if (!dd.profile || typeof dd.profile !== "object") dd.profile = {};
    if (!dd.profile.name) dd.profile.name = "PLAYER";
    if (!dd.profile.avatar) dd.profile.avatar = AVATARS[0];
    return dd.profile;
  }

  function clean(s) {
    return String(s || "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, MAX_NAME);
  }

  function rankInfo() {
    try { return BB.Player.rank(); } catch (e) { return { name: "NOVICE", index: 0 }; }
  }

  // XP progress towards the next player level
  function xpInfo() {
    var steps = [0, 100, 300, 700, 1500, 3000, 6000];
    var xp = d().xp || 0, lv = 1;
    for (var i = 0; i < steps.length; i++) if (xp >= steps[i]) lv = i + 1;
    var base = steps[lv - 1] || 0;
    var next = steps[lv];
    if (next === undefined) return { level: lv, pct: 100, have: xp, need: xp, max: true };
    return {
      level: lv, max: false, have: xp - base, need: next - base,
      pct: Math.max(0, Math.min(100, ((xp - base) / (next - base)) * 100))
    };
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent = [
      ".bbp-hero{position:relative;overflow:hidden;display:flex;align-items:center;gap:13px;",
        "padding:15px;margin-bottom:12px;border-radius:20px;",
        "border:1px solid rgba(255,255,255,.14);",
        "background:linear-gradient(180deg,rgba(46,56,110,.9),rgba(13,17,40,.94));",
        "box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 14px 32px rgba(0,0,0,.45)}",
      ".bbp-hero::after{content:'';position:absolute;inset:0;pointer-events:none;opacity:.5;",
        "background:radial-gradient(70% 60% at 96% 0%,rgba(255,211,92,.35),transparent 70%)}",
      ".bbp-hero>*{position:relative;z-index:1}",
      ".bbp-av{width:64px;height:64px;flex:0 0 64px;display:grid;place-items:center;font-size:34px;",
        "border-radius:20px;background:radial-gradient(circle at 32% 26%,#7c93ff,#26307f 72%);",
        "box-shadow:inset 0 2px 0 rgba(255,255,255,.35),0 8px 18px rgba(0,0,0,.45)}",
      ".bbp-info{flex:1;min-width:0}",
      ".bbp-nrow{display:flex;align-items:center;gap:7px}",
      ".bbp-name{font-size:17px;font-weight:900;letter-spacing:.04em;overflow:hidden;",
        "text-overflow:ellipsis;white-space:nowrap}",
      ".bbp-rank{padding:3px 9px;border-radius:999px;font-size:9px;font-weight:900;letter-spacing:.1em;",
        "color:#2a1c00;background:linear-gradient(180deg,#ffe088,#ffb52c)}",
      ".bbp-xprow{display:flex;justify-content:space-between;font-size:9.5px;font-weight:800;",
        "letter-spacing:.08em;color:#9aa7cc;margin:9px 0 4px}",
      ".bbp-track{height:8px;border-radius:999px;overflow:hidden;background:rgba(255,255,255,.1);",
        "box-shadow:inset 0 1px 2px rgba(0,0,0,.5)}",
      ".bbp-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,#3fe0d0,#8b7bff);",
        "box-shadow:0 0 12px rgba(139,123,255,.55)}",
      ".bbp-edit{margin-top:10px;padding:8px 12px;font-size:10px;font-weight:900;letter-spacing:.08em;",
        "color:#eef2ff;border:1px solid rgba(255,255,255,.22);border-radius:999px;",
        "background:rgba(255,255,255,.08)}",
      ".bbp-edit:active{transform:translateY(1px)}",
      ".bbp-modal{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;",
        "padding:18px;background:rgba(4,6,16,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}",
      ".bbp-modal.on{display:flex}",
      ".bbp-sheet{width:100%;max-width:360px;max-height:86vh;overflow:auto;padding:17px;border-radius:22px;",
        "border:1px solid rgba(255,255,255,.16);",
        "background:linear-gradient(180deg,rgba(34,42,86,.98),rgba(11,15,34,.99));",
        "box-shadow:inset 0 1px 0 rgba(255,255,255,.14),0 26px 60px rgba(0,0,0,.65)}",
      ".bbp-h{font-size:13px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;",
        "color:#eef2ff;margin-bottom:12px;text-align:center}",
      ".bbp-lab{font-size:9.5px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;",
        "color:#9aa7cc;margin:12px 0 7px}",
      ".bbp-input{width:100%;min-height:46px;padding:11px 13px;font-size:15px;font-weight:800;",
        "color:#eef2ff;border:1px solid rgba(255,255,255,.2);border-radius:14px;",
        "background:rgba(6,9,24,.7);outline:none;box-sizing:border-box}",
      ".bbp-input:focus{border-color:rgba(63,224,208,.6);box-shadow:0 0 0 3px rgba(63,224,208,.15)}",
      ".bbp-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}",
      ".bbp-opt{aspect-ratio:1/1;display:grid;place-items:center;font-size:24px;cursor:pointer;",
        "border:1px solid rgba(255,255,255,.14);border-radius:15px;",
        "background:linear-gradient(180deg,rgba(255,255,255,.1),rgba(255,255,255,.03));",
        "box-shadow:inset 0 1px 0 rgba(255,255,255,.12)}",
      ".bbp-opt.sel{border-color:rgba(255,211,92,.85);",
        "background:linear-gradient(180deg,rgba(255,211,92,.3),rgba(255,150,40,.12));",
        "box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 0 0 2px rgba(255,211,92,.28)}",
      ".bbp-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
      ".bbp-stat{padding:11px 10px;text-align:center;border-radius:14px;",
        "border:1px solid rgba(255,255,255,.1);background:rgba(6,9,24,.6)}",
      ".bbp-sv{font-size:17px;font-weight:900;color:#eef2ff}",
      ".bbp-sv.gold{color:#ffd35c}",
      ".bbp-sl{margin-top:3px;font-size:9px;font-weight:800;letter-spacing:.1em;",
        "text-transform:uppercase;color:#9aa7cc}",
      ".bbp-row{display:flex;gap:9px;margin-top:16px}",
      ".bbp-btn{flex:1;min-height:46px;font-size:12px;font-weight:900;letter-spacing:.08em;",
        "color:#eef2ff;border:1px solid rgba(255,255,255,.2);border-radius:15px;",
        "background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.04));",
        "box-shadow:inset 0 1px 0 rgba(255,255,255,.12)}",
      ".bbp-btn.go{color:#331b00;border-color:rgba(255,255,255,.3);",
        "background:linear-gradient(180deg,#ffe088,#ffb52c);",
        "box-shadow:0 4px 0 #c47100,inset 0 1px 0 rgba(255,255,255,.6)}",
      ".bbp-btn:active{transform:translateY(2px)}"
    ].join("");
    document.head.appendChild(s);
  }

  /* ---------------- header + hero sync ---------------- */
  function syncHeader() {
    var p = profile();
    try {
      var av = document.querySelector(".header-avatar");
      if (av) av.textContent = p.avatar;
      var nm = document.querySelector(".header-name");
      if (nm) nm.textContent = p.name;
    } catch (e) {}
  }

  function heroMarkup() {
    var r = rankInfo(), x = xpInfo();
    return '<div class="bbp-av">' + profile().avatar + "</div>" +
      '<div class="bbp-info">' +
        '<div class="bbp-nrow"><div class="bbp-name"></div>' +
          '<span class="bbp-rank">' + r.name + "</span></div>" +
        '<div class="bbp-xprow"><span>LEVEL ' + x.level + "</span><span>" +
          (x.max ? "MAX" : x.have + " / " + x.need + " XP") + "</span></div>" +
        '<div class="bbp-track"><div class="bbp-fill" style="width:' + x.pct + '%"></div></div>' +
        '<button class="bbp-edit" type="button">\u270F\uFE0F EDIT PROFILE</button>' +
      "</div>";
  }

  function mountHero() {
    var screen = document.getElementById("dashboardScreen");
    if (!screen) return;
    var hero = screen.querySelector(".bbp-hero");
    if (!hero) {
      hero = document.createElement("div");
      hero.className = "bbp-hero";
      screen.insertBefore(hero, screen.firstChild);
    }
    hero.innerHTML = heroMarkup();
    // name is set as text (never HTML) so odd characters can't break the page
    var nameEl = hero.querySelector(".bbp-name");
    if (nameEl) nameEl.textContent = profile().name;
    var btn = hero.querySelector(".bbp-edit");
    if (btn) btn.addEventListener("click", open);
  }

  /* ---------------- editor modal ---------------- */
  var modal = null, pending = null;

  function buildModal() {
    if (modal) return modal;
    modal = document.createElement("div");
    modal.className = "bbp-modal";
    modal.innerHTML =
      '<div class="bbp-sheet">' +
        '<div class="bbp-h">Player profile</div>' +
        '<div class="bbp-lab">Your name</div>' +
        '<input class="bbp-input" id="bbpName" maxlength="' + MAX_NAME + '" placeholder="PLAYER" />' +
        '<div class="bbp-lab">Avatar</div>' +
        '<div class="bbp-grid" id="bbpGrid"></div>' +
        '<div class="bbp-lab">Career</div>' +
        '<div class="bbp-stats" id="bbpStats"></div>' +
        '<div class="bbp-row">' +
          '<button class="bbp-btn" id="bbpCancel" type="button">CANCEL</button>' +
          '<button class="bbp-btn go" id="bbpSave" type="button">SAVE</button>' +
        "</div>" +
      "</div>";
    document.body.appendChild(modal);

    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    modal.querySelector("#bbpCancel").addEventListener("click", close);
    modal.querySelector("#bbpSave").addEventListener("click", commit);
    modal.querySelector("#bbpName").addEventListener("keydown", function (e) {
      if (e.key === "Enter") commit();
    });
    return modal;
  }

  function fillGrid() {
    var grid = modal.querySelector("#bbpGrid");
    grid.innerHTML = "";
    AVATARS.forEach(function (a) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "bbp-opt" + (a === pending.avatar ? " sel" : "");
      b.textContent = a;
      b.addEventListener("click", function () {
        pending.avatar = a;
        Array.prototype.forEach.call(grid.children, function (c) { c.classList.remove("sel"); });
        b.classList.add("sel");
      });
      grid.appendChild(b);
    });
  }

  function fillStats() {
    var dd = d(), stars = 0;
    try { stars = BB.Player.totalStars(); } catch (e) {}
    function fmt(n) { return (Number(n) || 0).toLocaleString("en-US"); }
    var rows = [
      ["\u2B50 " + fmt(stars), "Stars", true],
      [fmt(dd.blitzHighScore), "Best blitz", false],
      [fmt(dd.totalPops), "Balloons popped", false],
      [fmt(dd.gamesPlayed), "Games played", false]
    ];
    modal.querySelector("#bbpStats").innerHTML = rows.map(function (r) {
      return '<div class="bbp-stat"><div class="bbp-sv' + (r[2] ? " gold" : "") + '">' +
        r[0] + '</div><div class="bbp-sl">' + r[1] + "</div></div>";
    }).join("");
  }

  function open() {
    injectStyle();
    buildModal();
    var p = profile();
    pending = { name: p.name, avatar: p.avatar };
    modal.querySelector("#bbpName").value = p.name;
    fillGrid();
    fillStats();
    modal.classList.add("on");
  }

  function close() { if (modal) modal.classList.remove("on"); }

  function commit() {
    var p = profile();
    var typed = clean(modal.querySelector("#bbpName").value);
    p.name = typed || "PLAYER";
    p.avatar = pending.avatar || p.avatar;
    save();
    close();
    syncHeader();
    mountHero();
    try { BB.Audio.sound.pop(1); } catch (e) {}
    try { BB.UI.flash && BB.UI.flash("Profile saved"); } catch (e) {}
  }

  /* ---------------- boot ---------------- */
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    injectStyle();
    syncHeader();
    mountHero();

    // tapping the header avatar opens the editor
    var hp = document.querySelector(".header-profile");
    if (hp) {
      hp.style.cursor = "pointer";
      hp.addEventListener("click", open);
    }

    // keep everything fresh whenever the UI switches screens or refreshes home
    try {
      if (BB.UI && typeof BB.UI.show === "function" && !BB.UI.__bbProfWrapped) {
        var origShow = BB.UI.show;
        BB.UI.show = function () {
          var r = origShow.apply(this, arguments);
          setTimeout(function () { syncHeader(); mountHero(); }, 20);
          return r;
        };
        BB.UI.__bbProfWrapped = true;
      }
      if (BB.UI && typeof BB.UI.refreshHome === "function" && !BB.UI.__bbProfHomeWrapped) {
        var origHome = BB.UI.refreshHome;
        BB.UI.refreshHome = function () {
          var r = origHome.apply(this, arguments);
          setTimeout(syncHeader, 20);
          return r;
        };
        BB.UI.__bbProfHomeWrapped = true;
      }
    } catch (e) {}
  });

  window.BB = window.BB || {};
  BB.Profile = { open: open, close: close, sync: function () { syncHeader(); mountHero(); }, avatars: AVATARS };
})();

/* ---------------------------------------------------------------------------
   V2 ENHANCEMENT: auto-hide / auto-show bottom navigation bar.
   - Scroll DOWN  -> nav slides away (more screen for content)
   - Scroll UP / reach top / tap near bottom edge -> nav slides back
   - Idle for a few seconds while scrolled down -> stays hidden
   - Screen change always reveals it again
   Purely additive: no existing engine/UI code is modified.
--------------------------------------------------------------------------- */
(function () {
  var STYLE_ID = "bbNavAutoHideStyle";
  var HIDE_AFTER_MS = 2600;   // idle timeout before auto-hiding
  var DELTA = 8;              // scroll px needed to trigger
  var EDGE = 90;              // bottom px zone that re-reveals nav on tap

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement("style");
    s.id = STYLE_ID;
    s.textContent =
      "#bottomNav{transition:transform .28s cubic-bezier(.22,.8,.3,1),opacity .22s ease;will-change:transform}" +
      "#bottomNav.nav-auto-hidden{transform:translateY(130%);opacity:0;pointer-events:none}" +
      "#bbNavPeek{position:fixed;left:0;right:0;bottom:0;height:22px;z-index:60;display:none}" +
      "#bbNavPeek.on{display:block}";
    document.head.appendChild(s);
  }

  function ready(fn) {
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    injectStyle();
    var nav = document.getElementById("bottomNav");
    if (!nav) return;

    // invisible strip at the very bottom: tap/swipe here to bring nav back
    var peek = document.createElement("div");
    peek.id = "bbNavPeek";
    document.body.appendChild(peek);

    var hidden = false, timer = null;

    function navUsable() {
      // only manage it while it is actually part of the menu UI
      return nav.style.display !== "none";
    }
    function show(autoHideAgain) {
      if (!navUsable()) return;
      if (hidden) { nav.classList.remove("nav-auto-hidden"); hidden = false; }
      peek.classList.remove("on");
      clearTimeout(timer);
      if (autoHideAgain) timer = setTimeout(function () { hide(); }, HIDE_AFTER_MS);
    }
    function hide() {
      if (!navUsable() || hidden) return;
      nav.classList.add("nav-auto-hidden");
      peek.classList.add("on");
      hidden = true;
    }

    // Watch every scrollable menu screen
    function attach(el) {
      if (!el || el.__bbNavHooked) return;
      el.__bbNavHooked = true;
      var last = el.scrollTop;
      el.addEventListener("scroll", function () {
        var y = el.scrollTop, d = y - last;
        if (Math.abs(d) < DELTA) return;
        last = y;
        if (y < 40) { show(false); return; }      // near top: always visible
        if (d > 0) hide();                        // scrolling down
        else show(true);                          // scrolling up
      }, { passive: true });
    }
    Array.prototype.forEach.call(
      document.querySelectorAll(".overlay-view, .mobile-card"), attach
    );
    // also handle page-level scrolling
    var lastWin = window.scrollY || 0;
    window.addEventListener("scroll", function () {
      var y = window.scrollY || 0, d = y - lastWin;
      if (Math.abs(d) < DELTA) return;
      lastWin = y;
      if (y < 40) { show(false); return; }
      if (d > 0) hide(); else show(true);
    }, { passive: true });

    // Tap / swipe-up near the bottom edge reveals the nav again
    function edgeReveal(e) {
      var t = (e.touches && e.touches[0]) || e;
      if (!t) return;
      if (window.innerHeight - t.clientY <= EDGE) show(true);
    }
    peek.addEventListener("pointerdown", function () { show(true); });
    window.addEventListener("pointerdown", edgeReveal, { passive: true });

    // Any nav button press keeps it visible for a while
    nav.addEventListener("pointerdown", function () { show(true); });

    // Screen switches (BB.UI.show) should always reveal the nav
    if (BB.UI && typeof BB.UI.show === "function" && !BB.UI.__bbNavWrapped) {
      var origShow = BB.UI.show;
      BB.UI.show = function () {
        var r = origShow.apply(this, arguments);
        setTimeout(function () { show(false); }, 30);
        return r;
      };
      BB.UI.__bbNavWrapped = true;
    }
  });
})();
