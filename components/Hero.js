"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Hero({ dict, locale }) {
  const isRtl = locale === "ar";
  const eyebrowWrapRef = useRef(null);
  const headingWrapRef = useRef(null);
  const taglineRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const wraps = [eyebrowWrapRef.current, headingWrapRef.current];
    const fades = [taglineRef.current, buttonsRef.current];
    if (wraps.some((el) => !el) || fades.some((el) => !el)) return;

    const innerEls = wraps.map((wrap) => wrap.firstElementChild);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(innerEls, { yPercent: 0 });
      gsap.set(fades, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(innerEls, { yPercent: 110 });
    gsap.set(fades, { opacity: 0, y: 16 });

    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(innerEls[0], { yPercent: 0, duration: 0.7, ease: "power4.out" })
      .to(innerEls[1], { yPercent: 0, duration: 0.85, ease: "power4.out" }, "-=0.5")
      .to(fades[0], { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35")
      .to(fades[1], { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.3");

    return () => tl.kill();
  }, []);

  return (
    <section className="relative flex min-h-[480px] items-end overflow-hidden bg-brand-navy text-white md:h-[625px]">
      <video src="/videos/hero-video.mp4" poster="/images/hero/hero-bg.jpg" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div className={"absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent " + (isRtl ? "bg-gradient-to-l from-black/65 via-black/25 to-transparent" : "bg-gradient-to-r from-black/65 via-black/25 to-transparent")} aria-hidden="true" />
      <div className="relative mx-auto flex w-full max-w-[1200px] items-end justify-between gap-6 px-4 pb-16 sm:px-6 md:pb-[96px] xl:px-0">
        <div className="max-w-[640px]">
          <div ref={eyebrowWrapRef} className="overflow-hidden">
            <p className="mb-3 text-[12px] font-medium uppercase tracking-[0.06em]">{dict.hero.eyebrow}</p>
          </div>
          <div ref={headingWrapRef} className="overflow-hidden">
            <h1 className="text-[40px] font-medium leading-[1.1] md:text-[58px] md:leading-[60px]">{dict.hero.heading}</h1>
          </div>
          <p ref={taglineRef} className="mt-4 text-[15px] md:text-[18px]">{dict.hero.tagline}</p>
          <div ref={buttonsRef} className="mt-6 flex flex-wrap items-center gap-3">
            <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0">{dict.buttons.requestSample}</a>
            <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md border border-white/30 bg-white/15 px-4 text-[12px] font-medium text-white backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/25 motion-reduce:transition-none motion-reduce:hover:translate-y-0">{dict.buttons.downloadCatalogueArrow}</a>
          </div>
        </div>
      </div>
    </section>
  );
}