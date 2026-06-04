/* Khairasa Studio - interactions
   Plain vanilla JS, no dependencies. Progressive enhancement:
   the site works without it, this just makes it nicer. */
(function () {
  "use strict";

  var WA_BASE = "https://wa.me/6285121525015";
  // Free access key from web3forms.com (use Khairasagroup@gmail.com). Safe to be public.
  // Until this is set, the forms fall back to opening WhatsApp with the details.
  var WEB3_KEY = "a7831c74-479c-4ded-ac41-53394a1a6041";

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
      menu.setAttribute("aria-hidden", "true");
    }
    function open() {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      menu.setAttribute("aria-hidden", "false");
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

  /* ---- 7. Smooth FAQ accordion (animate <details> open/close) ---- */
  function wireFaq() {
    var items = document.querySelectorAll(".faq__item");
    if (!items.length) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    items.forEach(function (item) {
      var summary = item.querySelector("summary");
      var panel = item.querySelector(".faq__a");
      if (!summary || !panel) return;
      summary.addEventListener("click", function (e) {
        e.preventDefault();
        if (reduce) { item.open = !item.open; return; }
        if (item.open) {
          panel.style.height = panel.scrollHeight + "px";
          void panel.offsetHeight; // reflow
          panel.style.height = "0px";
          var closeDone = function () { item.open = false; panel.style.height = ""; panel.removeEventListener("transitionend", closeDone); };
          panel.addEventListener("transitionend", closeDone);
        } else {
          item.open = true;
          var target = panel.scrollHeight;
          panel.style.height = "0px";
          void panel.offsetHeight; // reflow
          panel.style.height = target + "px";
          var openDone = function () { panel.style.height = ""; panel.removeEventListener("transitionend", openDone); };
          panel.addEventListener("transitionend", openDone);
        }
      });
    });
  }

  /* ---- 8. Guided forms: save the lead via Web3Forms, with a WhatsApp fallback ---- */
  function wireForms() {
    var forms = document.querySelectorAll(".wa-form");
    forms.forEach(function (form) {
      var err = form.querySelector(".wa-form__err");
      var btn = form.querySelector("button[type=submit]");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var hp = form.querySelector("input[name=botcheck]");
        if (hp && hp.checked) return; // honeypot: bot filled it
        var fields = form.querySelectorAll("[data-label]");
        var data = {}, lines = [], missing = false;
        fields.forEach(function (f) {
          var val = (f.value || "").trim();
          if (f.hasAttribute("data-required") && !val) { missing = true; f.style.borderColor = "var(--red)"; }
          else { f.style.borderColor = ""; }
          if (val) { data[f.getAttribute("data-label")] = val; lines.push(f.getAttribute("data-label") + ": " + val); }
        });
        if (missing) { if (err) err.textContent = "Please fill in the required fields."; return; }
        if (err) err.textContent = "";
        var intro = form.getAttribute("data-intro") || "New enquiry from the Khairasa website.";
        var waUrl = WA_BASE + "?text=" + encodeURIComponent(intro + "\n\n" + lines.join("\n"));

        // Key not set yet: fall back to the WhatsApp hand-off so nothing breaks.
        if (WEB3_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") { window.open(waUrl, "_blank", "noopener"); return; }

        var payload = { access_key: WEB3_KEY, subject: "New lead: " + (data.Name || "website enquiry"), from_name: "Khairasa Studio website", message: intro + "\n\n" + lines.join("\n") };
        for (var k in data) { if (data.hasOwnProperty(k)) payload[k] = data[k]; }
        if (btn) { btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = "Sending..."; }
        fetch("https://api.web3forms.com/submit", { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(payload) })
          .then(function (r) { return r.json(); })
          .then(function (res) {
            if (!res || !res.success) throw new Error("fail");
            form.innerHTML = '<div class="wa-form__ok"><span class="wa-form__okcheck" aria-hidden="true">✓</span><h3>Thank you, we have your details.</h3><p>We will review and reach out soon. Prefer to talk now? <a href="' + waUrl + '" target="_blank" rel="noopener">Message us on WhatsApp &rarr;</a></p></div>';
          })
          .catch(function () {
            if (btn) { btn.disabled = false; btn.textContent = btn.dataset.t || "Send my details"; }
            if (err) err.innerHTML = 'Could not send right now. Please <a href="' + waUrl + '" target="_blank" rel="noopener" style="color:var(--blue);font-weight:700;">message us on WhatsApp</a> instead.';
          });
      });
    });
  }

  function init() {
    wireWhatsApp();
    wireNavScroll();
    wireMobileMenu();
    wireReveal();
    wireFaq();
    wireForms();
    buildContribGraph();
    wireMisc();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
