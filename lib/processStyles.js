// Styles for the Our Process page.
// Design: 1920px artboard. Below 1920 (down to 1024) every size scales with the viewport using --u
// (1u = 1px on the artboard). Below 1024 the page stacks into one column.

export const PROCESS_CSS = `
.pr{--u:1px;background:#fcfcfa;color:#1c1c1c;overflow-x:clip}
@media (min-width:1024px){.pr{--u:clamp(0.62px,0.0520833vw,1px)}}

/* ---------- animation system ---------- */
.pr-a{opacity:0;transition:opacity .5s cubic-bezier(.22,1,.36,1),transform .5s cubic-bezier(.22,1,.36,1);transition-delay:calc(var(--d,0ms)*.35)}
.pr-a[data-from="up"]{transform:translateY(18px)}
.pr-a[data-from="start"]{transform:translateX(-32px)}
.pr-a[data-from="end"]{transform:translateX(32px)}
.pr-a[data-from="scale"]{transform:scale(.94)}
html[dir="rtl"] .pr-a[data-from="start"]{transform:translateX(32px)}
html[dir="rtl"] .pr-a[data-from="end"]{transform:translateX(-32px)}
[data-in="true"] .pr-a{opacity:1;transform:none}

.pr-wipe{clip-path:inset(0 0 100% 0);transition:clip-path .8s cubic-bezier(.77,0,.18,1)}
[data-in="true"] .pr-wipe{clip-path:inset(0 0 0 0)}
.pr-wipe-img{transform:scale(1.12);transition:transform 1.2s cubic-bezier(.22,1,.36,1)}
[data-in="true"] .pr-wipe-img{transform:scale(1)}

.pr-bar{transform:scaleY(0);transform-origin:top;transition:transform .45s cubic-bezier(.22,1,.36,1);transition-delay:calc(var(--d,0ms)*.35)}
[data-in="true"] .pr-bar{transform:scaleY(1)}

.pr-digits-in{transform:translateY(105%);transition:transform .65s cubic-bezier(.22,1,.36,1) .06s}
[data-in="true"] .pr-digits-in{transform:none}

@media (prefers-reduced-motion:reduce){
  .pr-a,.pr-wipe,.pr-wipe-img,.pr-bar,.pr-digits-in{opacity:1!important;transform:none!important;clip-path:none!important;transition:none!important}
}

/* ---------- hero text ---------- */
.pr-hero{padding:40px 16px 40px}
.pr-hero-in{max-width:1200px;margin:0 auto}
.pr-eyebrow{font-size:12px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:#4b5563;line-height:1.5}
.pr-h1{margin-top:8px;font-size:30px;line-height:1.2;font-weight:600;color:#0a2540;letter-spacing:.009em}
.pr-p{margin-top:16px;font-size:16px;line-height:1.6;color:#737878;letter-spacing:.01em}
.pr-p + .pr-p{margin-top:12px}
html[dir="rtl"] .pr-eyebrow{letter-spacing:0}

.pr-heroimg{position:relative;height:240px;overflow:hidden;background:#e8e6e0}
.pr-heroimg img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}

/* ---------- steps ---------- */
.pr-steps{padding:8px 16px 64px}
.pr-row{margin-top:56px}
.pr-text{position:relative;min-width:0}
.pr-title{font-size:28px;line-height:1.2;font-weight:600;color:#0a2540;letter-spacing:-.015em}
.pr-sub{margin-top:6px;font-size:16px;line-height:1.5;color:#737878;letter-spacing:.01em}
.pr-focus{margin-top:20px;font-size:20px;line-height:1.3;font-weight:600;color:#0a2540}
.pr-list{margin:10px 0 0;padding:0;list-style:none}
.pr-list li{position:relative;padding-inline-start:19px;font-size:16px;line-height:1.5;color:#737878;letter-spacing:.014em}
.pr-list li + li{margin-top:8px}
.pr-list li::before{content:"";position:absolute;inset-inline-start:2px;top:.62em;width:4px;height:4px;border-radius:50%;background:#737878}
.pr-outcome{position:relative;margin-top:26px;padding-inline-start:23px;font-size:16px;line-height:1.5;color:var(--color-brand-orange,#f28a35)}
.pr-outcome b{font-weight:700}
.pr-outcome-bar{position:absolute;inset-block:0;inset-inline-start:0;width:4px;background:var(--color-brand-orange,#f28a35)}

.pr-num{display:flex;align-items:flex-end;gap:14px;margin-bottom:12px}
.pr-step{font-size:12px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#4b5563;padding-bottom:12px}
html[dir="rtl"] .pr-step{letter-spacing:0}
.pr-digits{display:block;overflow:hidden;color:var(--color-brand-orange,#f28a35)}
.pr-digits svg{display:block;height:60px;width:auto}

.pr-mediawrap{margin-top:28px}
.pr-media{position:relative;aspect-ratio:565/585;border-radius:28px;overflow:hidden;background:#d9d9d9;transition:transform .5s cubic-bezier(.22,1,.36,1),box-shadow .5s}
.pr-media-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.22,1,.36,1)}
.pr-media:hover{transform:translateY(-4px);box-shadow:0 24px 48px -24px rgba(10,37,64,.35)}
.pr-media:hover .pr-media-img{transform:scale(1.04)}
.pr-play{position:absolute;inset:0;margin:auto;display:flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;border:0;padding:0;background:transparent;color:#fff;cursor:default}
.pr-play svg{width:100%;height:100%;display:block}
.pr-play .ring{transform-origin:center;transition:transform .45s cubic-bezier(.22,1,.36,1),fill .3s}
button.pr-play{cursor:pointer}
button.pr-play:hover .ring,button.pr-play:focus-visible .ring{fill:rgba(255,255,255,.28);transform:scale(1.1)}
button.pr-play:focus-visible{outline:2px solid #fff;outline-offset:4px}
.pr-play::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid rgba(255,255,255,.7);opacity:0;pointer-events:none}
button.pr-play::after{animation:pr-ping 2.6s ease-out infinite}
@keyframes pr-ping{0%{transform:scale(1);opacity:.7}70%,100%{transform:scale(1.7);opacity:0}}
@media (prefers-reduced-motion:reduce){button.pr-play::after{animation:none}}
.pr-frame{position:absolute;inset:0;width:100%;height:100%;border:0;background:#000;display:block}
.pr-cover{object-fit:cover;object-position:center}
/* youtube cannot object-fit, so the frame is made larger than the box and centred: it fills it with no bars */
.pr-yt{inset:auto;top:50%;left:50%;width:max(100%,calc(100cqh*16/9));height:max(100%,calc(100cqw*9/16));transform:translate(-50%,-50%);pointer-events:none}
.pr-media{container-type:size}
.pr-sound{position:absolute;z-index:3;inset-inline-end:16px;bottom:16px;width:44px;height:44px;border-radius:50%;border:0;padding:0;display:flex;align-items:center;justify-content:center;color:#fff;background:rgba(10,37,64,.55);backdrop-filter:blur(6px);cursor:pointer;transition:background .25s,transform .25s}
.pr-sound:hover{background:rgba(247,148,60,.95);transform:scale(1.08)}
.pr-sound:focus-visible{outline:2px solid #fff;outline-offset:3px}
.pr-media:hover .pr-frame{transform:none}

/* ---------- desktop ---------- */
@media (min-width:1024px){
  .pr-hero{padding:calc(56*var(--u)) 0 calc(59*var(--u))}
  .pr-hero-in{width:calc(1200*var(--u));max-width:none}
  .pr-eyebrow{font-size:max(12px,calc(16*var(--u)))}
  .pr-h1{margin-top:calc(8*var(--u));font-size:max(30px,calc(48*var(--u)));line-height:1.2}
  .pr-p{margin-top:calc(10*var(--u));font-size:max(16px,calc(24*var(--u)));line-height:1.5;max-width:calc(1160*var(--u))}
  .pr-p + .pr-p{margin-top:calc(10*var(--u))}
  .pr-heroimg{height:calc(709*var(--u))}

  .pr-steps{padding:calc(119*var(--u)) 0 calc(278*var(--u))}
  .pr-row{width:calc(1200*var(--u));margin:calc(114*var(--u)) auto 0;display:flex;align-items:center}
  .pr-row:first-child{margin-top:0}
  .pr-text{flex:0 0 auto}
  .pr-row[data-side="a"] .pr-text{width:calc(570*var(--u));margin-inline-end:calc(65*var(--u))}
  .pr-row[data-side="b"] .pr-text{width:calc(525*var(--u));margin-inline-start:calc(76*var(--u));order:2}
  .pr-mediawrap{margin-top:0;flex:0 0 auto;width:calc(565*var(--u))}
  .pr-row[data-side="b"] .pr-mediawrap{order:1}
  .pr-media{width:100%;height:calc(585*var(--u));aspect-ratio:auto;border-radius:calc(40*var(--u))}

  .pr-title{font-size:max(24px,calc(40*var(--u)));line-height:1.2;padding-top:calc(4*var(--u))}
  .pr-sub{max-width:calc(455*var(--u));margin-top:calc(2*var(--u));font-size:max(15px,calc(20*var(--u)));line-height:1.5;letter-spacing:.012em}
  .pr-focus{margin-top:calc(13*var(--u));font-size:max(17px,calc(24*var(--u)))}
  .pr-list{margin-top:calc(5*var(--u))}
  .pr-list li{padding-inline-start:calc(19*var(--u));font-size:max(14px,calc(20*var(--u)));line-height:1.5}
  .pr-list li + li{margin-top:calc(8*var(--u))}
  .pr-list li::before{inset-inline-start:calc(2*var(--u));width:max(3px,calc(5*var(--u)));height:max(3px,calc(5*var(--u)))}
  .pr-outcome{margin-top:calc(30*var(--u));max-width:calc(527*var(--u));padding-inline-start:calc(27*var(--u));font-size:max(14px,calc(20*var(--u)));line-height:1.5;letter-spacing:.012em}
  .pr-outcome-bar{width:max(3px,calc(4*var(--u)))}

  .pr-num{position:absolute;display:block;margin:0}
  .pr-row[data-side="a"] .pr-num{inset-inline-start:calc(-199*var(--u));top:calc(-24*var(--u))}
  .pr-row[data-side="b"] .pr-num{inset-inline-start:calc(562*var(--u));top:calc(18*var(--u))}
  .pr-step{display:block;padding:0;font-size:max(11px,calc(15.5*var(--u)))}
  .pr-digits{margin-top:calc(13*var(--u))}
  .pr-digits svg{height:calc(115.8*var(--u))}
  /* latest design: step 4 copy sits 20px higher, the big number stays put */
  .pr-row:nth-child(4) .pr-text{position:relative;top:calc(-20*var(--u))}
  .pr-row:nth-child(4) .pr-num{margin-top:calc(20*var(--u))}
}
`;
