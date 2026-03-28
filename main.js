/**
 * main.js
 * OBINEXUS — obinexus.org
 * OBIX Runtime Bootstrap
 * @obinexusltd/obix-core
 *
 * Bootstraps the OBIX component lifecycle on the landing page.
 * Wires scroll-reveal, SDK carousel, and constitutional animations.
 */

"use strict";

/* ─── SCROLL REVEAL ─────────────────────────────────────── */
(function initScrollReveal() {
  var els = document.querySelectorAll(".ob-reveal");
  if (!els.length) return;

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(function (el) { obs.observe(el); });
})();

/* ─── BREATHING PULSE ───────────────────────────────────── */
(function initBreathing() {
  document.querySelectorAll(".ob-breathe").forEach(function (el) {
    el.style.animationDelay = (Math.random() * 2) + "s";
  });
})();

/* ─── ACTIVE NAV ────────────────────────────────────────── */
(function initActiveNav() {
  var path = window.location.pathname;
  document.querySelectorAll(".ob-nav__links a, .ob-nav__pillar-links a").forEach(function (a) {
    if (a.getAttribute("href") === path) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });
})();

/* ─── SDK CAROUSEL INIT ─────────────────────────────────── */
document.addEventListener("DOMContentLoaded", function () {
  var carousel = document.querySelector("obix-carousel");
  if (carousel && window.OBIX_SDK_PACKAGES) {
    /* already loaded via carousel.js — items auto-set */
    console.log("[OBIX] SDK carousel ready — " + window.OBIX_SDK_PACKAGES.length + " packages");
  }

  /* ── UPOW Constitutional Calculator ─────────────────── */
  var calcInput = document.getElementById("ob-upow-input");
  var calcOutput = document.getElementById("ob-upow-output");
  if (calcInput && calcOutput) {
    calcInput.addEventListener("input", function () {
      var n = parseInt(this.value, 10);
      if (isNaN(n) || n < 0) { calcOutput.textContent = "—"; return; }
      /* UPOW(n) = 3^n — Minimal Breathing Legislation Computation */
      var result = Math.pow(3, n);
      calcOutput.textContent = result.toLocaleString();
    });
  }

  /* ── Announce current section to screen readers ──────── */
  document.querySelectorAll("section[id]").forEach(function (sec) {
    var heading = sec.querySelector("h1,h2,h3");
    if (heading && !heading.id) {
      heading.id = sec.id + "-heading";
      sec.setAttribute("aria-labelledby", heading.id);
    }
  });

  console.log("%cOBINEXUS — When Systems Fail, Build Your Own",
    "color:#FFD700;font-family:serif;font-size:1.2rem;font-weight:bold;");
  console.log("%c@obinexusltd/obix v0.1.x — 50 packages published",
    "color:#00FFFF;font-family:monospace;font-size:0.85rem;");
});
