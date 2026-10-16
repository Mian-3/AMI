"use client";

import { useEffect, useRef, useState } from "react";

/*
  Design artboard 1920. At xl+ every size is calc(N * var(--u)) with a floor,
  so this section scales exactly like the Figma frame. Below xl the compact layout is kept.
  Order: Vision first, Mission second. Title is a plain word ("Vision" / "Mission"),
  the paragraph comes from dict.about (visionText / missionText), editable in the admin.
*/
const ICON = "h-11 w-11 xl:h-[max(44px,calc(64*var(--u)))] xl:w-[max(44px,calc(64*var(--u)))]";

const CSS = `
.amv-draw path,.amv-draw rect,.amv-draw circle{stroke-dasharray:1;stroke-dashoffset:1;opacity:.0}
.amv-in .amv-draw path,.amv-in .amv-draw rect,.amv-in .amv-draw circle{animation:amv-draw 1.1s cubic-bezier(.65,0,.35,1) forwards;animation-delay:calc(var(--d,0ms) + var(--i,0) * 90ms)}
@keyframes amv-draw{0%{stroke-dashoffset:1;opacity:1}100%{stroke-dashoffset:0;opacity:1}}
.amv-rise{opacity:0;transform:translateY(18px)}
.amv-in .amv-rise{animation:amv-rise .8s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:var(--d,0ms)}
@keyframes amv-rise{to{opacity:1;transform:none}}
.amv-glow{opacity:0}
.amv-in .amv-glow{animation:amv-glow 1.6s ease-out forwards;animation-delay:var(--d,0ms)}
@keyframes amv-glow{0%{opacity:0;transform:scale(.6)}60%{opacity:.5}100%{opacity:0;transform:scale(1.5)}}
@media (prefers-reduced-motion:reduce){
.amv-draw path,.amv-draw rect,.amv-draw circle{stroke-dasharray:none;stroke-dashoffset:0;opacity:1;animation:none!important}
.amv-rise{opacity:1;transform:none;animation:none!important}
.amv-glow{display:none}
}
`;

function Svg({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`amv-draw ${ICON}`}>
      {children}
    </svg>
  );
}

const P = (props) => <path pathLength="1" {...props} />;
const R = (props) => <rect pathLength="1" {...props} />;
const C = (props) => <circle pathLength="1" {...props} />;

function VisionIcon() {
  return (
    <Svg>
      <P d="M3 8V6a3 3 0 0 1 3-3h2" style={{ "--i": 0 }} />
      <P d="M16 3h2a3 3 0 0 1 3 3v2" style={{ "--i": 1 }} />
      <P d="M21 16v2a3 3 0 0 1-3 3h-2" style={{ "--i": 2 }} />
      <P d="M8 21H6a3 3 0 0 1-3-3v-2" style={{ "--i": 3 }} />
      <P d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5z" style={{ "--i": 4 }} />
      <C cx="12" cy="12" r="2.5" style={{ "--i": 5 }} />
    </Svg>
  );
}

function MissionIcon() {
  return (
    <Svg>
      <P d="M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h4" style={{ "--i": 0 }} />
      <P d="M15 4h2a2 2 0 0 1 2 2v3" style={{ "--i": 1 }} />
      <R x="9" y="2.5" width="6" height="3.5" rx="1" style={{ "--i": 2 }} />
      <C cx="16.5" cy="17" r="4" style={{ "--i": 3 }} />
      <C cx="16.5" cy="17" r="1.2" style={{ "--i": 4 }} />
    </Svg>
  );
}

export default function AboutMissionVision({ dict }) {
  const t = dict.about;
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const ar = /[؀-ۿ]/.test(String(t.visionLabel || ""));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Plain titles: use the admin label when it is not an "OUR ..." style line.
  const clean = (label, fallback) => {
    const l = String(label || "").trim();
    if (!l || /^our\s/i.test(l)) return fallback;
    return l;
  };

  const items = [
    { key: "vision", icon: <VisionIcon />, title: clean(t.visionLabel, ar ? "رؤيتنا" : "Vision"), text: t.visionText },
    { key: "mission", icon: <MissionIcon />, title: clean(t.missionLabel, ar ? "مهمتنا" : "Mission"), text: t.missionText },
  ];

  return (
    <section
      ref={ref}
      className={`${seen ? "amv-in" : ""} bg-[#212121] pb-16 pt-14 text-white [--u:1px] sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-[4.5rem] xl:pb-[calc(96*var(--u))] xl:pt-[calc(72*var(--u))] xl:[--u:clamp(0.667px,0.0520833vw,1px)]`}
    >
      <style>{CSS}</style>
      <div className="mx-auto grid max-w-[75rem] gap-12 px-4 sm:px-6 md:grid-cols-2 md:gap-x-10 xl:max-w-[calc(1200*var(--u))] xl:gap-x-[calc(74*var(--u))] xl:px-0">
        {items.map((item, n) => {
          const base = n * 220;
          return (
            <div key={item.key} className="group" style={{ "--d": `${base}ms` }}>
              <div className="relative inline-block text-white transition duration-500 ease-out group-hover:-translate-y-1 group-hover:text-[#f28b33]">
                <span aria-hidden="true" className="amv-glow pointer-events-none absolute inset-0 rounded-full bg-[#f28b33]/40 blur-xl" style={{ "--d": `${base + 700}ms` }} />
                <span className="relative block">{item.icon}</span>
              </div>
              <h2
                className="amv-rise mt-4 text-[26px] font-semibold leading-[1.25] sm:text-[28px] xl:mt-[calc(18*var(--u))] xl:text-[max(24px,calc(32*var(--u)))] xl:leading-[calc(40*var(--u))] xl:tracking-[-0.015em]"
                style={{ "--d": `${base + 250}ms` }}
              >
                {item.title}
              </h2>
              <p
                className="amv-rise mt-2 max-w-[34rem] text-[14px] leading-[22px] text-white xl:mt-[calc(8*var(--u))] xl:max-w-[calc(520*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]"
                style={{ "--d": `${base + 450}ms` }}
              >
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
