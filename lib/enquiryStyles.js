// Styles for the Enquiry popup (Request a Sample). Scoped under .eq-root.
export const ENQUIRY_CSS = `
.eq-root{--eq-navy:#0a2540;--eq-orange:#f58b32;--eq-orange-d:#e07a22;--eq-ink:#1c1c1c;--eq-bg:#fcfcfa;--eq-line:#e4e0d6;--eq-muted:#6b7280;--eq-err:#c0392b;--eq-ease:cubic-bezier(.22,1,.36,1);
  position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;padding:24px;font-family:inherit;color:var(--eq-ink)}
.eq-back{position:absolute;inset:0;background:rgba(10,37,64,.62);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:eq-fade .3s ease both}
.eq-root[data-closing="true"] .eq-back{animation:eq-fade-out .26s ease both}
.eq-panel{position:relative;display:grid;grid-template-columns:340px minmax(0,1fr);width:min(1040px,100%);height:min(720px,calc(100dvh - 48px));background:var(--eq-bg);border-radius:28px;overflow:hidden;box-shadow:0 40px 90px -20px rgba(10,37,64,.55);animation:eq-pop .5s var(--eq-ease) both}
.eq-root[data-closing="true"] .eq-panel{animation:eq-pop-out .26s ease both}

/* ---- side ---- */
.eq-side{position:relative;display:flex;flex-direction:column;padding:34px 32px 30px;background:linear-gradient(165deg,#0a2540 0%,#0d3158 100%);color:#fff;overflow:hidden}
.eq-side::before{content:"";position:absolute;inset-inline-end:-120px;top:-120px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(245,139,50,.38),rgba(245,139,50,0) 70%);animation:eq-float 9s ease-in-out infinite}
.eq-side::after{content:"";position:absolute;inset-inline-start:-90px;bottom:-110px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.1),rgba(255,255,255,0) 70%);animation:eq-float 11s ease-in-out infinite reverse}
.eq-side>*{position:relative;z-index:1}
.eq-logo{align-self:flex-start;background:#fff;border-radius:12px;padding:10px 14px;line-height:0}
.eq-logo img{width:150px;height:auto}
.eq-side-eyebrow{margin:30px 0 0;font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:var(--eq-orange)}
.eq-side-h{margin:10px 0 0;font-size:26px;line-height:1.25;font-weight:600;letter-spacing:-.01em}
.eq-side-t{margin:12px 0 0;font-size:14.5px;line-height:1.6;color:rgba(255,255,255,.78)}
.eq-points{list-style:none;margin:20px 0 0;padding:0;display:grid;gap:10px}
.eq-points li{display:flex;align-items:center;gap:10px;font-size:14px;color:rgba(255,255,255,.9)}
.eq-points svg{flex:0 0 auto;width:18px;height:18px;color:var(--eq-orange)}
.eq-contact{margin-top:auto;padding-top:22px;border-top:1px solid rgba(255,255,255,.16);display:grid;gap:10px;font-size:14px}
.eq-contact a{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none;transition:color .2s}
.eq-contact a:hover{color:var(--eq-orange)}
.eq-contact svg{width:18px;height:18px;flex:0 0 auto;color:var(--eq-orange)}
.eq-contact small{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.55)}
.eq-ltr{direction:ltr;unicode-bidi:embed}

/* ---- main ---- */
.eq-main{display:flex;flex-direction:column;min-width:0;min-height:0}
.eq-head{display:block}
.eq-top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:22px 32px 0}
.eq-count{font-size:13px;font-weight:600;color:var(--eq-muted);letter-spacing:.02em}
.eq-count b{color:var(--eq-orange);font-weight:700}
.eq-count b::before{content:" \\00b7  ";color:var(--eq-muted);font-weight:400}
.eq-grab,.eq-mlogo{display:none}
.eq-x{width:40px;height:40px;display:grid;place-items:center;border:0;border-radius:50%;background:transparent;color:var(--eq-navy);cursor:pointer;transition:background .2s,transform .35s var(--eq-ease)}
.eq-x:hover{background:rgba(10,37,64,.07);transform:rotate(90deg)}
.eq-x svg{width:20px;height:20px}
.eq-bar{display:flex;gap:6px;padding:14px 32px 0}
.eq-seg{position:relative;flex:1;height:5px;border-radius:5px;background:var(--eq-line);overflow:hidden}
.eq-seg i{position:absolute;inset:0;background:var(--eq-orange);transform:scaleX(0);transform-origin:left;transition:transform .55s var(--eq-ease)}
[dir="rtl"] .eq-seg i{transform-origin:right}
.eq-seg[data-on="true"] i{transform:scaleX(1)}
.eq-body{flex:1;min-height:0;overflow-y:auto;padding:22px 32px 8px;overscroll-behavior:contain}
.eq-step{animation:eq-in-fwd .5s var(--eq-ease) both}
.eq-step[data-dir="back"]{animation-name:eq-in-back}
[dir="rtl"] .eq-step{animation-name:eq-in-back}
[dir="rtl"] .eq-step[data-dir="back"]{animation-name:eq-in-fwd}
.eq-eyebrow{margin:0;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--eq-orange)}
.eq-h{margin:6px 0 0;font-size:30px;line-height:1.2;font-weight:600;letter-spacing:-.015em;color:var(--eq-navy)}
.eq-sub{margin:8px 0 0;font-size:15px;line-height:1.55;color:var(--eq-muted)}
.eq-field{margin-top:18px}
.eq-sub + .eq-field,.eq-h + .eq-field{margin-top:22px}
.eq-l{display:block;margin:0 0 7px;font-size:14px;font-weight:600;color:var(--eq-navy)}
.eq-l em{font-style:normal;color:var(--eq-orange-d);margin-inline-start:3px}
.eq-l span{font-weight:400;color:var(--eq-muted);margin-inline-start:6px;font-size:13px}
.eq-in,.eq-sel,.eq-ta{width:100%;box-sizing:border-box;padding:0 14px;height:50px;border:1.5px solid var(--eq-line);border-radius:12px;background:#fff;color:var(--eq-ink);font:inherit;font-size:15px;transition:border-color .2s,box-shadow .25s,transform .25s var(--eq-ease)}
.eq-ta{height:auto;min-height:96px;padding:12px 14px;resize:vertical;line-height:1.5}
.eq-in::placeholder,.eq-ta::placeholder{color:#a3a8b1}
.eq-in:hover,.eq-sel:hover,.eq-ta:hover{border-color:#cfc9ba}
.eq-in:focus,.eq-sel:focus,.eq-ta:focus{outline:none;border-color:var(--eq-orange);box-shadow:0 0 0 4px rgba(245,139,50,.16)}
.eq-sel{appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%230a2540' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-inline-end:40px}
[dir="rtl"] .eq-sel{background-position:left 14px center}
.eq-in[aria-invalid="true"]{border-color:var(--eq-err)}
.eq-g2{display:grid;grid-template-columns:1fr 1fr;gap:0 16px}
.eq-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.eq-opts[data-cols="3"]{grid-template-columns:repeat(3,minmax(0,1fr))}
.eq-opt{position:relative;display:flex;flex-direction:column;justify-content:center;gap:3px;min-height:52px;padding:12px 44px 12px 16px;text-align:start;border:1.5px solid var(--eq-line);border-radius:14px;background:#fff;color:var(--eq-navy);font:inherit;font-size:14.5px;font-weight:500;cursor:pointer;transition:border-color .2s,background .25s,transform .3s var(--eq-ease),box-shadow .3s;animation:eq-up .5s var(--eq-ease) both;animation-delay:calc(var(--i,0)*40ms)}
[dir="rtl"] .eq-opt{padding:12px 16px 12px 44px}
.eq-opt:hover{border-color:var(--eq-orange);transform:translateY(-2px);box-shadow:0 10px 22px -14px rgba(10,37,64,.35)}
.eq-opt:focus-visible{outline:none;box-shadow:0 0 0 4px rgba(245,139,50,.22);border-color:var(--eq-orange)}
.eq-opt small{font-size:12.5px;font-weight:400;color:var(--eq-muted);line-height:1.35}
.eq-opt[aria-checked="true"]{border-color:var(--eq-orange);background:rgba(245,139,50,.09);font-weight:600}
.eq-tick{position:absolute;inset-inline-end:14px;top:50%;width:22px;height:22px;margin-top:-11px;border-radius:50%;border:1.5px solid var(--eq-line);display:grid;place-items:center;color:#fff;transition:background .25s,border-color .25s,transform .35s var(--eq-ease)}
.eq-tick svg{width:12px;height:12px;stroke-dasharray:20;stroke-dashoffset:20;transition:stroke-dashoffset .35s var(--eq-ease) .05s}
.eq-opt[aria-checked="true"] .eq-tick{background:var(--eq-orange);border-color:var(--eq-orange);transform:scale(1.08)}
.eq-opt[aria-checked="true"] .eq-tick svg{stroke-dashoffset:0}
.eq-err{margin:14px 0 0;padding:10px 14px;border-radius:10px;background:rgba(192,57,43,.08);color:var(--eq-err);font-size:13.5px;animation:eq-shake .4s ease both}
.eq-other{animation:eq-up .4s var(--eq-ease) both}
.eq-rv{margin-top:18px;border:1px solid var(--eq-line);border-radius:16px;background:#fff;overflow:hidden}
.eq-row{display:flex;justify-content:space-between;gap:20px;padding:11px 18px;font-size:14px;border-bottom:1px dashed var(--eq-line);animation:eq-up .45s var(--eq-ease) both;animation-delay:calc(var(--i,0)*35ms)}
.eq-row:last-child{border-bottom:0}
.eq-row span:first-child{color:var(--eq-muted);flex:0 0 auto}
.eq-row span:last-child{font-weight:600;color:var(--eq-navy);text-align:end;overflow-wrap:anywhere}
.eq-consent{display:flex;gap:12px;align-items:flex-start;margin-top:18px;font-size:14px;line-height:1.5;color:var(--eq-ink);cursor:pointer}
.eq-consent input{position:absolute;opacity:0;pointer-events:none}
.eq-box{flex:0 0 auto;width:22px;height:22px;margin-top:1px;border-radius:7px;border:1.5px solid #c9c4b6;background:#fff;display:grid;place-items:center;color:#fff;transition:background .2s,border-color .2s,transform .3s var(--eq-ease)}
.eq-box svg{width:13px;height:13px;stroke-dasharray:20;stroke-dashoffset:20;transition:stroke-dashoffset .3s var(--eq-ease)}
.eq-consent input:checked + .eq-box{background:var(--eq-orange);border-color:var(--eq-orange);transform:scale(1.06)}
.eq-consent input:checked + .eq-box svg{stroke-dashoffset:0}
.eq-consent input:focus-visible + .eq-box{box-shadow:0 0 0 4px rgba(245,139,50,.25)}

/* ---- footer nav ---- */
.eq-nav{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 32px 24px;border-top:1px solid rgba(10,37,64,.06);background:var(--eq-bg)}
.eq-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:50px;padding:0 26px;border-radius:12px;border:0;font:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:transform .25s var(--eq-ease),background .2s,box-shadow .25s,border-color .2s,opacity .2s}
.eq-btn svg{width:16px;height:16px;transition:transform .3s var(--eq-ease)}
[dir="rtl"] .eq-btn svg.eq-arr{transform:scaleX(-1)}
.eq-btn svg.eq-flip{transform:scaleX(-1)}
[dir="rtl"] .eq-btn svg.eq-flip{transform:none}
.eq-primary{background:var(--eq-orange);color:#fff}
.eq-primary:hover{background:var(--eq-orange-d);transform:translateY(-2px);box-shadow:0 14px 24px -12px rgba(245,139,50,.7)}
.eq-primary:hover svg.eq-arr{transform:translateX(3px)}
[dir="rtl"] .eq-primary:hover svg.eq-arr{transform:scaleX(-1) translateX(3px)}
.eq-ghost{background:transparent;color:var(--eq-navy);border:1.5px solid var(--eq-line)}
.eq-ghost:hover{border-color:var(--eq-orange);color:var(--eq-orange-d)}
.eq-btn[disabled]{opacity:.6;cursor:progress;transform:none;box-shadow:none}
.eq-btn:focus-visible,.eq-x:focus-visible{outline:none;box-shadow:0 0 0 4px rgba(245,139,50,.3)}
.eq-spin{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:eq-rot .7s linear infinite}

/* ---- success ---- */
.eq-done{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:100%;padding:10px 0 20px;animation:eq-in-fwd .6s var(--eq-ease) both}
.eq-ok{position:relative;width:92px;height:92px;border-radius:50%;background:rgba(245,139,50,.12);display:grid;place-items:center}
.eq-ok::before{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid var(--eq-orange);opacity:0;animation:eq-ring 1.4s ease-out .3s both}
.eq-ok svg{width:46px;height:46px;color:var(--eq-orange)}
.eq-ok circle{stroke-dasharray:140;stroke-dashoffset:140;animation:eq-draw .7s var(--eq-ease) .15s forwards}
.eq-ok path{stroke-dasharray:40;stroke-dashoffset:40;animation:eq-draw .5s var(--eq-ease) .65s forwards}
.eq-done h2{margin:22px 0 0;font-size:32px;line-height:1.2;font-weight:600;letter-spacing:-.015em;color:var(--eq-navy);animation:eq-up .6s var(--eq-ease) .35s both}
.eq-done p{margin:10px 0 0;max-width:430px;font-size:15.5px;line-height:1.6;color:var(--eq-muted);animation:eq-up .6s var(--eq-ease) .45s both}
.eq-done .eq-resp{color:var(--eq-navy);font-weight:600}
.eq-alt{margin-top:22px;display:flex;flex-wrap:wrap;gap:10px;justify-content:center;animation:eq-up .6s var(--eq-ease) .55s both}
.eq-alt a{display:inline-flex;align-items:center;gap:8px;height:46px;padding:0 18px;border-radius:12px;border:1.5px solid var(--eq-line);background:#fff;color:var(--eq-navy);font-size:14px;font-weight:600;text-decoration:none;transition:border-color .2s,transform .25s var(--eq-ease)}
.eq-alt a:hover{border-color:var(--eq-orange);transform:translateY(-2px)}
.eq-alt a.eq-wa{background:#1fa855;border-color:#1fa855;color:#fff}
.eq-alt svg{width:18px;height:18px}

@keyframes eq-fade{from{opacity:0}to{opacity:1}}
@keyframes eq-fade-out{to{opacity:0}}
@keyframes eq-pop{from{opacity:0;transform:translateY(28px) scale(.96)}to{opacity:1;transform:none}}
@keyframes eq-pop-out{to{opacity:0;transform:translateY(16px) scale(.98)}}
@keyframes eq-in-fwd{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:none}}
@keyframes eq-in-back{from{opacity:0;transform:translateX(-28px)}to{opacity:1;transform:none}}
@keyframes eq-up{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes eq-shake{0%{opacity:0;transform:translateX(-6px)}40%{opacity:1;transform:translateX(5px)}70%{transform:translateX(-3px)}100%{transform:none}}
@keyframes eq-float{0%,100%{transform:translate(0,0)}50%{transform:translate(-18px,16px)}}
@keyframes eq-draw{to{stroke-dashoffset:0}}
@keyframes eq-ring{0%{opacity:.7;transform:scale(1)}100%{opacity:0;transform:scale(1.55)}}
@keyframes eq-rot{to{transform:rotate(360deg)}}

@media (max-width:860px){
  .eq-root{padding:0;align-items:flex-end}
  .eq-panel{grid-template-columns:1fr;grid-template-rows:minmax(0,1fr);width:100%;height:94dvh;border-radius:28px 28px 0 0;background:var(--eq-navy);animation-name:eq-sheet;animation-fill-mode:backwards;touch-action:pan-y}
  .eq-root[data-closing="true"] .eq-panel{animation-name:eq-sheet-out;animation-fill-mode:both}
  .eq-side{display:none}
  .eq-main{background:transparent}

  /* branded header */
  .eq-head{position:relative;flex:0 0 auto;padding:8px 20px 36px;background:linear-gradient(165deg,#0a2540 0%,#0d3158 100%);color:#fff;overflow:hidden;touch-action:none}
  .eq-head::before{content:"";position:absolute;inset-inline-end:-70px;top:-90px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(245,139,50,.45),rgba(245,139,50,0) 70%);animation:eq-float 9s ease-in-out infinite}
  .eq-head>*{position:relative;z-index:1}
  .eq-grab{display:block;width:44px;height:5px;margin:0 auto 12px;border-radius:5px;background:rgba(255,255,255,.35)}
  .eq-top{flex-wrap:wrap;align-items:center;padding:0;gap:14px 12px}
  .eq-mlogo{display:block;order:1;flex:1 1 auto;line-height:0}
  .eq-mlogo img{width:118px;height:auto;background:#fff;border-radius:10px;padding:7px 10px;box-sizing:content-box}
  .eq-x{order:2;background:rgba(255,255,255,.14);color:#fff}
  .eq-x:hover{background:rgba(255,255,255,.24)}
  .eq-count{order:3;flex:0 0 100%;display:flex;flex-direction:column;gap:2px;color:rgba(255,255,255,.72);font-size:12.5px;letter-spacing:.06em;text-transform:uppercase;min-height:44px}
  .eq-count b{font-size:23px;line-height:1.2;letter-spacing:-.01em;text-transform:none;color:#fff;font-weight:600}
  .eq-count b::before{content:none}
  .eq-bar{padding:16px 0 0;gap:5px}
  .eq-seg{background:rgba(255,255,255,.22);height:4px}

  /* cream card overlapping the header */
  .eq-body{position:relative;z-index:2;margin-top:-22px;padding:26px 20px 10px;background:var(--eq-bg);border-radius:26px 26px 0 0;box-shadow:0 -12px 30px -16px rgba(10,37,64,.5)}
  .eq-eyebrow{font-size:11.5px}
  .eq-h{font-size:25px}
  .eq-sub{font-size:14.5px}
  .eq-in,.eq-sel,.eq-ta{font-size:16px;height:54px;border-radius:14px}
  .eq-ta{height:auto;min-height:104px}
  .eq-l{font-size:14px}
  .eq-nav{gap:10px;padding:12px 20px calc(14px + env(safe-area-inset-bottom,0px));background:var(--eq-bg);box-shadow:0 -10px 24px -18px rgba(10,37,64,.4)}
  .eq-btn{height:54px;border-radius:14px}
  .eq-nav .eq-primary{flex:1}
  .eq-nav .eq-ghost{flex:0 0 auto;padding:0 18px}
  .eq-done{padding-top:6px}
  .eq-done h2{font-size:28px}
  .eq-alt{flex-direction:column;align-items:stretch;width:100%;max-width:340px}
  .eq-alt a{justify-content:center;height:50px}
}
@media (max-width:520px){
  .eq-g2{grid-template-columns:1fr}
  .eq-opts,.eq-opts[data-cols="3"]{grid-template-columns:1fr}
  .eq-opts[data-compact="true"]{grid-template-columns:1fr 1fr;gap:8px}
  .eq-opts[data-compact="true"] .eq-opt{min-height:56px;padding:10px 38px 10px 14px;font-size:14px;line-height:1.3}
  [dir="rtl"] .eq-opts[data-compact="true"] .eq-opt{padding:10px 14px 10px 38px}
  .eq-opts[data-compact="true"] .eq-tick{inset-inline-end:10px;width:20px;height:20px;margin-top:-10px}
  .eq-opt{min-height:54px;font-size:15px}
}
@keyframes eq-sheet{from{opacity:.6;transform:translateY(60px)}to{opacity:1;transform:none}}
@keyframes eq-sheet-out{to{opacity:0;transform:translateY(40px)}}
@media (prefers-reduced-motion:reduce){
  .eq-root *,.eq-root *::before,.eq-root *::after{animation-duration:.01ms!important;animation-delay:0ms!important;transition-duration:.01ms!important}
}
`;
