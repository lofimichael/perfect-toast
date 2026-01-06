const f = {
  green: { primary: "#00ff00", glow: "rgba(0, 255, 0, 0.5)" },
  cyan: { primary: "#00ccff", glow: "rgba(0, 204, 255, 0.5)" },
  red: { primary: "#ff3333", glow: "rgba(255, 51, 51, 0.5)" },
  amber: { primary: "#ffcc00", glow: "rgba(255, 204, 0, 0.5)" }
}, b = {
  dark: {
    background: "rgba(0, 0, 0, 0.85)",
    unfadedText: "transparent",
    // Invisible until revealed
    highlight: "#ffffff"
    // White leading edge in dark mode
  },
  light: {
    background: "rgba(255, 255, 255, 0.92)",
    unfadedText: "transparent",
    // Invisible until revealed
    highlight: "#000000"
    // Black leading edge in light mode
  }
};
function y(e) {
  return f[e] ? f[e] : {
    primary: e,
    glow: `${e}80`
    // 50% opacity
  };
}
function x(e, t) {
  const r = {
    position: "fixed"
  };
  return e.startsWith("top") ? r.top = `${t}px` : e.startsWith("middle") ? (r.top = "50%", r.transform = "translateY(-50%)") : r.bottom = `${t}px`, e.endsWith("left") ? r.left = `${t}px` : e.endsWith("center") ? (r.left = "50%", r.transform ? r.transform = "translate(-50%, -50%)" : r.transform = "translateX(-50%)") : r.right = `${t}px`, r;
}
function w(e) {
  switch (e) {
    case "left":
      return 90;
    // left to right
    case "right":
      return 270;
    // right to left
    case "up":
      return 0;
    // bottom to top
    case "down":
      return 180;
  }
}
let u = !1;
function k() {
  if (u || typeof document > "u") return;
  const e = document.createElement("style");
  e.id = "perfect-toast-styles", e.textContent = `
    .pt-container {
      position: fixed;
      z-index: 9999;
      pointer-events: none;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .pt-container--top-left,
    .pt-container--bottom-left,
    .pt-container--middle-left {
      align-items: flex-start;
    }

    .pt-container--top-center,
    .pt-container--bottom-center,
    .pt-container--middle-center {
      align-items: center;
    }

    .pt-container--top-right,
    .pt-container--bottom-right,
    .pt-container--middle-right {
      align-items: flex-end;
    }

    .pt-container--top-left,
    .pt-container--top-center,
    .pt-container--top-right {
      flex-direction: column;
    }

    .pt-container--bottom-left,
    .pt-container--bottom-center,
    .pt-container--bottom-right {
      flex-direction: column-reverse;
    }

    .pt-toast {
      pointer-events: auto;
      font-family: var(--pt-font-family, 'Courier New', Consolas, monospace);
      font-size: var(--pt-font-size, 14px);
      padding: 4px 8px;
      margin: var(--pt-gap, 6px) 0;
      background: var(--pt-bg);
      border: 1px solid transparent;
      position: relative;
      max-width: 400px;
      width: fit-content;
      box-sizing: border-box;
      /* Mask controls overall visibility - 40% gradient leading edge */
      -webkit-mask-image: linear-gradient(
        var(--pt-gradient-angle),
        black calc(var(--pt-reveal, 0%) - 40%),
        white var(--pt-reveal, 0%),
        transparent calc(var(--pt-reveal, 0%) + 2%)
      );
      mask-image: linear-gradient(
        var(--pt-gradient-angle),
        black calc(var(--pt-reveal, 0%) - 40%),
        white var(--pt-reveal, 0%),
        transparent calc(var(--pt-reveal, 0%) + 2%)
      );
    }

    /* Border with 40% gradient to bright edge */
    .pt-toast::before {
      content: '';
      position: absolute;
      inset: -1px;
      pointer-events: none;
      /* Set border properties individually - shorthand resets border-image */
      border-width: 1px;
      border-style: solid;
      border-color: transparent;
      border-image: linear-gradient(
        var(--pt-gradient-angle),
        var(--pt-color) calc(var(--pt-reveal, 0%) - 40%),
        var(--pt-highlight) var(--pt-reveal, 0%),
        transparent calc(var(--pt-reveal, 0%) + 2%)
      ) 1;
    }

    .pt-toast--dismissible {
      cursor: pointer;
    }

    /* Text with 40% gradient to bright edge */
    .pt-toast__text {
      background: linear-gradient(
        var(--pt-gradient-angle),
        var(--pt-color) calc(var(--pt-reveal, 0%) - 40%),
        var(--pt-highlight) var(--pt-reveal, 0%),
        transparent calc(var(--pt-reveal, 0%) + 2%)
      );
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.3;
    }

    /* Enter animation - everything reveals together via --pt-reveal */
    .pt-toast--entering {
      animation: pt-reveal var(--pt-animation-speed, 400ms) ease-out forwards;
    }

    /* Visible state - keep gradient structure but fully revealed (no style switch = no brightness pop) */
    .pt-toast--visible {
      --pt-reveal: 150%;
    }

    /* Exit animation - clean sweep to transparent (no bright edge) */
    .pt-toast--exiting {
      animation: pt-fade-out var(--pt-animation-speed, 400ms) ease-in forwards;
      /* Mask: transparent sweeps left-to-right, no bright edge */
      -webkit-mask-image: linear-gradient(
        var(--pt-gradient-angle),
        transparent calc(var(--pt-reveal, 0%) - 2%),
        black calc(var(--pt-reveal, 0%) + 40%)
      );
      mask-image: linear-gradient(
        var(--pt-gradient-angle),
        transparent calc(var(--pt-reveal, 0%) - 2%),
        black calc(var(--pt-reveal, 0%) + 40%)
      );
    }

    .pt-toast--exiting::before {
      /* Must set border properties individually - shorthand resets border-image */
      border-width: 1px;
      border-style: solid;
      border-color: transparent;
      border-image: linear-gradient(
        var(--pt-gradient-angle),
        transparent calc(var(--pt-reveal, 0%) - 2%),
        var(--pt-color) calc(var(--pt-reveal, 0%) + 40%)
      ) 1;
    }

    .pt-toast--exiting .pt-toast__text {
      background: linear-gradient(
        var(--pt-gradient-angle),
        transparent calc(var(--pt-reveal, 0%) - 2%),
        var(--pt-color) calc(var(--pt-reveal, 0%) + 40%)
      );
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    @keyframes pt-reveal {
      from { --pt-reveal: -40%; }
      to { --pt-reveal: 105%; }
    }

    @keyframes pt-fade-out {
      from { --pt-reveal: -40%; }
      to { --pt-reveal: 105%; }
    }

    /* Register custom properties for animation */
    @property --pt-reveal {
      syntax: '<percentage>';
      inherits: true;
      initial-value: -40%;
    }

    @property --pt-highlight {
      syntax: '<color>';
      inherits: true;
      initial-value: white;
    }
  `, document.head.appendChild(e), u = !0;
}
const C = {
  theme: "green",
  position: "bottom-left",
  mode: "auto",
  direction: "left",
  duration: 4e3,
  animationSpeed: 400,
  dismissible: !0,
  pauseOnHover: !0,
  onShow: () => {
  },
  onDismiss: () => {
  },
  fontFamily: "'Courier New', Consolas, monospace",
  // Can set to '"Press Start 2P"' for pixel font
  fontSize: 14,
  margin: 16,
  gap: 6,
  maxVisible: 5
};
let o = { ...C };
const s = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map();
let T = 0;
function S() {
  return `pt-${++T}-${Date.now()}`;
}
function E() {
  return typeof window > "u" || window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function I(e) {
  return e === "auto" ? E() : e;
}
function $(e) {
  if (d.has(e))
    return d.get(e);
  const t = document.createElement("div");
  t.className = `pt-container pt-container--${e}`;
  const r = x(e, o.margin);
  return Object.assign(t.style, r), e.startsWith("middle") && (t.style.alignItems = e.endsWith("left") ? "flex-start" : e.endsWith("right") ? "flex-end" : "center"), document.body.appendChild(t), d.set(e, t), t;
}
function L(e) {
  const { message: t, options: r } = e, a = y(r.theme), i = b[I(r.mode)], p = w(r.direction), n = document.createElement("div");
  n.className = "pt-toast pt-toast--entering", r.dismissible && n.classList.add("pt-toast--dismissible"), n.style.setProperty("--pt-color", a.primary), n.style.setProperty("--pt-glow", a.glow), n.style.setProperty("--pt-highlight", i.highlight), n.style.setProperty("--pt-bg", i.background), n.style.setProperty("--pt-gradient-angle", `${p}deg`), n.style.setProperty("--pt-animation-speed", `${r.animationSpeed}ms`), n.style.setProperty("--pt-font-family", o.fontFamily), n.style.setProperty("--pt-font-size", `${o.fontSize}px`), n.style.setProperty("--pt-gap", `${o.gap}px`);
  const l = document.createElement("span");
  return l.className = "pt-toast__text", l.textContent = t, n.appendChild(l), r.dismissible && n.addEventListener("click", () => g(e.id)), r.pauseOnHover && (n.addEventListener("mouseenter", () => M(e.id)), n.addEventListener("mouseleave", () => O(e.id))), n;
}
function h(e) {
  e.options.duration <= 0 || (e.timeoutId = window.setTimeout(() => {
    g(e.id);
  }, e.remainingTime));
}
function M(e) {
  const t = s.get(e);
  !t || t.phase !== "visible" || !t.timeoutId || (window.clearTimeout(t.timeoutId), t.pausedAt = Date.now(), t.timeoutId = null);
}
function O(e) {
  const t = s.get(e);
  if (!t || t.phase !== "visible" || !t.pausedAt) return;
  const r = Date.now() - (t.options.duration - t.remainingTime);
  t.remainingTime = Math.max(0, t.options.duration - r), t.pausedAt = null, h(t);
}
function c(e, t) {
  k();
  const r = S(), a = {
    ...o,
    ...t
  }, i = {
    id: r,
    message: e,
    options: a,
    element: null,
    timeoutId: null,
    phase: "entering",
    pausedAt: null,
    remainingTime: a.duration
  };
  if (o.maxVisible > 0) {
    const l = Array.from(s.values()).filter(
      (m) => m.phase !== "exiting" && m.phase !== "removed"
    );
    if (l.length >= o.maxVisible) {
      const m = l[0];
      g(m.id);
    }
  }
  s.set(r, i);
  const p = $(a.position), n = L(i);
  return i.element = n, a.position.startsWith("bottom") ? p.insertBefore(n, p.firstChild) : p.appendChild(n), setTimeout(() => {
    i.phase === "entering" && (i.phase = "visible", n.classList.remove("pt-toast--entering"), n.classList.add("pt-toast--visible"), i.options.onShow?.(), h(i));
  }, a.animationSpeed), r;
}
function g(e) {
  const t = s.get(e);
  !t || t.phase === "exiting" || t.phase === "removed" || (t.phase = "exiting", t.timeoutId && (window.clearTimeout(t.timeoutId), t.timeoutId = null), t.element ? (t.element.style.setProperty("--pt-reveal", "-40%"), t.element.classList.remove("pt-toast--visible"), t.element.classList.add("pt-toast--exiting"), setTimeout(() => {
    v(e);
  }, t.options.animationSpeed)) : v(e));
}
function v(e) {
  const t = s.get(e);
  if (!t) return;
  t.phase = "removed", t.element?.remove(), t.options.onDismiss?.(), s.delete(e);
  const r = d.get(t.options.position);
  r && r.children.length === 0 && (r.remove(), d.delete(t.options.position));
}
function P() {
  for (const e of s.keys())
    g(e);
}
function _(e, t) {
  const r = s.get(e);
  if (!(!r || !r.element) && t.message) {
    r.message = t.message;
    const a = r.element.querySelector(".pt-toast__text");
    a && (a.textContent = t.message);
  }
}
function A(e) {
  o = { ...o, ...e };
}
function W() {
  return { ...o };
}
const z = Object.assign(c, {
  dismiss: g,
  dismissAll: P,
  update: _,
  configure: A,
  getConfig: W,
  // Themed shortcuts
  success: (e, t) => c(e, { ...t, theme: "green" }),
  info: (e, t) => c(e, { ...t, theme: "cyan" }),
  error: (e, t) => c(e, { ...t, theme: "red" }),
  warning: (e, t) => c(e, { ...t, theme: "amber" })
});
export {
  z as toast
};
