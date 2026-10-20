"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CatalogueDownloadLink from "@/components/CatalogueDownloadLink";
import { useMedia } from "@/components/MediaProvider";
import { resolveHref } from "@/lib/mediaShared";

/*
  Design artboard 1920. At xl+ every size is calc(N * var(--u)) with a floor,
  so the hero scales exactly like the Figma frame. Below xl the compact layout is kept.
*/
export default function Hero({ dict, locale }) {
  const isRtl = locale === "ar";
  const media = useMedia();
  const eyebrowWrapRef = useRef(null);
  const headingWrapRef = useRef(null);
  const taglineRef = useRef(null);
  const buttonsRef = useRef(null);
  const videoBtnRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const wraps = [eyebrowWrapRef.current, headingWrapRef.current];
    const fades = [taglineRef.current, buttonsRef.current, videoBtnRef.current];
    if (wraps.some((el) => !el) || fades.some((el) => !el)) return;
    const innerEls = wraps.map((w) => w.firstElementChild);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(innerEls, { yPercent: 0 });
      gsap.set(fades, { opacity: 1, y: 0 });
      return;
    }
    gsap.set(innerEls, { yPercent: 110 });
    gsap.set(fades, { opacity: 0, y: 16 });

    const tl = gsap.timeline({ delay: 0.05 });
    tl.to(innerEls[0], { yPercent: 0, duration: 0.45, ease: "power4.out" })
      .to(innerEls[1], { yPercent: 0, duration: 0.55, ease: "power4.out" }, "-=0.5")
      .to(fades[0], { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.35")
      .to(fades[1], { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.3")
      .to(fades[2], { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.45");
    return () => tl.kill();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const videoLabel = dict.hero.videoLabel || (isRtl ? "فيديو A.M International" : "A.M International Video");

  return (
    <section className="relative flex min-h-[480px] items-end overflow-hidden bg-brand-navy text-white [--u:1px] md:h-[625px] xl:h-[calc(818*var(--u))] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <video key={media.hero.video} src={media.hero.video} poster={media.hero.poster} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
      <div className={"absolute inset-0 " + (isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r") + " from-black/60 via-black/20 to-transparent"} aria-hidden="true" />

      <div className="relative mx-auto flex w-full max-w-[1200px] items-end justify-between gap-6 px-4 pb-14 sm:px-6 md:pb-[96px] xl:max-w-[calc(1600*var(--u))] xl:px-0 xl:pb-[calc(140*var(--u))]">
        <div className="max-w-[640px] xl:max-w-[calc(760*var(--u))]">
          <div ref={eyebrowWrapRef} className="overflow-hidden">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] xl:mb-[calc(20*var(--u))] xl:text-[max(12px,calc(16*var(--u)))]">{dict.hero.eyebrow}</p>
          </div>
          <div ref={headingWrapRef} className="overflow-hidden">
            <h1 className="text-[40px] font-semibold leading-[1.1] md:text-[56px] md:leading-[60px] xl:text-[max(56px,calc(78*var(--u)))] xl:leading-[calc(80*var(--u))]">{dict.hero.heading}</h1>
          </div>
          <p ref={taglineRef} className="mt-4 text-[15px] font-medium md:text-[18px] xl:mt-[calc(28*var(--u))] xl:text-[max(16px,calc(24*var(--u)))]">{dict.hero.tagline}</p>
          <div ref={buttonsRef} className="mt-6 flex flex-wrap items-center gap-3 xl:mt-[calc(28*var(--u))] xl:gap-[calc(28*var(--u))]">
            <a href={resolveHref(media.links.requestSample, locale)} className="flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0 xl:h-[max(40px,calc(48*var(--u)))] xl:w-[calc(180*var(--u))] xl:min-w-[150px] xl:rounded-[calc(8*var(--u))] xl:px-0 xl:text-[max(12px,calc(14*var(--u)))]">{dict.buttons.requestSample}</a>
            <CatalogueDownloadLink
              label={dict.buttons.downloadCatalogueArrow}
              icon="none"
              className="group flex h-9 items-center whitespace-nowrap px-1 text-[12px] font-medium text-white transition duration-200 hover:opacity-80 xl:h-[max(40px,calc(48*var(--u)))] xl:text-[max(12px,calc(14*var(--u)))]"
            />
          </div>
        </div>

        <button
          ref={videoBtnRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={videoLabel}
          className="group hidden shrink-0 items-center gap-3 text-[12px] font-medium md:flex xl:gap-[calc(18*var(--u))] xl:text-[max(12px,calc(14*var(--u)))]"
        >
          {/* <span>{videoLabel}</span> */}
          {/* <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white transition duration-300 group-hover:scale-110 group-hover:bg-white/15 xl:h-[max(36px,calc(48*var(--u)))] xl:w-[max(36px,calc(48*var(--u)))]">
            <svg viewBox="0 0 24 24" fill="currentColor" className={"h-4 w-4 " + (isRtl ? "-scale-x-100" : "ms-0.5")} aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </span> */}
        </button>
      </div>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={videoLabel} onClick={() => setOpen(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 animate-[fadeIn_.25s_ease-out]">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[1100px]">
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute -top-10 end-0 text-3xl leading-none text-white transition-opacity hover:opacity-70">×</button>
            <video src={media.hero.video} poster={media.hero.poster} controls autoPlay playsInline className="aspect-video w-full rounded-lg bg-black" />
          </div>
        </div>
      )}
      <style>{"@keyframes fadeIn{from{opacity:0}to{opacity:1}}"}</style>
    </section>
  );
}
