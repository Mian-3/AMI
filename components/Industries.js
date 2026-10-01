"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "@/components/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function Icon({ children }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function getIndustries(dict) {
  return [
    { label: dict.industries.items.beverages, icon: <Icon><path d="M7 3h10l-1 6a4 4 0 0 1-8 0z" /><path d="M12 13v8M8 21h8" /></Icon> },
    { label: dict.industries.items.biscuitsCakes, icon: <Icon><rect x="3" y="10" width="18" height="6" rx="2" /><path d="M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" /></Icon> },
    { label: dict.industries.items.soapsDetergents, icon: <Icon><rect x="6" y="4" width="12" height="17" rx="3" /><path d="M9 4V2h6v2" /></Icon> },
    { label: dict.industries.items.snacks, icon: <Icon><path d="M4 12a8 8 0 0 1 16 0c0 3-2 4-2 7H6c0-3-2-4-2-7Z" /><path d="M9 12h.01M15 12h.01M12 9h.01" /></Icon> },
    { label: dict.industries.items.confectionery, icon: <Icon><circle cx="7" cy="7" r="3" /><circle cx="17" cy="17" r="3" /><path d="m9.5 9.5 5 5" /></Icon> },
    { label: dict.industries.items.iceCreamDairy, icon: <Icon><path d="M8 10h8l-3 10h-2z" /><path d="M6 10a6 6 0 0 1 12 0z" /></Icon> },
    { label: dict.industries.items.cosmeticsPaints, icon: <Icon><path d="M8 3h8l1 5H7z" /><path d="M6 8h12v9a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" /></Icon> },
    { label: dict.industries.items.pharmaceutical, icon: <Icon><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)" /><path d="m9.5 9.5 5 5" /></Icon> },
  ];
}

function IndustryCell({ item, cellRef, iconRef, labelRef, glowRef }) {
  const isTouch = useRef(false);

  useEffect(() => {
    isTouch.current = window.matchMedia("(hover: none)").matches;
  }, []);

  const playIn = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.killTweensOf([iconRef.current, labelRef.current]);
    gsap.to(iconRef.current, { y: -4, rotate: 8, scale: 1.1, duration: 0.35, ease: "back.out(2.2)" });
    gsap.to(labelRef.current, { y: -2, duration: 0.3, ease: "power2.out" });
  };

  const playOut = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.to(iconRef.current, { y: 0, rotate: 0, scale: 1, duration: 0.4, ease: "power3.out" });
    gsap.to(labelRef.current, { y: 0, duration: 0.3, ease: "power2.out" });
  };

  const playRipple = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.killTweensOf(glowRef.current);
    gsap.fromTo(
      glowRef.current,
      { scale: 0.3, opacity: 0.5 },
      { scale: 2.2, opacity: 0, duration: 0.6, ease: "power2.out" }
    );
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
      onMouseEnter={!isTouch.current ? playIn : undefined}
      onMouseLeave={!isTouch.current ? playOut : undefined}
      onTouchStart={handleTap}
      className="group relative flex flex-col items-center justify-center gap-3 overflow-hidden px-4 py-9 text-center transition-colors duration-300 hover:bg-brand-orange/10"
    >
      <span ref={glowRef} className="pointer-events-none absolute h-11 w-11 rounded-full bg-brand-orange/40 opacity-0" aria-hidden="true" />
      <span ref={iconRef} className="relative flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange transition-colors duration-300 group-hover:bg-brand-orange group-hover:text-white">
        {item.icon}
      </span>
      <span ref={labelRef} className="relative text-[13px] font-medium text-ink transition-colors duration-300 group-hover:text-brand-orange">{item.label}</span>
    </div>
  );
}

export default function Industries({ dict }) {
  const industries = getIndustries(dict);
  const gridRef = useRef(null);
  const cellRefs = useRef([]);
  const iconRefs = useRef([]);
  const labelRefs = useRef([]);
  const glowRefs = useRef([]);

  useEffect(() => {
    const cells = cellRefs.current.filter(Boolean);
    if (!cells.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      gsap.set(cells, { opacity: 1, scale: 1 });
      return;
    }

    gsap.set(cells, { opacity: 0, scale: 0.85 });

    const dividers = gridRef.current.querySelectorAll(".divider-line");
    gsap.set(dividers, { scaleY: 0, scaleX: 0 });

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
    }).to(
      dividers,
      { scaleY: 1, scaleX: 1, duration: 0.5, ease: "power2.out", stagger: 0.03 },
      "-=0.3"
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [dict]);

  return (
    <section className="bg-white px-4 py-16 sm:px-6 md:py-20 xl:px-0">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center text-center">
          <Reveal as="p" className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-brand-navy">{dict.industries.eyebrow}</Reveal>
          <Reveal as="h2" delay={100} className="max-w-[560px] text-[26px] font-semibold leading-[1.25] text-brand-navy md:text-[32px] md:leading-[40px]">{dict.industries.heading}</Reveal>
          <Reveal as="p" delay={200} className="mt-4 max-w-[560px] text-[14px] leading-[22px] text-ink/60">{dict.industries.paragraph}</Reveal>
        </div>

        <div ref={gridRef} className="relative mt-10 grid grid-cols-2 md:grid-cols-4">
          {industries.map((item, index) => (
            <div key={item.label} className="relative">
              {index % 2 !== 0 && <span className="divider-line absolute inset-y-0 start-0 w-px origin-top bg-brand-navy/10 md:hidden" aria-hidden="true" />}
              {index % 4 !== 0 && <span className="divider-line hidden md:block absolute inset-y-0 start-0 w-px origin-top bg-brand-navy/10" aria-hidden="true" />}
              {index >= 2 && <span className="divider-line absolute inset-x-0 top-0 h-px origin-left bg-brand-navy/10 md:hidden" aria-hidden="true" />}
              {index >= 4 && <span className="divider-line hidden md:block absolute inset-x-0 top-0 h-px origin-left bg-brand-navy/10" aria-hidden="true" />}
              <IndustryCell
                item={item}
                cellRef={(el) => (cellRefs.current[index] = el)}
                iconRef={(el) => (iconRefs.current[index] = el)}
                labelRef={(el) => (labelRefs.current[index] = el)}
                glowRef={(el) => (glowRefs.current[index] = el)}
              />
            </div>
          ))}
        </div>

        <Reveal delay={450} className="mt-9 flex flex-wrap items-center justify-center gap-3">
                   <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0">{dict.buttons.exploreIndustries}</a>
          <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md border border-brand-navy/20 px-4 text-[12px] font-medium text-brand-navy transition duration-200 hover:-translate-y-0.5 hover:bg-brand-navy/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">{dict.buttons.downloadCatalogue}</a>
        </Reveal>
      </div>
    </section>
  );
}