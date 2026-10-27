"use client";

import Roll from "@/components/Roll";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Mx from "@/components/Mx";
import MxText from "@/components/MxText";
import CatalogueDownloadLink from "@/components/CatalogueDownloadLink";
import LocaleLink from "@/components/LocaleLink";
import { arrange } from "@/lib/itemLayout";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function Icon({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mx-pop h-[22px] w-[22px] xl:h-[max(22px,calc(32*var(--u)))] xl:w-[max(22px,calc(32*var(--u)))]">
      {children}
    </svg>
  );
}

function getIndustries(dict) {
  const t = dict.industries.items;
  // The first 7 are the Flavours tabs and the last 7 the Fragrances tabs on the Flavours & Fragrances page.
  const withLink = (list) => list.map((item, i) => ({ ...item, href: `/flavours-fragrances#${i < 7 ? "food-" + i : "fragrance-" + (i - 7)}` }));
  return withLink([
    { label: t.confectionery, icon: <Icon><rect x="6.5" y="8" width="11" height="8" rx="4" transform="rotate(-45 12 12)" /><path d="M6.4 9.2 3.6 8.6l.9-3 3 .9M17.6 14.8l2.8.6-.9 3-3-.9" /><path d="m9.5 12.8 3-3M11 14.3l3-3" /></Icon> },
    { label: t.baking, icon: <Icon><path d="M6 12h12l-1.4 8H7.4z" /><path d="M5.5 12a3.2 3.2 0 0 1 1.3-6 3.5 3.5 0 0 1 10.4 0 3.2 3.2 0 0 1 1.3 6M10 14.5v3.5M14 14.5v3.5" /></Icon> },
    { label: t.beverages, icon: <Icon><path d="M7 9h10l-1.1 11H8.1z" /><path d="M6 9h12M9 9V7h6v2M13 7l1.2-3.5" /></Icon> },
    { label: t.pharmaceutical, icon: <Icon><rect x="3.5" y="3" width="8" height="14" rx="4" /><path d="M3.5 10h8" /><circle cx="16.5" cy="16.5" r="4" /><path d="M13 16.5h7" /></Icon> },
    { label: t.frozenFood, icon: <Icon><path d="M3 10.5 12 4l9 6.5" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></Icon> },
    { label: t.savory, icon: <Icon><path d="M4 19c0-5.5 3-9.5 8-9.5s8 4 8 9.5z" /><path d="M14 9.5 16 4M19 5l-3 .6" /></Icon> },
    { label: t.cupCake, icon: <Icon><path d="M6.5 13h11l-1.4 7H7.9z" /><path d="M5.5 13c0-3 3-5 6.5-5s6.5 2 6.5 5M12 8V5.5M12 3.5v.5" /></Icon> },
    { label: t.soap, icon: <Icon><rect x="3.5" y="7" width="11" height="13" rx="3" /><path d="M9 11v5M6.5 13.5h5" /><circle cx="18" cy="15" r="1.3" /><circle cx="17" cy="9.5" r="2" /></Icon> },
    { label: t.detergents, icon: <Icon><rect x="4" y="10" width="8" height="10" rx="1.5" /><path d="M8 10V6.5h4.5M6 4.2h4" /><path d="M17.5 11.5c-1.3 1.6-2 2.5-2 3.4a2 2 0 0 0 4 0c0-.9-.7-1.8-2-3.4z" /></Icon> },
    { label: t.cosmetics, icon: <Icon><rect x="4" y="14" width="6" height="6" rx="1" /><path d="M5 14v-4h4v4M5.8 10 6.5 4.5h1.2L8.2 10" /><rect x="13.5" y="11" width="7" height="9" rx="1.5" /></Icon> },
    { label: t.paints, icon: <Icon><rect x="5" y="3" width="12" height="5" rx="1" /><path d="M17 5.5h2v4h-7v3" /><rect x="10.5" y="12.5" width="3" height="8" rx="1" /></Icon> },
    { label: t.babySkinCare, icon: <Icon><circle cx="12" cy="13" r="8" /><path d="M12 5c0-1.6 1.4-2.3 2.6-1.6M9.3 12.5h.01M14.7 12.5h.01M9.6 16c1.2 1.2 3.6 1.2 4.8 0" /></Icon> },
    { label: t.homeCare, icon: <Icon><path d="M4 11 12 4l8 7v9H4z" /><path d="M12 17c-2.5-1.6-3.2-2.8-3.2-3.8 0-1 .8-1.7 1.7-1.7.7 0 1.2.4 1.5.9.3-.5.8-.9 1.5-.9.9 0 1.7.7 1.7 1.7 0 1-.7 2.2-3.2 3.8z" /></Icon> },
    { label: t.leatherCarCare, icon: <Icon><path d="m5 12 1.5-4.5A2 2 0 0 1 8.4 6h7.2a2 2 0 0 1 1.9 1.5L19 12" /><path d="M4 12h16v6H4zM6 18v2M18 18v2M7.5 15h.01M16.5 15h.01" /></Icon> },
  ]);
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
      className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden px-3 py-8 text-center transition-colors duration-300 hover:bg-brand-orange/10 xl:h-[calc(135*var(--u))] xl:items-start xl:justify-start xl:gap-[calc(14*var(--u))] xl:px-0 xl:py-0 xl:pe-[calc(8*var(--u))] xl:ps-[calc(10*var(--u))] xl:pt-[calc(30*var(--u))] xl:text-start xl:hover:bg-transparent"
    >
      <span className="pointer-events-none absolute inset-0 hidden bg-gradient-to-br from-[#fae8e5] to-[#fbf1e3] opacity-0 transition-opacity duration-300 group-hover:opacity-100 xl:block" aria-hidden="true" />
      <span ref={glowRef} className="pointer-events-none absolute h-11 w-11 rounded-full bg-brand-orange/40 opacity-0" aria-hidden="true" />
      <span ref={iconRef} className="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange transition-colors duration-300 group-hover:bg-brand-orange group-hover:text-white xl:h-auto xl:w-auto xl:rounded-none xl:bg-transparent xl:group-hover:bg-transparent xl:group-hover:text-brand-orange">
        {item.icon}
      </span>
      <LocaleLink href={item.href} aria-label={item.label} className="absolute inset-0 z-20 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-orange" />
      <span ref={labelRef} className="relative text-[13px] font-semibold text-ink transition-colors duration-300 group-hover:text-brand-orange xl:text-[max(13px,calc(19*var(--u)))] xl:font-bold xl:leading-[calc(26*var(--u))] xl:text-[#8a93a6] xl:group-hover:text-brand-orange">{item.label}</span>
    </div>
  );
}

export default function Industries({ dict, layout }) {
  const industries = arrange(layout, "home.industries", getIndustries(dict)).map((x) => x.item);
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
  }, [dict, industries.length]);

  if (!industries.length) return null;

  return (
    <Mx as="section" className="bg-[#fcfcfa] px-4 py-16 [--u:1px] sm:px-6 md:py-20 xl:px-0 xl:pb-[calc(110*var(--u))] xl:pt-[calc(87*var(--u))] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="mx-auto max-w-[1200px] xl:max-w-[calc(1600*var(--u))]">
        <div className="flex flex-col items-center text-center">
          <p className="mx-eyebrow mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-navy xl:mb-[calc(11*var(--u))] xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]">{dict.industries.eyebrow}</p>
          <MxText as="h2" delay={150} className="max-w-[560px] text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] text-brand-navy md:text-[32px] md:leading-[40px] xl:max-w-none xl:text-[max(28px,calc(40*var(--u)))] xl:leading-[calc(48*var(--u))]">{dict.industries.heading}</MxText>
          <p style={{ "--d": "450ms" }} className="mx-fade mt-4 max-w-[560px] text-[14px] leading-[22px] text-ink/60 xl:mt-[calc(16*var(--u))] xl:max-w-[calc(820*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">{dict.industries.paragraph}</p>
        </div>

        <div ref={gridRef} className="relative mt-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 xl:mt-[calc(51*var(--u))]">
          {industries.map((item, index) => (
            <div key={index} className="relative">
              {/* dividers: 2 columns on phones, 4 on tablets, 7 on desktop */}
              {index % 2 !== 0 && <span className="divider-line absolute inset-y-0 start-0 w-px origin-top bg-[#9aa8c0]/60 md:hidden" aria-hidden="true" />}
              {index % 4 !== 0 && <span className="divider-line absolute inset-y-0 start-0 hidden w-px origin-top bg-[#9aa8c0]/60 md:block lg:hidden" aria-hidden="true" />}
              {index % 7 !== 0 && <span className="divider-line absolute inset-y-0 start-0 hidden w-px origin-top bg-[#9aa8c0]/60 lg:block" aria-hidden="true" />}
              {index >= 2 && <span className="divider-line absolute inset-x-0 top-0 h-px origin-left bg-[#9aa8c0]/60 md:hidden" aria-hidden="true" />}
              {index >= 4 && <span className="divider-line absolute inset-x-0 top-0 hidden h-px origin-left bg-[#9aa8c0]/60 md:block lg:hidden" aria-hidden="true" />}
              {index >= 7 && <span className="divider-line absolute inset-x-0 top-0 hidden h-px origin-left bg-[#9aa8c0]/60 lg:block" aria-hidden="true" />}
              <IndustryCell
                item={item}
                cellRef={(el) => (cellRefs.current[index] = el)}
              />
            </div>
          ))}
        </div>

        <div style={{ "--d": "300ms" }} className="mx-fade mt-9 flex flex-wrap items-center justify-center gap-3 xl:mt-[calc(69*var(--u))] xl:gap-[calc(29*var(--u))]">
          <LocaleLink href="/flavours-fragrances" className="flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0 xl:h-[max(40px,calc(48*var(--u)))] xl:w-[calc(230*var(--u))] xl:min-w-[170px] xl:rounded-[calc(8*var(--u))] xl:px-0 xl:text-[max(12px,calc(14*var(--u)))]"><Roll>{dict.buttons.exploreIndustries}</Roll></LocaleLink>
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