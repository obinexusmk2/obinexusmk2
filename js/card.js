/**
 * obix-card.js
 * OBINEXUS Card Component
 * @obinexusltd/obix-sdk-components
 *
 * Usage (HTML):
 *   <obix-card variant="oha" title="OHA" tagline="The shield that breathes" href="/oha">
 *     <span slot="glyph">🛡️</span>
 *     <span slot="roman">PILLAR I</span>
 *     <ul slot="principles">
 *       <li>Breathing rights are non-negotiable</li>
 *     </ul>
 *   </obix-card>
 *
 * Variants: oha | iwu | iji | sdk | default
 */

"use strict";

(function () {
  if (!window.customElements) return;

  /* ── OBIX Lifecycle shim (mirrors @obinexusltd/obix-core API) ── */
  var ObixRuntime = {
    CREATED: "CREATED", UPDATED: "UPDATED", HALTED: "HALTED", DESTROYED: "DESTROYED",
    register: function (name, def) {
      def._name = name;
      return def;
    }
  };

  /* ── Card Template ─────────────────────────────────────────── */
  var CardDef = ObixRuntime.register("obix-card", {
    state: { hovered: false, focused: false },
    render: function (el) {
      var variant  = el.getAttribute("variant") || "default";
      var title    = el.getAttribute("card-title") || el.getAttribute("title") || "";
      var tagline  = el.getAttribute("tagline") || "";
      var href     = el.getAttribute("href") || "#";
      var cta      = el.getAttribute("cta") || "Enter →";
      var glyph    = el.querySelector('[slot="glyph"]') ? el.querySelector('[slot="glyph"]').textContent.trim() : "◆";
      var roman    = el.querySelector('[slot="roman"]') ? el.querySelector('[slot="roman"]').textContent.trim() : "";

      /* collect principles from slot */
      var principlesSlot = el.querySelector('[slot="principles"]');
      var principles = [];
      if (principlesSlot) {
        principlesSlot.querySelectorAll("li").forEach(function (li) {
          principles.push(li.textContent.trim());
        });
      }

      var shadow = el.shadowRoot;

      /* inner card */
      var inner = shadow.querySelector(".obix-card__inner");
      if (!inner) return;

      inner.className = "obix-card__inner obix-card--" + variant;

      shadow.querySelector(".obix-card__glyph").textContent   = glyph;
      shadow.querySelector(".obix-card__roman").textContent   = roman;
      shadow.querySelector(".obix-card__title").textContent   = title;
      shadow.querySelector(".obix-card__tagline").textContent = tagline;
      shadow.querySelector(".obix-card__cta").href            = href;
      shadow.querySelector(".obix-card__cta").textContent     = cta;

      var ul = shadow.querySelector(".obix-card__principles");
      ul.innerHTML = "";
      principles.forEach(function (p) {
        var li = document.createElement("li");
        li.textContent = p;
        ul.appendChild(li);
      });
    }
  });

  /* ── Custom Element ────────────────────────────────────────── */
  class ObixCard extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      this._lifecycle = ObixRuntime.CREATED;
      this.shadowRoot.innerHTML = ObixCard._template();
      this._render();
      this._bindEvents();
      this._lifecycle = ObixRuntime.UPDATED;
    }

    static _template() {
      return `
        <style>
          :host { display: block; height: 100%; }

          .obix-card__inner {
            height: 100%;
            padding: 2.5rem 1.5rem;
            background: #14141F;
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 16px;
            transition: border-color 280ms ease, box-shadow 280ms ease, transform 280ms ease;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }

          .obix-card__inner::before {
            content: '';
            position: absolute;
            inset: 0;
            opacity: 0;
            transition: opacity 500ms ease;
            pointer-events: none;
            border-radius: inherit;
          }

          /* variant colours */
          .obix-card--oha { --accent: #4ECCA3; }
          .obix-card--iwu { --accent: #7B9FFF; }
          .obix-card--iji { --accent: #FF7B7B; }
          .obix-card--sdk { --accent: #FFD700; }
          .obix-card--default { --accent: #F0F0F0; }

          .obix-card--oha::before { background: radial-gradient(ellipse at 0% 0%, rgba(78,204,163,0.14) 0%, transparent 70%); }
          .obix-card--iwu::before { background: radial-gradient(ellipse at 0% 0%, rgba(123,159,255,0.14) 0%, transparent 70%); }
          .obix-card--iji::before { background: radial-gradient(ellipse at 0% 0%, rgba(255,123,123,0.14) 0%, transparent 70%); }
          .obix-card--sdk::before { background: radial-gradient(ellipse at 0% 0%, rgba(255,215,0,0.1) 0%, transparent 70%); }

          :host(:hover) .obix-card__inner,
          :host(:focus-within) .obix-card__inner {
            border-color: rgba(var(--accent-rgb, 240,240,240), 0.4);
            box-shadow: 0 0 60px rgba(var(--accent-rgb, 240,240,240), 0.08);
            transform: translateY(-4px);
          }

          :host(:hover) .obix-card__inner::before { opacity: 1; }

          .obix-card__glyph {
            font-size: 2.2rem;
            line-height: 1;
            margin-bottom: 0.25rem;
          }

          .obix-card__roman {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.6rem;
            letter-spacing: 0.3em;
            text-transform: uppercase;
            color: rgba(160,160,176,0.7);
          }

          .obix-card__title {
            font-family: 'Cinzel Decorative', 'Cinzel', serif;
            font-size: 1.4rem;
            line-height: 1.2;
            color: var(--accent, #F0F0F0);
          }

          .obix-card__tagline {
            font-family: 'Libre Baskerville', Georgia, serif;
            font-style: italic;
            font-size: 0.88rem;
            color: rgba(160,160,176,0.8);
            line-height: 1.6;
          }

          .obix-card__principles {
            list-style: none;
            margin-top: auto;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .obix-card__principles li {
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.7rem;
            color: rgba(160,160,176,0.75);
            padding-left: 1rem;
            position: relative;
            line-height: 1.5;
          }

          .obix-card__principles li::before {
            content: '◆';
            position: absolute;
            left: 0;
            font-size: 0.4rem;
            top: 0.35em;
            color: rgba(180,160,0,0.5);
          }

          .obix-card__cta {
            margin-top: 1rem;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-family: 'Cinzel', serif;
            font-size: 0.7rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            text-decoration: none;
            color: var(--accent, #F0F0F0);
            transition: gap 250ms ease;
          }

          :host(:hover) .obix-card__cta { gap: 14px; }
        </style>

        <div class="obix-card__inner obix-card--default">
          <span class="obix-card__glyph">◆</span>
          <span class="obix-card__roman"></span>
          <h3 class="obix-card__title"></h3>
          <p class="obix-card__tagline"></p>
          <ul class="obix-card__principles"></ul>
          <a class="obix-card__cta" href="#">Enter →</a>
        </div>
      `;
    }

    _render() { CardDef.render(this); }

    _bindEvents() {
      this.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          var href = this.getAttribute("href");
          if (href) window.location.href = href;
        }
      }.bind(this));
    }

    attributeChangedCallback() {
      this._lifecycle = ObixRuntime.UPDATED;
      this._render();
    }

    disconnectedCallback() {
      this._lifecycle = ObixRuntime.DESTROYED;
    }

    static get observedAttributes() {
      return ["variant", "card-title", "tagline", "href", "cta"];
    }
  }

  customElements.define("obix-card", ObixCard);
  window.ObixCard = ObixCard;
})();
