/* ==========================================================================
   Portfolio Nico Bodmer — Interaktion
   Reihenfolge: Helpers · Sprache · Theme · Menü · Scroll · Komponenten · Init
   Alles ohne Framework; jede Animation respektiert prefers-reduced-motion.
   ========================================================================== */
(function () {
  "use strict";

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  var reduced = function () { return reducedMQ.matches; };

  var I18N = window.NB_I18N || { ui: { de: {}, en: {} }, en: {} };
  var lang = "de";
  var theme = document.documentElement.getAttribute("data-theme") || "dark";

  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

  /* ---------------------------------------------------------------- Sprache */
  var META = {
    de: {
      title: "Nico Bodmer — Websites & digitale Projekte",
      desc: "Nico Bodmer baut Websites und eigene Anwendungen. Hauptberuflich im Data-&-AI-Umfeld bei IBM Schweiz, Studium Digital Business & AI an der HWZ Zürich."
    },
    en: {
      title: "Nico Bodmer — Websites & digital projects",
      desc: "Nico Bodmer builds websites and his own applications. Day job in data & AI at IBM Switzerland, studying Digital Business & AI at HWZ Zurich."
    }
  };

  function applyLang(next) {
    lang = next === "en" ? "en" : "de";
    var dict = I18N.en || {};

    $$("[data-i18n], [data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n") || el.getAttribute("data-i18n-html");
      if (el.__de == null) el.__de = el.innerHTML;
      var value = lang === "en" && dict[key] != null ? dict[key] : el.__de;
      el.innerHTML = value;
    });

    $$("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (el.__deAria == null) el.__deAria = el.getAttribute("aria-label") || "";
      el.setAttribute("aria-label", lang === "en" && dict[key] != null ? dict[key] : el.__deAria);
    });

    document.documentElement.setAttribute("lang", lang);
    document.title = META[lang].title;
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute("content", META[lang].desc);

    store("nb-lang", lang);
    paintLabels();
    resetReveal();
  }

  function paintLabels() {
    var ui = (I18N.ui && I18N.ui[lang]) || {};
    $$("[data-lang-toggle]").forEach(function (b) {
      b.textContent = ui.lang || (lang === "de" ? "EN" : "DE");
      b.setAttribute("aria-label", lang === "de" ? "Switch to English" : "Auf Deutsch umschalten");
    });
    $$("[data-theme-toggle]").forEach(function (b) {
      b.textContent = theme === "dark" ? (ui.themeToLight || "Light") : (ui.themeToDark || "Dark");
      b.setAttribute("aria-label", theme === "dark"
        ? (lang === "de" ? "Helles Design aktivieren" : "Switch to light theme")
        : (lang === "de" ? "Dunkles Design aktivieren" : "Switch to dark theme"));
    });
    var label = $("[data-copy-label]");
    if (label && !label.__busy) label.textContent = ((I18N.ui[lang] || {}).copy) || label.textContent;
  }

  /* ------------------------------------------------------------------ Theme */
  function setTheme(next) {
    theme = next;
    document.documentElement.setAttribute("data-theme", next);
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "dark" ? "#0E1220" : "#E7E2D6");
    store("nb-theme", next);
    paintLabels();
    onScroll();
  }

  function toggleTheme() {
    var next = theme === "dark" ? "light" : "dark";
    var wipe = $("[data-wipe]");
    if (!wipe || reduced()) { setTheme(next); return; }

    wipe.style.display = "block";
    wipe.style.clipPath = "inset(0 100% 0 0)";
    wipe.style.transition = "clip-path 400ms cubic-bezier(.2,.7,.2,1)";
    requestAnimationFrame(function () { wipe.style.clipPath = "inset(0 0 0 0)"; });

    setTimeout(function () {
      setTheme(next);
      wipe.style.transition = "clip-path 300ms cubic-bezier(.2,.7,.2,1)";
      wipe.style.clipPath = "inset(0 0 0 100%)";
      setTimeout(function () { wipe.style.display = "none"; }, 320);
    }, 400);
  }

  /* ------------------------------------------------------------------- Menü */
  var menu = $("[data-menu]");
  var scrim = $("[data-menu-close].menu-scrim");
  var menuBtn = $("[data-menu-open]");
  var lastFocus = null;

  function openMenu() {
    if (!menu) return;
    lastFocus = document.activeElement;
    menu.hidden = false;
    if (scrim) scrim.hidden = false;
    document.body.style.overflow = "hidden";
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
    var first = $(".menu__close", menu);
    if (first) first.focus();
  }

  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    if (scrim) scrim.hidden = true;
    document.body.style.overflow = "";
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function trapFocus(e) {
    if (!menu || menu.hidden || e.key !== "Tab") return;
    var items = $$('a[href], button:not([disabled])', menu);
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* --------------------------------------------------- Reveal (Wort-für-Wort) */
  var revealIO = null;

  function initReveal() {
    var heads = $$("[data-reveal]");
    heads.forEach(function (h) {
      if (h.getAttribute("data-reveal-done")) return;
      h.setAttribute("data-reveal-done", "1");
      var words = (h.textContent || "").trim().split(/\s+/);
      h.textContent = "";
      words.forEach(function (word, i) {
        var outer = document.createElement("span");
        outer.className = "reveal-word";
        var inner = document.createElement("span");
        inner.textContent = word;
        inner.style.transitionDelay = i * 40 + "ms";
        outer.appendChild(inner);
        h.appendChild(outer);
        if (i < words.length - 1) h.appendChild(document.createTextNode(" "));
      });
    });

    if (reduced()) { heads.forEach(function (h) { h.classList.add("is-revealed"); }); return; }

    if (revealIO) revealIO.disconnect();
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        revealIO.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15 });

    heads.forEach(function (h) {
      if (h.classList.contains("is-revealed")) return;
      if (h.getBoundingClientRect().top < window.innerHeight) h.classList.add("is-revealed");
      else revealIO.observe(h);
    });
  }

  /* Nach einem Sprachwechsel sind die Wort-Spans weg — neu aufbauen. */
  function resetReveal() {
    $$("[data-reveal]").forEach(function (h) {
      h.removeAttribute("data-reveal-done");
      h.classList.remove("is-revealed");
    });
    initReveal();
  }

  /* ---------------------------------------------------------------- Zähler */
  function initCounters() {
    var els = $$("[data-count]");
    if (!els.length || reduced()) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        io.unobserve(el);
        var target = parseInt(el.getAttribute("data-count"), 10);
        if (!target) return;
        var from = Math.max(0, target - 40);
        var t0 = performance.now();
        (function tick(t) {
          var p = Math.min(1, (t - t0) / 480);
          el.textContent = String(Math.round(from + (target - from) * p));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------- Werdegang */
  function setRow(row, open) {
    var head = $(".row__head", row);
    var detail = $(".row__detail", row);
    if (!head || !detail) return;
    head.setAttribute("aria-expanded", open ? "true" : "false");
    detail.style.maxHeight = open ? detail.scrollHeight + 20 + "px" : "0";
    detail.style.opacity = open ? "1" : "0";
    row.__open = open;
  }

  function initRows() {
    var group = $("[data-dimgroup]");
    $$("[data-row]").forEach(function (row) {
      var head = $(".row__head", row);
      if (!head) return;

      head.addEventListener("click", function () { setRow(row, !row.__open); });

      row.addEventListener("mouseenter", function () {
        if (!finePointer.matches) return;
        row.classList.add("is-hovered");
        if (group) group.classList.add("is-dimmed");
        setRow(row, true);
      });
      row.addEventListener("mouseleave", function () {
        if (!finePointer.matches) return;
        row.classList.remove("is-hovered");
        if (group) group.classList.remove("is-dimmed");
        setRow(row, false);
      });
    });

    /* Offene Zeilen nach Resize / Sprachwechsel nachmessen */
    window.addEventListener("resize", function () {
      $$("[data-row]").forEach(function (row) { if (row.__open) setRow(row, true); });
    });
  }

  /* ---------------------------------------------------------------- Skills */
  function initSkills() {
    $$("[data-skill]").forEach(function (skill) {
      var stations = (skill.getAttribute("data-stations") || "").split(",").map(function (s) { return s.trim(); });

      var on = function () {
        skill.classList.add("is-active");
        stations.forEach(function (id) {
          $$('[data-station="' + id + '"]').forEach(function (row) { row.classList.add("is-linked"); });
        });
      };
      var off = function () {
        skill.classList.remove("is-active");
        $$("[data-station]").forEach(function (row) { row.classList.remove("is-linked"); });
      };

      skill.addEventListener("mouseenter", on);
      skill.addEventListener("mouseleave", off);
      skill.addEventListener("focusin", on);
      skill.addEventListener("focusout", off);
      skill.setAttribute("tabindex", "0");
    });
  }

  /* -------------------------------------------------------------- Projekte */
  function paintFilter(cat) {
    $$("[data-filter]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-filter") === cat ? "true" : "false");
    });
    $$("[data-card]").forEach(function (card) {
      var show = cat === "alle" || card.getAttribute("data-cat") === cat;
      if (show) {
        card.hidden = false;
        requestAnimationFrame(function () { card.style.opacity = "1"; card.style.transform = "none"; });
      } else {
        card.style.opacity = "0";
        card.style.transform = "scale(0.98)";
        setTimeout(function () { if (card.style.opacity === "0") card.hidden = true; }, reduced() ? 0 : 240);
      }
    });
  }

  function initCards() {
    $$("[data-filter]").forEach(function (b) {
      b.addEventListener("click", function () { paintFilter(b.getAttribute("data-filter")); });
    });

    $$("[data-card]").forEach(function (card) {
      card.addEventListener("mouseenter", function () {
        if (!finePointer.matches) return;
        $$("[data-card]").forEach(function (other) { if (other !== card && !other.hidden) other.style.opacity = "0.55"; });
        card.style.borderColor = "var(--or)";
        var zoom = $("[data-zoom]", card);
        if (zoom && !reduced()) zoom.style.transform = "scale(1.03)";
      });
      card.addEventListener("mouseleave", function () {
        if (!finePointer.matches) return;
        $$("[data-card]").forEach(function (other) { if (!other.hidden) other.style.opacity = "1"; });
        card.style.borderColor = "";
        var zoom = $("[data-zoom]", card);
        if (zoom) zoom.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------- Vorher/Nachher */
  function initBeforeAfter() {
    var box = $("[data-ba]");
    if (!box) return;
    var before = $("[data-ba-before]", box);
    var beforeImg = $("[data-ba-img]", box);
    var handle = $("[data-ba-handle]", box);
    var knob = $("[data-ba-knob]", box);
    if (!before || !handle) return;

    var sizeImg = function () { if (beforeImg) beforeImg.style.width = box.getBoundingClientRect().width + "px"; };
    sizeImg();
    window.addEventListener("resize", sizeImg);

    var setPct = function (pct) {
      pct = Math.min(96, Math.max(4, pct));
      before.style.width = pct + "%";
      handle.style.left = pct + "%";
      if (knob) knob.setAttribute("aria-valuenow", Math.round(pct));
    };
    var setFromX = function (clientX) {
      var r = box.getBoundingClientRect();
      setPct(((clientX - r.left) / r.width) * 100);
    };

    var dragging = false;
    box.addEventListener("pointerdown", function (e) {
      dragging = true;
      try { box.setPointerCapture(e.pointerId); } catch (err) {}
      setFromX(e.clientX);
    });
    box.addEventListener("pointermove", function (e) { if (dragging) setFromX(e.clientX); });
    box.addEventListener("pointerup", function () { dragging = false; });
    box.addEventListener("pointercancel", function () { dragging = false; });

    if (knob) {
      knob.addEventListener("click", function (e) { e.preventDefault(); });
      knob.addEventListener("keydown", function (e) {
        var now = parseFloat(knob.getAttribute("aria-valuenow")) || 50;
        var step = e.shiftKey ? 10 : 4;
        if (e.key === "ArrowLeft") { e.preventDefault(); setPct(now - step); }
        else if (e.key === "ArrowRight") { e.preventDefault(); setPct(now + step); }
        else if (e.key === "Home") { e.preventDefault(); setPct(4); }
        else if (e.key === "End") { e.preventDefault(); setPct(96); }
      });
    }
  }

  /* -------------------------------------------------------- Magnet-Buttons */
  function initMagnet() {
    if (reduced() || !finePointer.matches) return;
    $$("[data-magnet]").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        var dx = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 4;
        var dy = ((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 4;
        b.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }

  /* ------------------------------------------------------- E-Mail kopieren */
  function initCopy() {
    $$("[data-copy]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.getAttribute("data-copy");
        var label = $("[data-copy-label]", btn);
        var done = function () {
          if (!label) return;
          var ui = I18N.ui[lang] || {};
          label.__busy = true;
          label.textContent = ui.copied || "Kopiert";
          setTimeout(function () {
            label.__busy = false;
            label.textContent = (I18N.ui[lang] || {}).copy || "Kopieren";
          }, 1800);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(value).then(done, done);
        } else {
          var ta = document.createElement("textarea");
          ta.value = value; ta.setAttribute("readonly", "");
          ta.style.position = "absolute"; ta.style.left = "-9999px";
          document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(ta);
          done();
        }
      });
    });
  }

  /* ------------------------------------------------- Wisch-Geste (mobil) */
  function initSwipe() {
    var line = $("[data-swipe-line]");
    var startX = null;
    document.addEventListener("touchstart", function (e) {
      var t = e.touches[0];
      if (t.clientX > window.innerWidth - 42) {
        startX = t.clientX;
        if (line) { line.style.display = "block"; line.style.left = t.clientX + "px"; }
      }
    }, { passive: true });
    document.addEventListener("touchmove", function (e) {
      if (startX === null) return;
      if (line) line.style.left = e.touches[0].clientX + "px";
    }, { passive: true });
    document.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var moved = startX - e.changedTouches[0].clientX;
      if (line) line.style.display = "none";
      startX = null;
      if (moved > window.innerWidth * 0.25) toggleTheme();
    }, { passive: true });
  }

  /* ----------------------------------------------------------- Scroll-Logik */
  var lastY = 0;

  function onScroll() {
    var y = window.scrollY;

    var bar = $("[data-progress]");
    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? Math.min(1, y / max) * 100 : 0).toFixed(2) + "%";
    }

    var pill = $("[data-pill]");
    if (pill) {
      var show = y > window.innerHeight * 0.9 && !(y > lastY + 6);
      pill.classList.toggle("is-visible", show);
    }
    lastY = y;

    /* Logo + Menü-Label nehmen die Textfarbe der Sektion darunter an */
    var under = null;
    $$("[data-section]").forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= 30 && r.bottom > 30) under = s;
    });
    var ink = under ? getComputedStyle(under).color : "#F4F1EA";
    $$("[data-mark]").forEach(function (m) { m.style.color = ink; });

    var active = null;
    $$("[data-nav]").forEach(function (a) {
      var sec = document.getElementById(a.getAttribute("data-nav"));
      if (!sec) return;
      var r = sec.getBoundingClientRect();
      if (r.top <= window.innerHeight * 0.4 && r.bottom > window.innerHeight * 0.25) active = a;
    });
    $$("[data-nav]").forEach(function (a) { a.classList.toggle("is-active", a === active); });

    if (reduced()) return;

    var photo = $("[data-hero-photo]");
    if (photo) {
      /* Sehr dezent: stärkeres Zoomen würde das 1024px-Bild sichtbar weichzeichnen */
      var p = Math.min(1, y / 400);
      photo.style.transform = "scale(" + (1.03 - 0.03 * p).toFixed(3) + ")";
    }

    var par = $("[data-parallax]");
    if (par && par.parentElement) {
      var box = par.parentElement.getBoundingClientRect();
      var mid = (box.top + box.height / 2 - window.innerHeight / 2) / window.innerHeight;
      par.style.transform = "translateY(" + Math.max(-40, Math.min(40, -mid * 60)).toFixed(1) + "px)";
    }
  }

  /* -------------------------------------------------------------------- Init */
  function init() {
    var savedTheme = read("nb-theme");
    setTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : theme);

    var savedLang = read("nb-lang");
    applyLang(savedLang === "en" ? "en" : "de");

    initReveal();
    initCounters();
    initRows();
    initSkills();
    initCards();
    initBeforeAfter();
    initMagnet();
    initCopy();
    initSwipe();
    paintFilter("alle");

    $$("[data-theme-toggle]").forEach(function (b) { b.addEventListener("click", toggleTheme); });
    $$("[data-lang-toggle]").forEach(function (b) {
      b.addEventListener("click", function () { applyLang(lang === "de" ? "en" : "de"); });
    });

    if (menuBtn) menuBtn.addEventListener("click", openMenu);
    $$("[data-menu-close]").forEach(function (b) { b.addEventListener("click", closeMenu); });
    $$(".menu__link").forEach(function (a) { a.addEventListener("click", closeMenu); });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { closeMenu(); return; }
      trapFocus(e);
      if (e.key !== "t" && e.key !== "T") return;
      var tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.metaKey || e.ctrlKey || e.altKey) return;
      toggleTheme();
    });

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { onScroll(); ticking = false; });
    }, { passive: true });
    window.addEventListener("resize", onScroll);

    var yearEl = $("[data-year]");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    onScroll();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
