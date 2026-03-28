/**
 * obix-carousel.js
 * OBINEXUS Carousel Component — SDK Package Viewer
 * @obinexusltd/obix-sdk-components
 *
 * Usage:
 *   <obix-carousel id="sdk-carousel"></obix-carousel>
 *
 * Data driven via JS:
 *   document.getElementById('sdk-carousel').setItems([...])
 */

"use strict";

(function () {
  if (!window.customElements) return;

  /* SDK package data (from @obinexusltd npm registry — 50 packages) */
  window.OBIX_SDK_PACKAGES = [
    { name: "@obinexusltd/obix-core",                    desc: "Heart/Soul runtime engine — component lifecycle, state halting, data-oriented arch" },
    { name: "@obinexusltd/obix-components",              desc: "Base UI primitives — accessibility-first, FUD-mitigating components" },
    { name: "@obinexusltd/obix-sdk",                     desc: "Heart/Soul UI/UX SDK — data-oriented, accessibility-first software development kit" },
    { name: "@obinexusltd/obix-cli",                     desc: "Build tooling, schema validation, semantic version X management" },
    { name: "@obinexusltd/obix-sdk-core",                desc: "UI/UX runtime engine — component lifecycle, state halting, data-oriented arch" },
    { name: "@obinexusltd/obix-sdk-accessibility",       desc: "WCAG 2.2 enforcement, focus management, ARIA automation" },
    { name: "@obinexusltd/obix-sdk-state",               desc: "State machine minimization (automata-based state management)" },
    { name: "@obinexusltd/obix-sdk-router",              desc: "SPA navigation with scroll restoration, deep linking" },
    { name: "@obinexusltd/obix-sdk-forms",               desc: "Validation, autocomplete, progressive enhancement" },
    { name: "@obinexusltd/obix-sdk-motion",              desc: "Animation system respecting prefers-reduced-motion" },
    { name: "@obinexusltd/obix-sdk-telemetry",           desc: "State tracking, policy decorators, QA matrix integration" },
    { name: "@obinexusltd/obix-sdk-adapter",             desc: "DP Adapter — data-oriented paradigm translation layer" },
    { name: "@obinexusltd/obix-binding-typescript",      desc: "Primary web runtime, Node.js & browser" },
    { name: "@obinexusltd/obix-binding-python",          desc: "ML/AI integration, data science workflows" },
    { name: "@obinexusltd/obix-binding-rust",            desc: "Performance-critical components, WebAssembly target" },
    { name: "@obinexusltd/obix-binding-go",              desc: "Backend microservices, concurrent state management" },
    { name: "@obinexusltd/obix-binding-swift",           desc: "iOS/macOS native rendering bridge" },
    { name: "@obinexusltd/obix-binding-java-kotlin",     desc: "Android native, enterprise backend" },
    { name: "@obinexusltd/obix-binding-cpp",             desc: "Legacy system integration, embedded targets" },
    { name: "@obinexusltd/obix-binding-csharp",          desc: "Unity integration, .NET ecosystem" },
    { name: "@obinexusltd/obix-binding-lua",             desc: "Game engine integration (Love2D, Roblox), scripting" },
    { name: "@obinexusltd/obix-binding-zig",             desc: "Systems programming, compile-time optimization" },
    { name: "@obinexusltd/obix-driver-accessibility-tree", desc: "ARIA/live region management and screen reader bridge" },
    { name: "@obinexusltd/obix-driver-animation-frame",  desc: "requestAnimationFrame scheduling and timeline orchestration" },
    { name: "@obinexusltd/obix-driver-compositor",       desc: "Layer management, z-index optimization, and occlusion culling" },
    { name: "@obinexusltd/obix-driver-dom-mutation",     desc: "Efficient DOM diffing/patching" },
    { name: "@obinexusltd/obix-driver-font-layout",      desc: "Text measurement, web font loading, and layout calculation" },
    { name: "@obinexusltd/obix-driver-gpu-acceleration", desc: "WebGL/WebGPU canvas rendering and shader management" },
    { name: "@obinexusltd/obix-driver-input-event",      desc: "Unified touch/mouse/keyboard/pointer event normalization" },
    { name: "@obinexusltd/obix-driver-media-query",      desc: "Responsive breakpoint detection and safe-area handling" },
    { name: "@obinexusltd/obix-driver-network-stream",   desc: "WebSocket/SSE for telemetry and real-time state sync" },
    { name: "@obinexusltd/obix-driver-storage-persistence", desc: "LocalStorage/IndexedDB wrapper for state caching" },
    { name: "@obinexusltd/aerossr",                      desc: "High-performance TypeScript-first server-side rendering framework" },
    { name: "@obinexusltd/dom-asm",                      desc: "DOM manipulation library using AST-based state tracking" },
    { name: "@obinexusltd/obix-config-typescript",       desc: "TypeScript configuration for OBIX CLI and SDK packages" },
    { name: "@obinexusltd/obix-config-rollup",           desc: "Rollup bundler configuration for OBIX CLI and SDK packages" },
    { name: "@obinexusltd/obix-config-babel",            desc: "Babel configuration for OBIX CLI and SDK packages" },
    { name: "@obinexusltd/obix-config-jest",             desc: "Jest test configuration for OBIX CLI and SDK packages" },
    { name: "@obinexusltd/obix-config-eslint",           desc: "ESLint configuration for OBIX CLI and SDK packages" },
    { name: "@obinexusltd/obix-config-prettier",         desc: "Prettier configuration for OBIX CLI and SDK packages" },
    { name: "@obinexusltd/obix-config-webpack",          desc: "Webpack bundler configuration for OBIX CLI and SDK packages" },
    { name: "@obinexusltd/obix-adapter",                 desc: "DP Adapter — data-oriented paradigm translation layer" },
    { name: "@obinexusltd/obix-telemetry",               desc: "State tracking, policy decorators, QA matrix integration" },
    { name: "@obinexusltd/obix-forms",                   desc: "Validation, autocomplete, progressive enhancement" },
    { name: "@obinexusltd/obix-accessibility",           desc: "WCAG 2.2 enforcement, focus management, ARIA automation" },
    { name: "@obinexusltd/obix-router",                  desc: "SPA navigation with scroll restoration, deep linking" },
    { name: "@obinexusltd/obix-state",                   desc: "State machine minimization (automata-based state management)" },
    { name: "@obinexusltd/obix-motion",                  desc: "Animation system respecting prefers-reduced-motion" },
    { name: "@obinexusltd/obix",                         desc: "Heart/Soul UI/UX SDK — the complete OBIX SDK meta-package" },
    { name: "@obinexusltd/obix-sdk-cli",                 desc: "Build tooling, schema validation, semantic version X management" },
  ];

  class ObixCarousel extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._offset  = 0;
      this._items   = window.OBIX_SDK_PACKAGES;
      this._itemW   = 280; /* px per card */
      this._gap     = 16;
    }

    connectedCallback() {
      this.shadowRoot.innerHTML = ObixCarousel._template();
      this._track   = this.shadowRoot.querySelector(".obix-carousel__track");
      this._btnPrev = this.shadowRoot.querySelector(".obix-carousel__btn--prev");
      this._btnNext = this.shadowRoot.querySelector(".obix-carousel__btn--next");
      this._counter = this.shadowRoot.querySelector(".obix-carousel__counter");
      this._renderItems();
      this._bindEvents();
      this._updateCounter();
    }

    setItems(items) {
      this._items = items;
      this._offset = 0;
      this._renderItems();
    }

    _renderItems() {
      if (!this._track) return;
      this._track.innerHTML = "";
      this._items.forEach(function (pkg) {
        var item = document.createElement("div");
        item.className = "obix-carousel__item";
        item.innerHTML =
          '<div class="obix-carousel__pkg-name">' + pkg.name + '</div>' +
          '<div class="obix-carousel__pkg-desc">' + pkg.desc + '</div>' +
          '<a class="obix-carousel__pkg-link" href="https://npmjs.com/package/' +
          encodeURIComponent(pkg.name) + '" target="_blank" rel="noopener">npm →</a>';
        this._track.appendChild(item);
      }.bind(this));
      this._updateTransform();
    }

    _bindEvents() {
      var self = this;
      this._btnPrev.addEventListener("click", function () { self._slide(-1); });
      this._btnNext.addEventListener("click", function () { self._slide(1); });

      /* touch/swipe */
      var startX = 0;
      this.shadowRoot.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });
      this.shadowRoot.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) self._slide(dx < 0 ? 1 : -1);
      }, { passive: true });
    }

    _slide(dir) {
      var visCount = Math.floor(this.offsetWidth / (this._itemW + this._gap)) || 3;
      var max = Math.max(0, this._items.length - visCount);
      this._offset = Math.max(0, Math.min(max, this._offset + dir));
      this._updateTransform();
      this._updateCounter();
    }

    _updateTransform() {
      if (!this._track) return;
      var shift = this._offset * (this._itemW + this._gap);
      this._track.style.transform = "translateX(-" + shift + "px)";
    }

    _updateCounter() {
      if (!this._counter) return;
      var visCount = Math.floor(this.offsetWidth / (this._itemW + this._gap)) || 3;
      this._counter.textContent =
        (this._offset + 1) + "–" +
        Math.min(this._offset + visCount, this._items.length) +
        " of " + this._items.length;
    }

    static _template() {
      return `
        <style>
          :host { display: block; position: relative; }

          .obix-carousel__wrapper { overflow: hidden; }

          .obix-carousel__track {
            display: flex;
            gap: 16px;
            transition: transform 500ms cubic-bezier(0.4,0,0.2,1);
          }

          .obix-carousel__item {
            flex: 0 0 280px;
            background: #14141F;
            border: 1px solid rgba(255,215,0,0.08);
            border-radius: 8px;
            padding: 1rem 1.25rem;
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
            transition: border-color 250ms ease, background 250ms ease;
          }

          .obix-carousel__item:hover {
            border-color: rgba(0,255,255,0.25);
            background: #0F0F18;
          }

          .obix-carousel__pkg-name {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.68rem;
            color: #00FFFF;
            word-break: break-all;
            line-height: 1.4;
          }

          .obix-carousel__pkg-desc {
            font-size: 0.78rem;
            color: rgba(160,160,176,0.8);
            line-height: 1.5;
            font-family: 'Libre Baskerville', Georgia, serif;
            flex: 1;
          }

          .obix-carousel__pkg-link {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.64rem;
            color: rgba(255,215,0,0.6);
            text-decoration: none;
            letter-spacing: 0.1em;
            margin-top: auto;
            align-self: flex-start;
            transition: color 150ms ease;
          }
          .obix-carousel__pkg-link:hover { color: #FFD700; }

          .obix-carousel__footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 1rem;
            padding: 0 0.25rem;
          }

          .obix-carousel__controls {
            display: flex;
            gap: 8px;
          }

          .obix-carousel__btn {
            width: 36px; height: 36px;
            border-radius: 50%;
            background: #14141F;
            border: 1px solid rgba(255,215,0,0.2);
            color: #FFD700;
            font-size: 1rem;
            cursor: pointer;
            transition: background 200ms, border-color 200ms;
            display: flex; align-items: center; justify-content: center;
          }

          .obix-carousel__btn:hover {
            background: rgba(255,215,0,0.08);
            border-color: #FFD700;
          }

          .obix-carousel__counter {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.65rem;
            color: rgba(160,160,176,0.5);
            letter-spacing: 0.1em;
          }
        </style>

        <div class="obix-carousel__wrapper">
          <div class="obix-carousel__track"></div>
        </div>

        <div class="obix-carousel__footer">
          <span class="obix-carousel__counter">— of —</span>
          <div class="obix-carousel__controls">
            <button class="obix-carousel__btn obix-carousel__btn--prev" aria-label="Previous">‹</button>
            <button class="obix-carousel__btn obix-carousel__btn--next" aria-label="Next">›</button>
          </div>
        </div>
      `;
    }
  }

  customElements.define("obix-carousel", ObixCarousel);
  window.ObixCarousel = ObixCarousel;
})();
