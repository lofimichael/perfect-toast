(function(l,p){typeof exports=="object"&&typeof module<"u"?p(exports):typeof define=="function"&&define.amd?define(["exports"],p):(l=typeof globalThis<"u"?globalThis:l||self,p(l.PerfectToast={}))})(this,(function(l){"use strict";const p={green:{primary:"#00ff00",glow:"rgba(0, 255, 0, 0.5)"},cyan:{primary:"#00ccff",glow:"rgba(0, 204, 255, 0.5)"},red:{primary:"#ff3333",glow:"rgba(255, 51, 51, 0.5)"},amber:{primary:"#ffcc00",glow:"rgba(255, 204, 0, 0.5)"}},y={dark:{background:"rgba(0, 0, 0, 0.85)",unfadedText:"transparent",highlight:"#ffffff"},light:{background:"rgba(255, 255, 255, 0.92)",unfadedText:"transparent",highlight:"#000000"}};function x(e){return p[e]?p[e]:{primary:e,glow:`${e}80`}}function w(e,t){const n={position:"fixed"};return e.startsWith("top")?n.top=`${t}px`:e.startsWith("middle")?(n.top="50%",n.transform="translateY(-50%)"):n.bottom=`${t}px`,e.endsWith("left")?n.left=`${t}px`:e.endsWith("center")?(n.left="50%",n.transform?n.transform="translate(-50%, -50%)":n.transform="translateX(-50%)"):n.right=`${t}px`,n}function k(e){switch(e){case"left":return 90;case"right":return 270;case"up":return 0;case"down":return 180}}let v=!1;function T(){if(v||typeof document>"u")return;const e=document.createElement("style");e.id="perfect-toast-styles",e.textContent=`
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
  `,document.head.appendChild(e),v=!0}let a={...{theme:"green",position:"bottom-left",mode:"auto",direction:"left",duration:4e3,animationSpeed:400,dismissible:!0,pauseOnHover:!0,onShow:()=>{},onDismiss:()=>{},fontFamily:"'Courier New', Consolas, monospace",fontSize:14,margin:16,gap:6,maxVisible:5}};const s=new Map,d=new Map;let C=0;function S(){return`pt-${++C}-${Date.now()}`}function E(){return typeof window>"u"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function I(e){return e==="auto"?E():e}function O(e){if(d.has(e))return d.get(e);const t=document.createElement("div");t.className=`pt-container pt-container--${e}`;const n=w(e,a.margin);return Object.assign(t.style,n),e.startsWith("middle")&&(t.style.alignItems=e.endsWith("left")?"flex-start":e.endsWith("right")?"flex-end":"center"),document.body.appendChild(t),d.set(e,t),t}function P(e){const{message:t,options:n}=e,i=x(n.theme),o=y[I(n.mode)],f=k(n.direction),r=document.createElement("div");r.className="pt-toast pt-toast--entering",n.dismissible&&r.classList.add("pt-toast--dismissible"),r.style.setProperty("--pt-color",i.primary),r.style.setProperty("--pt-glow",i.glow),r.style.setProperty("--pt-highlight",o.highlight),r.style.setProperty("--pt-bg",o.background),r.style.setProperty("--pt-gradient-angle",`${f}deg`),r.style.setProperty("--pt-animation-speed",`${n.animationSpeed}ms`),r.style.setProperty("--pt-font-family",a.fontFamily),r.style.setProperty("--pt-font-size",`${a.fontSize}px`),r.style.setProperty("--pt-gap",`${a.gap}px`);const c=document.createElement("span");return c.className="pt-toast__text",c.textContent=t,r.appendChild(c),n.dismissible&&r.addEventListener("click",()=>m(e.id)),n.pauseOnHover&&(r.addEventListener("mouseenter",()=>L(e.id)),r.addEventListener("mouseleave",()=>M(e.id))),r}function h(e){e.options.duration<=0||(e.timeoutId=window.setTimeout(()=>{m(e.id)},e.remainingTime))}function L(e){const t=s.get(e);!t||t.phase!=="visible"||!t.timeoutId||(window.clearTimeout(t.timeoutId),t.pausedAt=Date.now(),t.timeoutId=null)}function M(e){const t=s.get(e);if(!t||t.phase!=="visible"||!t.pausedAt)return;const n=Date.now()-(t.options.duration-t.remainingTime);t.remainingTime=Math.max(0,t.options.duration-n),t.pausedAt=null,h(t)}function g(e,t){T();const n=S(),i={...a,...t},o={id:n,message:e,options:i,element:null,timeoutId:null,phase:"entering",pausedAt:null,remainingTime:i.duration};if(a.maxVisible>0){const c=Array.from(s.values()).filter(u=>u.phase!=="exiting"&&u.phase!=="removed");if(c.length>=a.maxVisible){const u=c[0];m(u.id)}}s.set(n,o);const f=O(i.position),r=P(o);return o.element=r,i.position.startsWith("bottom")?f.insertBefore(r,f.firstChild):f.appendChild(r),setTimeout(()=>{o.phase==="entering"&&(o.phase="visible",r.classList.remove("pt-toast--entering"),r.classList.add("pt-toast--visible"),o.options.onShow?.(),h(o))},i.animationSpeed),n}function m(e){const t=s.get(e);!t||t.phase==="exiting"||t.phase==="removed"||(t.phase="exiting",t.timeoutId&&(window.clearTimeout(t.timeoutId),t.timeoutId=null),t.element?(t.element.style.setProperty("--pt-reveal","-40%"),t.element.classList.remove("pt-toast--visible"),t.element.classList.add("pt-toast--exiting"),setTimeout(()=>{b(e)},t.options.animationSpeed)):b(e))}function b(e){const t=s.get(e);if(!t)return;t.phase="removed",t.element?.remove(),t.options.onDismiss?.(),s.delete(e);const n=d.get(t.options.position);n&&n.children.length===0&&(n.remove(),d.delete(t.options.position))}function _(){for(const e of s.keys())m(e)}function $(e,t){const n=s.get(e);if(!(!n||!n.element)&&t.message){n.message=t.message;const i=n.element.querySelector(".pt-toast__text");i&&(i.textContent=t.message)}}function A(e){a={...a,...e}}function D(){return{...a}}const W=Object.assign(g,{dismiss:m,dismissAll:_,update:$,configure:A,getConfig:D,success:(e,t)=>g(e,{...t,theme:"green"}),info:(e,t)=>g(e,{...t,theme:"cyan"}),error:(e,t)=>g(e,{...t,theme:"red"}),warning:(e,t)=>g(e,{...t,theme:"amber"})});l.toast=W,Object.defineProperty(l,Symbol.toStringTag,{value:"Module"})}));
