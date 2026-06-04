/* Khairasa Studio - interactions
   Plain vanilla JS, no dependencies. Progressive enhancement:
   the site works without it, this just makes it nicer. */
(function () {
  "use strict";

  var WA_BASE = "https://wa.me/6285121525015";

  /* ---- 1. WhatsApp links: build pre-filled href from data-wa-text ---- */
  function wireWhatsApp() {
    var links = document.querySelectorAll("[data-wa-text]");
    links.forEach(function (a) {
      var text = a.getAttribute("data-wa-text") || "";
      a.setAttribute("href", WA_BASE + "?text=" + encodeURIComponent(text));
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    });
  }

  /* ---- 2. Sticky nav: add shadow/background once scrolled ---- */
  function wireNavScroll() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- 3. Mobile menu toggle ---- */
  function wireMobileMenu() {
    var nav = document.getElementById("nav");
    var toggle = document.getElementById("navToggle");
    var menu = document.getElementById("mobileMenu");
    if (!nav || !toggle || !menu) return;

    function close() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      menu.hidden = true;
    }
    function open() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      menu.hidden = false;
    }

    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) close(); else open();
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    // close on resize up to desktop
    window.addEventListener("resize", function () {
      if (window.innerWidth > 760) close();
    });
  }

  /* ---- 4. Reveal on scroll ---- */
  function wireReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || !els.length) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- 5. Contribution-graph motif (decorative, brand blue ramp) ---- */
  function buildContribGraph() {
    var host = document.querySelector(".proof__graph");
    if (!host) return;
    var ramp = ["#e7eefb", "#b9c9ee", "#7e9be0", "#4f74cf", "#3158A7"];
    var cols = window.innerWidth < 600 ? 18 : 32;
    var cells = cols * 7;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < cells; i++) {
      var i_ = document.createElement("i");
      // weighted toward "active": mostly filled, varied intensity
      var r = Math.random();
      var level = r < 0.16 ? 0 : r < 0.34 ? 1 : r < 0.58 ? 2 : r < 0.82 ? 3 : 4;
      i_.style.backgroundColor = ramp[level];
      frag.appendChild(i_);
    }
    host.appendChild(frag);
  }

  /* ---- 6. Year + placeholder social links ---- */
  function wireMisc() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());

    // social links without a real URL yet: do not jump to top
    document.querySelectorAll('a[data-social]').forEach(function (a) {
      if (a.getAttribute("href") === "#") {
        a.addEventListener("click", function (e) { e.preventDefault(); });
      }
    });
  }

  function init() {
    wireWhatsApp();
    wireNavScroll();
    wireMobileMenu();
    wireReveal();
    buildContribGraph();
    wireMisc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
