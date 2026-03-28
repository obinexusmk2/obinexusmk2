/**
 * obix-parallax.js
 * OBINEXUS Parallax Canvas Layer
 * Combines: Lotus flower field + HemiSphere wireframe
 * @obinexusltd/obix — Heart/Soul SDK
 *
 * Loads the lotus and hemisphere compositors as a unified
 * constitutional background canvas for obinexus.org.
 */

"use strict";

/* ─── VECTOR MODULE (inlined from OBIX core) ─────────────── */
var Vector;
(function (Vector) {
  var Vec2 = function (x, y) { this.x = x; this.y = y; };
  Vec2.prototype.add = function (v) {
    if (v instanceof Vec2) { this.x += v.x; this.y += v.y; }
    else { this.x += v; this.y += v; }
    return this;
  };
  Vec2.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };
  Vec2.prototype.clone = function () { return new Vec2(this.x, this.y); };
  Vector.Vec2 = Vec2;

  var Vec3 = function (x, y, z) { this.x = x; this.y = y; this.z = z; };
  Vec3.prototype.set = function (x, y, z) { this.x = x; this.y = y; this.z = z; return this; };
  Vec3.prototype.add = function (v) {
    if (v instanceof Vec3) { this.x += v.x; this.y += v.y; this.z += v.z; }
    else { this.x += v; this.y += v; this.z += v; }
    return this;
  };
  Vec3.prototype.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  };
  Vec3.prototype.rotateX = function (angle) {
    var y = this.y, z = this.z;
    this.y = y * Math.cos(angle) - z * Math.sin(angle);
    this.z = z * Math.cos(angle) + y * Math.sin(angle);
  };
  Vec3.prototype.rotateY = function (angle) {
    var x = this.x, z = this.z;
    this.x = x * Math.cos(angle) + z * Math.sin(angle);
    this.z = z * Math.cos(angle) - x * Math.sin(angle);
  };
  Vec3.prototype.rotateZ = function (angle) {
    var x = this.x, y = this.y;
    this.x = x * Math.cos(angle) - y * Math.sin(angle);
    this.y = y * Math.cos(angle) + x * Math.sin(angle);
  };
  Vec3.prototype.clone = function () { return new Vec3(this.x, this.y, this.z); };
  Vec3.prototype.toString = function () {
    return "Vec3<" + this.x + "," + this.y + "," + this.z + ">";
  };
  Vector.Vec3 = Vec3;
})(Vector = Vector || {});

/* ─── HEMISPHERE COMPOSITOR ──────────────────────────────── */
var OBIXHemiSphere = function (opts) {
  this.origin  = opts.origin  || new Vector.Vec3(0, 0, 0);
  this.radius  = opts.radius  || 50;
  this.detail  = opts.detail  || 10;
  this.vertices = [];
  this.normals  = [];
  this.faces    = [];
  this.uvs      = [];
  this._build();
};

OBIXHemiSphere.prototype._build = function () {
  this.vertices = []; this.normals = []; this.faces = []; this.uvs = [];
  var d = this.detail, r = this.radius;
  var v = new Vector.Vec3(0,0,0), n = new Vector.Vec3(0,0,0);

  /* vertices */
  for (var i = 0; i < d; i++) {
    var theta = (Math.PI * i) / d;
    for (var j = 0; j < d; j++) {
      var phi = (Math.PI * j) / d;
      v.x = r * Math.sin(theta) * Math.cos(phi);
      v.y = r * -Math.sin(theta) * Math.sin(phi);
      v.z = r * Math.cos(theta);
      this.vertices.push(v.x, v.y, v.z);
    }
  }
  /* normals */
  for (var i = 0; i < d; i++) {
    var theta = (2 * Math.PI * i) / d;
    for (var j = 0; j < d; j++) {
      var phi = (Math.PI * j) / d;
      n.x = Math.sin(theta) * Math.cos(phi);
      n.y = Math.sin(theta) * Math.sin(phi);
      n.z = Math.cos(theta);
      this.normals.push(n.x, n.y, n.z);
    }
  }
  /* faces */
  for (var i = 0; i < d; i++) {
    for (var j = 0; j < d; j++) {
      var a = i * d + j, b = (i+1)*d+j, c = (i+1)*d+(j+1), dd = i*d+(j+1);
      this.faces.push(a, b, c, a, c, dd);
    }
  }
};

OBIXHemiSphere.prototype.rotateX = function (angle) {
  var verts = this.vertices, norms = this.normals;
  var v = new Vector.Vec3(0,0,0), n = new Vector.Vec3(0,0,0);
  for (var i = 0; i < verts.length; i += 3) {
    v.set(verts[i], verts[i+1], verts[i+2]);
    n.set(norms[i], norms[i+1], norms[i+2]);
    v.rotateX(angle); n.rotateX(angle);
    verts[i]=v.x; verts[i+1]=v.y; verts[i+2]=v.z;
    norms[i]=n.x; norms[i+1]=n.y; norms[i+2]=n.z;
  }
};

OBIXHemiSphere.prototype.rotateY = function (angle) {
  var verts = this.vertices, norms = this.normals;
  var v = new Vector.Vec3(0,0,0), n = new Vector.Vec3(0,0,0);
  for (var i = 0; i < verts.length; i += 3) {
    v.set(verts[i], verts[i+1], verts[i+2]);
    n.set(norms[i], norms[i+1], norms[i+2]);
    v.rotateY(angle); n.rotateY(angle);
    verts[i]=v.x; verts[i+1]=v.y; verts[i+2]=v.z;
    norms[i]=n.x; norms[i+1]=n.y; norms[i+2]=n.z;
  }
};

OBIXHemiSphere.prototype.drawWireframe = function (ctx, alpha) {
  var faces = this.faces, verts = this.vertices, origin = this.origin;
  var v1 = new Vector.Vec3(0,0,0), v2 = new Vector.Vec3(0,0,0), v3 = new Vector.Vec3(0,0,0);
  ctx.beginPath();
  ctx.strokeStyle = "rgba(74,14,78," + (alpha || 0.9) + ")";
  ctx.lineWidth = 0.4;
  for (var i = 0; i < faces.length; i += 3) {
    var a=faces[i], b=faces[i+1], c=faces[i+2];
    v1.set(verts[a*3],verts[a*3+1],verts[a*3+2]);
    v2.set(verts[b*3],verts[b*3+1],verts[b*3+2]);
    v3.set(verts[c*3],verts[c*3+1],verts[c*3+2]);
    v1.add(origin); v2.add(origin); v3.add(origin);
    ctx.moveTo(v1.x,v1.y);
    ctx.lineTo(v2.x,v2.y);
    ctx.lineTo(v3.x,v3.y);
    ctx.lineTo(v1.x,v1.y);
  }
  ctx.stroke();
};

/* ─── LOTUS COMPOSITOR ───────────────────────────────────── */
var OBIXLotus = function (ctx, opts) {
  this.ctx = ctx;
  this.x   = opts.x;   this.initialX = opts.x;
  this.y   = opts.y;   this.initialY = opts.y;
  this.dx  = opts.dx || 0;
  this.dy  = opts.dy || 0;
  this.radius   = opts.radius;
  this.nPetals  = opts.nPetals;
  this.colours  = opts.colours;
  this.angle    = 0;
  this.parallaxFactor = opts.parallaxFactor || 0.08;
};

OBIXLotus.prototype.draw = function () {
  var ctx = this.ctx;
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  ctx.translate(-this.x, -this.y);

  for (var i = 0; i < this.nPetals; i++) {
    var ang = (i / this.nPetals) * Math.PI * 2;
    var x1 = this.x + Math.cos(ang) * this.radius;
    var y1 = this.y + Math.sin(ang) * this.radius;
    var ang2 = ang + Math.PI / this.nPetals;
    var x2 = this.x + Math.cos(ang2) * this.radius;
    var y2 = this.y + Math.sin(ang2) * this.radius;

    /* opposite petal */
    var oAng  = ang + Math.PI;
    var ox1   = this.x + Math.cos(oAng) * this.radius;
    var oy1   = this.y + Math.sin(oAng) * this.radius;
    var oAng2 = oAng + Math.PI / this.nPetals;
    var ox2   = this.x + Math.cos(oAng2) * this.radius;
    var oy2   = this.y + Math.sin(oAng2) * this.radius;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    ctx.lineTo(this.x, this.y);
    ctx.quadraticCurveTo(ox2, oy2, ox1, oy1);

    var grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    for (var j = 0; j < this.colours.length; j++) {
      grad.addColorStop(j / this.colours.length, this.colours[j]);
    }
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.closePath();
  }

  /* centre */
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius / 5, 0, Math.PI * 2);
  ctx.fillStyle = this.colours[0];
  ctx.fill();
  ctx.closePath();
  ctx.restore();
};

OBIXLotus.prototype.move = function () {
  this.angle += 0.004;
  this.x += this.dx;
  this.y += this.dy;
  var W = this.ctx.canvas.width, H = this.ctx.canvas.height;
  if (this.x - this.radius < 0 || this.x + this.radius > W) this.dx = -this.dx;
  if (this.y - this.radius < 0 || this.y + this.radius > H) this.dy = -this.dy;
  this.dx *= 0.99;
};

/* ─── PARALLAX SCENE COMPOSITOR ─────────────────────────── */
var OBIXParallaxScene = (function () {
  var canvas, ctx, W, H;
  var sphere, lotuses;
  var running = false;
  var raf;
  var fadeIn = 0;

  function rand(min, max) { return Math.random() * (max - min) + min; }

  /* OBINexus palette lotuses */
  var PALETTE_SETS = [
    /* Sovereign — purple + gold */
    ["rgba(74,14,78,0.6)",  "rgba(123,30,130,0.4)", "rgba(255,215,0,0.15)", "rgba(10,10,15,0.3)"],
    /* OHA — teal shield */
    ["rgba(26,107,90,0.5)", "rgba(78,204,163,0.3)", "rgba(0,255,255,0.1)",  "rgba(10,10,15,0.3)"],
    /* IWU — law indigo */
    ["rgba(42,63,143,0.5)", "rgba(123,159,255,0.3)","rgba(0,200,255,0.1)",  "rgba(10,10,15,0.3)"],
    /* IJI — equity crimson */
    ["rgba(143,42,42,0.5)", "rgba(255,123,123,0.3)","rgba(255,107,53,0.15)","rgba(10,10,15,0.3)"],
  ];

  function buildLotuses() {
    lotuses = [];
    for (var i = 0; i < 18; i++) {
      lotuses.push(new OBIXLotus(ctx, {
        x: rand(0, W), y: rand(0, H),
        radius: rand(20, 55),
        nPetals: Math.floor(rand(4, 8)),
        dx: rand(-0.6, 0.6), dy: rand(-0.6, 0.6),
        colours: PALETTE_SETS[i % PALETTE_SETS.length],
        parallaxFactor: rand(0.04, 0.12)
      }));
    }
  }

  function buildSphere() {
    sphere = new OBIXHemiSphere({
      radius: Math.min(W, H) * 0.38,
      origin: new Vector.Vec3(W / 2, H / 2, 0),
      detail: 14
    });
  }

  function tick() {
    if (!running) return;
    if (fadeIn < 1) fadeIn = Math.min(1, fadeIn + 0.008);

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.globalAlpha = fadeIn * 0.28; /* stays subtle behind content */

    /* lotuses first */
    lotuses.forEach(function (l) { l.draw(); l.move(); });

    /* sphere on top */
    ctx.globalAlpha = fadeIn * 0.18;
    sphere.rotateX(0.003);
    sphere.rotateY(0.002);
    sphere.drawWireframe(ctx, 1);

    ctx.restore();
    raf = requestAnimationFrame(tick);
  }

  function resize() {
    if (!canvas) return;
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildSphere();
    buildLotuses();
  }

  return {
    init: function (canvasEl) {
      canvas = canvasEl;
      ctx = canvas.getContext("2d");
      resize();
      window.addEventListener("resize", resize);

      /* mouse parallax on lotuses */
      document.addEventListener("mousemove", function (e) {
        var cx = W / 2, cy = H / 2;
        lotuses.forEach(function (l) {
          l.x = l.initialX + (e.clientX - cx) * l.parallaxFactor;
          l.y = l.initialY + (e.clientY - cy) * l.parallaxFactor;
        });
      });

      running = true;
      tick();
    },
    stop: function () {
      running = false;
      cancelAnimationFrame(raf);
    }
  };
})();

/* ─── OBIX WEB COMPONENT: parallax ──────────────────────── */
(function () {
  if (!window.customElements) return;

  class ObixParallax extends HTMLElement {
    connectedCallback() {
      this.style.cssText = "position:fixed;inset:0;z-index:0;pointer-events:none;";
      var canvas = document.createElement("canvas");
      canvas.style.cssText = "width:100%;height:100%;display:block;";
      this.appendChild(canvas);
      OBIXParallaxScene.init(canvas);
    }
    disconnectedCallback() {
      OBIXParallaxScene.stop();
    }
  }

  customElements.define("obix-parallax", ObixParallax);
})();

/* auto-attach if canvas#ob-canvas-bg exists */
document.addEventListener("DOMContentLoaded", function () {
  var legacy = document.getElementById("ob-canvas-bg");
  if (legacy) OBIXParallaxScene.init(legacy);
});
