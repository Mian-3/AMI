"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { DEFAULT_FORMAT } from "@/lib/flavoursData";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;
const isExternal = (href) => /^(https?:|mailto:|tel:)/.test(href);

const COL = "mx-auto w-full max-w-[64rem] px-5 sm:px-6 xl:w-[max(calc(1200*var(--u)),60rem)] xl:max-w-none xl:px-0";

// Line icons for the category tabs, matched by position (same order as the page content).
const P = {
  food: [
    <><path d="M7 3h10l-1.2 16.2a2 2 0 0 1-2 1.8h-3.6a2 2 0 0 1-2-1.8L7 3Z" /><path d="M6.6 8h10.8" /><path d="m13 3 1-2" /></>,
    <><path d="M4 11c0-4 3.5-7 8-7s8 3 8 7" /><path d="M3 11h18" /><path d="m5 11 1.2 8h11.6L19 11" /><path d="M9 14v2M12 14v2M15 14v2" /></>,
    <><ellipse cx="12" cy="12" rx="4.5" ry="3.5" transform="rotate(-45 12 12)" /><path d="M8.7 8.7 5 7l-1 3 3 1.5M15.3 15.3 19 17l1-3-3-1.5" /></>,
    <><path d="M8 3h8l2 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7l2-4Z" /><path d="M6 7h12" /><path d="M10 12h4v4h-4z" /></>,
    <><path d="M5 4h14l-1 16H6L5 4Z" /><path d="M5 8c2 1.5 4 1.5 7 0s5-1.5 7 0" /><circle cx="12" cy="14" r="2" /></>,
    <><rect x="3" y="9" width="12" height="6" rx="3" transform="rotate(-35 9 12)" /><path d="m7.5 14.2 4.5-6.3" /><circle cx="17" cy="17" r="3.5" /></>,
  ],
  fragrance: [
    <><path d="M9 3h5v3H9z" /><path d="M14 4.5h4" /><path d="M8 9h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" /><path d="M6 14h11" /></>,
    <><path d="M9 21v-7h6v7z" /><path d="M10 14V9h4v5" /><path d="m10 9 4-5v5" /></>,
    <><path d="M10 3h4v2h-4z" /><path d="M9 5h6l1 3v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8l1-3Z" /><path d="M8 12h3M8 15h3" /></>,
    <><path d="m5 16 1.5-5.5A2 2 0 0 1 8.4 9h7.2a2 2 0 0 1 1.9 1.5L19 16" /><path d="M3 16h18v3H3z" /><circle cx="7" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" /></>,
    <><path d="m3 11 9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></>,
    <><rect x="4" y="3" width="14" height="5" rx="1" /><path d="M18 5.5h2v5h-8v3" /><rect x="10.5" y="13.5" width="3" height="7" rx="1" /></>,
  ],
};

function TabIcon({ kind, i }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="fs-ico h-[22px] w-[22px] shrink-0 md:h-[18px] md:w-[18px] xl:h-[max(18px,calc(24*var(--u)))] xl:w-[max(18px,calc(24*var(--u)))]">
      {(P[kind] || P.food)[i % 6]}
    </svg>
  );
}

// Measures an element inside a container so a single indicator can glide to it.
function useSlider(refs, index, watch) {
  const [pos, setPos] = useState({ x: 0, y: 0, w: 0, h: 0, ready: false });
  const measure = useCallback(() => {
    const el = refs.current[index];
    if (!el) return;
    setPos((p) => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight, ready: p.ready || p.w > 0 || el.offsetWidth > 0 }));
  }, [refs, index]);
  useIso(() => {
    measure();
  }, [measure, watch]);
  useEffect(() => {
    const el = refs.current[index];
    const parent = el?.parentElement;
    if (!parent || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    document.fonts?.ready?.then(measure);
    return () => ro.disconnect();
  }, [refs, index, measure, watch]);
  return pos;
}

const CSS = `
@keyframes fs-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes fs-clip-f{from{clip-path:inset(0 0 0 100% round 24px)}to{clip-path:inset(0 0 0 0 round 24px)}}
@keyframes fs-clip-b{from{clip-path:inset(0 100% 0 0 round 24px)}to{clip-path:inset(0 0 0 0 round 24px)}}
@keyframes fs-zoom{from{transform:scale(1.18)}to{transform:scale(1)}}
@keyframes fs-pop{0%{transform:scale(.7) rotate(-8deg)}60%{transform:scale(1.18) rotate(4deg)}100%{transform:scale(1) rotate(0)}}
@keyframes fs-notch{0%,100%{transform:translateY(0)}50%{transform:translateY(2px)}}
.fs-up{opacity:0;animation:fs-up .7s cubic-bezier(.22,1,.36,1) both;animation-delay:var(--d,0ms)}
.fs-img-f{animation:fs-clip-f .85s cubic-bezier(.77,0,.18,1) both}
.fs-img-b{animation:fs-clip-b .85s cubic-bezier(.77,0,.18,1) both}
.fs-img-in{animation:fs-zoom 1.3s cubic-bezier(.22,1,.36,1) both}
.fs-on .fs-ico{animation:fs-pop .55s cubic-bezier(.34,1.56,.64,1) both}
.fs-tab:hover .fs-ico{transform:translateY(-2px)}
.fs-ico{transition:transform .3s cubic-bezier(.34,1.56,.64,1)}
.fs-slide{transition:transform .5s cubic-bezier(.22,1,.36,1),translate .5s cubic-bezier(.22,1,.36,1),width .5s cubic-bezier(.22,1,.36,1),height .5s cubic-bezier(.22,1,.36,1),opacity .3s}
.fs-notch{animation:fs-notch 2.4s ease-in-out infinite}
.fs-btn{transition:transform .3s cubic-bezier(.22,1,.36,1),box-shadow .3s}
.fs-btn:hover,.fs-btn:focus-visible{transform:translateY(-2px)}
.fs-btn:hover .fs-arr,.fs-btn:focus-visible .fs-arr{transform:translateX(4px)}
[dir=rtl] .fs-btn:hover .fs-arr,[dir=rtl] .fs-btn:focus-visible .fs-arr{transform:translateX(-4px) scaleX(-1)}
[dir=rtl] .fs-arr{transform:scaleX(-1)}
.fs-arr{transition:transform .35s cubic-bezier(.22,1,.36,1)}
@media (prefers-reduced-motion:reduce){
.fs-up,.fs-img-f,.fs-img-b,.fs-img-in,.fs-on .fs-ico,.fs-notch{animation:none;opacity:1}
.fs-slide,.fs-ico,.fs-arr,.fs-btn{transition:none}
}
`;

function RequestButton({ href, locale, label }) {
  const cls =
    "fs-btn relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-md border border-brand-orange bg-brand-orange px-4 text-[12px] font-medium text-white shadow-[0_6px_16px_rgba(242,143,59,0.28)] hover:shadow-[0_10px_24px_rgba(242,143,59,0.42)] focus-visible:outline-none xl:h-[max(40px,calc(48*var(--u)))] xl:gap-[calc(10*var(--u))] xl:px-[calc(24*var(--u))] xl:text-[max(12px,calc(16*var(--u)))]";
  const inner = (
    <>
      <span className="relative z-10">{label}</span>
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="fs-arr relative z-10">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </>
  );
  if (!href) {
    return (
      <a data-enquiry href={`/${locale}/contact`} className={cls}>
        {inner}
      </a>
    );
  }
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}

// One block of the page: heading, format switch, category tabs and the detail panel.
export default function FlavoursSection({ kind = "food", section, heading, meta, locale = "en", cta = "Request for Sample", tint = false }) {
  const [format, setFormat] = useState(DEFAULT_FORMAT);
  const [activeOrig, setActiveOrig] = useState(0);
  const prevPos = useRef(0);
  const dirRef = useRef("f");
  const tabRefs = useRef([]);
  const fmtRefs = useRef([]);

  const items = section.items.map((item, i) => ({ ...item, ...(meta[i] || { formats: ["liquid", "powder"], href: null }), orig: i }));
  const visible = items.filter((item) => item.formats.includes(format));
  const activePos = Math.max(0, visible.findIndex((v) => v.orig === activeOrig));
  const current = visible[activePos] || visible[0];

  const chips = [
    { key: "powder", label: section.powder },
    { key: "liquid", label: section.liquid },
  ];
  const fmtIndex = chips.findIndex((c) => c.key === format);

  if (current && prevPos.current !== activePos) {
    dirRef.current = activePos > prevPos.current ? "f" : "b";
    prevPos.current = activePos;
  }

  const tabSlide = useSlider(tabRefs, activePos, visible.length + format);
  const fmtSlide = useSlider(fmtRefs, fmtIndex, format);

  function onKey(e) {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key) || !visible.length) return;
    e.preventDefault();
    const rtl = typeof document !== "undefined" && document.dir === "rtl";
    let next = activePos;
    if (e.key === "Home") next = 0;
    else if (e.key === "End") next = visible.length - 1;
    else {
      const fwd = e.key === "ArrowDown" || (e.key === (rtl ? "ArrowLeft" : "ArrowRight"));
      next = (activePos + (fwd ? 1 : -1) + visible.length) % visible.length;
    }
    setActiveOrig(visible[next].orig);
    tabRefs.current[next]?.focus();
  }

  const slide = tabSlide.ready ? "fs-slide" : "";
  const eyebrow = "text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-navy xl:text-[max(12px,calc(16*var(--u)))]";

  return (
    <section className={`${tint ? "bg-[#f9f8f5]" : "bg-white"} py-14 sm:py-16 xl:py-[calc(96*var(--u))]`}>
      <style>{CSS}</style>
      <div className={COL}>
        {/* Heading and format switch */}
        <div className="text-center">
          <Reveal as="p" className={eyebrow}>
            {section.eyebrow}
          </Reveal>
          <Reveal as="div" delay={80}>
            <h2 className="mt-2 text-[26px] font-semibold leading-[1.2] text-brand-navy sm:text-[32px] xl:mt-[calc(12*var(--u))] xl:text-[max(28px,calc(40*var(--u)))] xl:leading-[calc(48*var(--u))]">{heading}</h2>
          </Reveal>
          <Reveal as="p" delay={160} className="mx-auto mt-3 max-w-[44rem] text-[14px] leading-[22px] text-ink/60 xl:mt-[calc(16*var(--u))] xl:max-w-[calc(900*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">
            {section.bandText}
          </Reveal>

          <Reveal as="div" delay={240} className="mt-6 xl:mt-[calc(32*var(--u))]">
            <p className="text-[12px] text-ink/50 xl:text-[max(12px,calc(15*var(--u)))]">{section.formatsLabel}</p>
            <div className="mt-3 flex justify-center xl:mt-[calc(14*var(--u))]">
              <div role="group" aria-label={section.formatsLabel} className="relative inline-flex rounded-md bg-[#ebe8e1] p-0">
                <span
                  aria-hidden="true"
                  style={{ transform: `translateX(${fmtSlide.x}px)`, width: fmtSlide.w }}
                  className={`absolute inset-y-0 start-0 left-0 rounded-md bg-brand-orange shadow-[0_6px_16px_rgba(242,143,59,0.35)] ${fmtSlide.ready ? "fs-slide" : ""}`}
                />
                <span
                  aria-hidden="true"
                  style={{ transform: `translateX(${fmtSlide.x + fmtSlide.w / 2}px)` }}
                  className={`absolute -bottom-[6px] left-0 h-0 w-0 -translate-x-1/2 ${fmtSlide.ready ? "fs-slide" : ""}`}
                >
                  <span className="fs-notch block h-0 w-0 border-x-[6px] border-t-[6px] border-x-transparent border-t-brand-orange" />
                </span>
                {chips.map((chip, i) => {
                  const on = format === chip.key;
                  return (
                    <button
                      key={chip.key}
                      ref={(el) => (fmtRefs.current[i] = el)}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFormat(chip.key)}
                      className={`relative z-10 h-9 whitespace-nowrap rounded-md px-4 text-[12px] font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/25 xl:h-[max(40px,calc(48*var(--u)))] xl:px-[calc(28*var(--u))] xl:text-[max(12px,calc(16*var(--u)))] ${on ? "text-white" : "text-ink/45 hover:text-brand-navy"}`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Tabs and panel. On phones the tabs sit in a rail on the left and the panel (image, then text) on the right. */}
        <Reveal as="div" delay={120} className="mt-10 flex items-start gap-3 sm:gap-5 md:mt-12 md:block xl:mt-[calc(56*var(--u))]">
          <div className="w-[92px] shrink-0 border-e border-black/10 sm:w-[96px] md:w-full md:border-b md:border-e-0">
            <div role="tablist" aria-orientation="horizontal" onKeyDown={onKey} className="relative flex flex-col md:flex-row md:justify-between">
              <span
                aria-hidden="true"
                style={{ "--ix": `${tabSlide.x}px`, "--iw": `${tabSlide.w}px`, "--iy": `${tabSlide.y}px`, "--ih": `${tabSlide.h}px`, opacity: tabSlide.ready ? 1 : 0 }}
                className={`${slide} absolute bottom-[-1px] left-0 h-[2px] w-[var(--iw)] translate-x-[var(--ix)] bg-brand-orange max-md:bottom-auto max-md:left-auto max-md:right-0 max-md:top-0 max-md:h-[var(--ih)] max-md:w-[3px] max-md:translate-x-0 max-md:translate-y-[var(--iy)] max-md:rounded-full rtl:max-md:left-0 rtl:max-md:right-auto`}
              />
              {visible.map((item, i) => {
                const on = i === activePos;
                return (
                  <button
                    key={item.orig}
                    ref={(el) => (tabRefs.current[i] = el)}
                    id={`${kind}-tab-${item.orig}`}
                    role="tab"
                    type="button"
                    aria-selected={on}
                    aria-controls={`${kind}-panel`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActiveOrig(item.orig)}
                    className={`fs-tab group flex flex-col items-center gap-1.5 px-1 py-3.5 text-center text-[10.5px] font-medium leading-[1.25] transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange/40 md:flex-row md:gap-2 md:px-0 md:py-3 md:text-[13px] md:leading-none xl:gap-[calc(10*var(--u))] xl:py-[calc(20*var(--u))] xl:text-[max(13px,calc(18*var(--u)))] ${on ? "fs-on text-brand-orange" : "text-ink/55 hover:text-brand-navy"}`}
                  >
                    <TabIcon kind={kind} i={item.orig} />
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {current ? (
            <div
              key={`${format}-${current.orig}`}
              id={`${kind}-panel`}
              role="tabpanel"
              aria-labelledby={`${kind}-tab-${current.orig}`}
              className="min-w-0 flex-1 md:mt-9 md:grid md:grid-cols-[1.12fr_1fr] md:items-center md:gap-10 xl:mt-[calc(56*var(--u))] xl:grid-cols-[calc(600*var(--u))_1fr] xl:gap-[calc(120*var(--u))]"
            >
              <div className="group relative aspect-[4/3] overflow-hidden rounded-[18px] bg-brand-navy/5 md:aspect-[600/420] xl:rounded-[calc(28*var(--u))]">
                <div className={`absolute inset-0 ${dirRef.current === "f" ? "fs-img-f" : "fs-img-b"}`}>
                  <div className="fs-img-in absolute inset-0">
                    <Image
                      src={current.image}
                      alt={current.title}
                      fill
                      sizes="(min-width: 1920px) 600px, (min-width: 768px) 50vw, 70vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 md:mt-0">
                <p className={`fs-up ${eyebrow}`} style={{ "--d": "250ms" }}>
                  {section.eyebrow}
                </p>
                <h3 className="fs-up mt-1.5 text-[22px] font-semibold leading-[1.2] text-brand-navy sm:text-[26px] xl:mt-[calc(8*var(--u))] xl:text-[max(26px,calc(36*var(--u)))] xl:leading-[calc(44*var(--u))]" style={{ "--d": "330ms" }}>
                  {current.title}
                </h3>
                <p className="fs-up mt-3 text-[14px] leading-[22px] text-ink/60 xl:mt-[calc(18*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]" style={{ "--d": "420ms" }}>
                  {current.desc}
                </p>
                {section.note ? (
                  <p className="fs-up mt-3 text-[14px] leading-[22px] text-ink/60 xl:mt-[calc(16*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]" style={{ "--d": "500ms" }}>
                    {section.note}
                  </p>
                ) : null}
                <div className="fs-up mt-5 xl:mt-[calc(32*var(--u))]" style={{ "--d": "580ms" }}>
                  <RequestButton href={current.href} locale={locale} label={cta} />
                </div>
              </div>
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}