"use client";

import Roll from "@/components/Roll";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Mx from "@/components/Mx";
import MxText from "@/components/MxText";
import CatalogueDownloadLink from "@/components/CatalogueDownloadLink";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mx-pop h-[22px] w-[22px] xl:h-[max(28px,calc(40*var(--u)))] xl:w-[max(28px,calc(40*var(--u)))]">
      {children}
    </svg>
  );
}

function getIndustries(dict) {
  return [
    { label: dict.industries.items.beverages, icon: <Icon><path d="M6 8h12l-1.2 12a1 1 0 0 1-1 .9H8.2a1 1 0 0 1-1-.9z" /><path d="M5 8h14M9 8V5.5h6V8M12 5.5l1-3" /></Icon> },
    { label: dict.industries.items.biscuitsCakes, icon: <Icon><ellipse cx="12" cy="8" rx="8" ry="3.5" /><ellipse cx="12" cy="8" rx="4" ry="1.5" /><path d="M4 8v4c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5V8" /><path d="M4 12v4c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5v-4" /></Icon> },
    { label: dict.industries.items.soapsDetergents, icon: <Icon><rect x="3" y="9" width="9" height="12" rx="2" /><path d="M6 9V6h3v3M5 6h5M7.5 3h3M10.5 3v3" /><path d="M17 12c-1.5 2-2.5 3-2.5 4.2a2.5 2.5 0 0 0 5 0c0-1.2-1-2.2-2.5-4.2z" /></Icon> },
    { label: dict.industries.items.snacks, icon: <Icon><path d="M5 10h14l-1.5 11h-11z" /><path d="M8 10 7 4M11 10l-.5-7M14 10l.5-7M17 10l1-6" /></Icon> },
    { label: dict.industries.items.confectionery, icon: <Icon><rect x="7" y="8" width="10" height="8" rx="4" transform="rotate(-45 12 12)" /><path d="M6 6 3.5 8.5M6 6 8.5 3.5M18 18l2.5-2.5M18 18l-2.5 2.5" /></Icon> },
    { label: dict.industries.items.iceCreamDairy, icon: <Icon><path d="M14 3.5a4 4 0 0 1 5.7 5.7L10 18.9a2.5 2.5 0 0 1-3.5 0l-1.4-1.4a2.5 2.5 0 0 1 0-3.5z" /><path d="m5 19-2 2M12 7l3 3" /></Icon> },
    { label: dict.industries.items.cosmeticsPaints, icon: <Icon><rect x="3" y="12" width="6" height="9" rx="1" /><path d="M4 12V8h4v4M5 8V3.5h2V8" /><rect x="12" y="10" width="8" height="11" rx="1.5" /><path d="M14 10V6h4v4" /></Icon> },
    { label: dict.industries.items.pharmaceutical, icon: <Icon><rect x="5" y="3" width="14" height="4" rx="1" /><path d="M6 7v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M9 12h6M9 16h4" /></Icon> },
  ];
}

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function IndustryCell({ item, cellRef }) {
  const isTouch = useRef(false);
  const iconRef = useRef(null);
  const labelRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    isTouch.current = window.matchMedia("(hover: none)").matches;
  }, []);

  const playIn = () => {
    if (reduceMotion() || !iconRef.current || !labelRef.current) return;
    gsap.killTweensOf([iconRef.current, labelRef.current]);
    gsap.to(iconRef.current, { y: -4, rotate: 8, scale: 1.1, duration: 0.35, ease: "back.out(2.2)" });
    gsap.to(labelRef.current, { y: -2, duration: 0.3, ease: "power2.out" });
  };

  const playOut = () => {
    if (reduceMotion() || !iconRef.current || !labelRef.current) return;
    gsap.to(iconRef.current, { y: 0, rotate: 0, scale: 1, duration: 0.4, ease: "power3.out" });
    gsap.to(labelRef.current, { y: 0, duration: 0.3, ease: "power2.out" });
  };

  const playRipple = () => {
    if (reduceMotion() || !glowRef.current) return;
    gsap.killTweensOf(glowRef.current);
    gsap.fromTo(
      glowRef.current,
      { scale: 0.3, opacity: 0.5 },
      { scale: 2.2, opacity: 0, duration: 0.6, ease: "power2.out" }
    );
  };

  const handleEnter = () => {
    if (!isTouch.current) playIn();
  };

  const handleLeave = () => {
    if (!isTouch.current) playOut();
  };

  const handleTap = () => {
    if (!isTouch.current) return;
    playIn();
    playRipple();
    setTimeout(playOut, 350);
  };

  return (
    <div
      ref={cellRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleTap}
      className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden px-4 py-9 text-center transition-colors duration-300 hover:bg-brand-orange/10 xl:h-[calc(139.5*var(--u))] xl:items-start xl:justify-start xl:gap-[calc(17*var(--u))] xl:py-0 xl:pe-0 xl:ps-[calc(32*var(--u))] xl:pt-[calc(13*var(--u))] xl:text-start xl:hover:bg-transparent"
    >
      <span className="pointer-events-none absolute inset-0 hidden bg-gradient-to-br from-[#fae8e5] to-[#fbf1e3] opacity-0 transition-opacity duration-300 group-hover:opacity-100 xl:block" aria-hidden="true" />
      <span ref={glowRef} className="pointer-events-none absolute h-11 w-11 rounded-full bg-brand-orange/40 opacity-0" aria-hidden="true" />
      <span ref={iconRef} className="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange transition-colors duration-300 group-hover:bg-brand-orange group-hover:text-white xl:h-auto xl:w-auto xl:rounded-none xl:bg-transparent xl:group-hover:bg-transparent xl:group-hover:text-brand-orange">
        {item.icon}
      </span>
      <span ref={labelRef} className="relative text-[13px] font-medium text-ink transition-colors duration-300 group-hover:text-brand-orange xl:text-[max(14px,calc(20*var(--u)))] xl:leading-[calc(28*var(--u))] xl:text-ink/70">{item.label}</span>
    </div>
  );
}

export default function Industries({ dict }) {
  const industries = getIndustries(dict);
  const gridRef = useRef(null);
  const cellRefs = useRef([]);

  useEffect(() => {
    const cells = cellRefs.current.filter(Boolean);
    if (!cells.length || !gridRef.current) return;

    if (reduceMotion()) {
      gsap.set(cells, { opacity: 1, scale: 1 });
      return;
    }

    gsap.set(cells, { opacity: 0, scale: 0.85 });

    const dividers = gridRef.current.querySelectorAll(".divider-line");
    if (dividers.length) gsap.set(dividers, { scaleY: 0, scaleX: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 85%",
        once: true,
      },
    });

    tl.to(cells, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.6)",
      stagger: { each: 0.07, from: "start" },
    });

    if (dividers.length) {
      tl.to(
        dividers,
        { scaleY: 1, scaleX: 1, duration: 0.5, ease: "power2.out", stagger: 0.03 },
        "-=0.3"
      );
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [dict]);

  return (
    <Mx as="section" className="bg-[#fcfcfa] px-4 py-16 [--u:1px] sm:px-6 md:py-20 xl:px-0 xl:pb-[calc(110*var(--u))] xl:pt-[calc(87*var(--u))] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="mx-auto max-w-[1200px] xl:max-w-[calc(1200*var(--u))]">
        <div className="flex flex-col items-center text-center">
          <p className="mx-eyebrow mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-navy xl:mb-[calc(11*var(--u))] xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]">{dict.industries.eyebrow}</p>
          <MxText as="h2" delay={150} className="max-w-[560px] text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] text-brand-navy md:text-[32px] md:leading-[40px] xl:max-w-none xl:text-[max(28px,calc(40*var(--u)))] xl:leading-[calc(48*var(--u))]">{dict.industries.heading}</MxText>
          <p style={{ "--d": "450ms" }} className="mx-fade mt-4 max-w-[560px] text-[14px] leading-[22px] text-ink/60 xl:mt-[calc(16*var(--u))] xl:max-w-[calc(820*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">{dict.industries.paragraph}</p>
        </div>

        <div ref={gridRef} className="relative mt-10 grid grid-cols-2 md:grid-cols-4 xl:mt-[calc(51*var(--u))] xl:grid-cols-[295fr_305fr_305fr_295fr]">
          {industries.map((item, index) => (
            <div key={index} className="relative">
              {index % 2 !== 0 && <span className="divider-line absolute inset-y-0 start-0 w-px origin-top bg-[#ccd4e3] md:hidden" aria-hidden="true" />}
              {index % 4 !== 0 && <span className="divider-line hidden md:block absolute inset-y-0 start-0 w-px origin-top bg-[#ccd4e3]" aria-hidden="true" />}
              {index >= 2 && <span className="divider-line absolute inset-x-0 top-0 h-px origin-left bg-[#ccd4e3] md:hidden" aria-hidden="true" />}
              {index >= 4 && <span className="divider-line hidden md:block absolute inset-x-0 top-0 h-px origin-left bg-[#ccd4e3]" aria-hidden="true" />}
              <IndustryCell
                item={item}
                cellRef={(el) => (cellRefs.current[index] = el)}
              />
            </div>
          ))}
        </div>

        <div style={{ "--d": "300ms" }} className="mx-fade mt-9 flex flex-wrap items-center justify-center gap-3 xl:mt-[calc(69*var(--u))] xl:gap-[calc(29*var(--u))]">
          <a href="#" className="flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-brand-navy/15 bg-white px-4 text-[12px] font-medium text-brand-navy transition duration-200 hover:-translate-y-0.5 hover:border-brand-orange hover:text-brand-orange motion-reduce:transition-none motion-reduce:hover:translate-y-0 xl:h-[max(40px,calc(48*var(--u)))] xl:w-[calc(230*var(--u))] xl:min-w-[170px] xl:rounded-[calc(8*var(--u))] xl:px-0 xl:text-[max(12px,calc(14*var(--u)))]"><Roll>{dict.buttons.exploreIndustries}</Roll></a>
          <CatalogueDownloadLink
            label={dict.buttons.downloadCatalogueArrow ?? dict.buttons.downloadCatalogue}
            icon="none"
            className="flex h-9 items-center whitespace-nowrap px-1 text-[12px] font-medium text-brand-orange transition duration-200 hover:opacity-70 motion-reduce:transition-none xl:h-[max(40px,calc(48*var(--u)))] xl:text-[max(12px,calc(14*var(--u)))]"
          />
        </div>
      </div>
    </Mx>
  );
}