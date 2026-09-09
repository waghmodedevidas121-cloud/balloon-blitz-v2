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
