"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { DEFAULT_FORMAT } from "@/lib/flavoursData";

const isExternal = (href) => /^(https?:|mailto:|tel:)/.test(href);

// Sizes follow the 1920px design: below 1920 everything scales with the viewport (vw)
// and stops at a readable minimum, so the page keeps the design's proportions on laptops.
const COL = "mx-auto w-full max-w-[75rem] px-4 sm:px-6 lg:w-[max(62.5vw,56rem)] lg:px-0";
const ARROW = "clamp(2.75rem, 2.9vw, 3.5rem)";

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[42%] w-[42%]">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

// Round arrow button. On hover the arrow shoots out to the top right and a fresh one slides in
// from the bottom left, while the circle fills orange and grows slightly.
function ArrowButton() {
  const move = "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";
  return (
    <span
      aria-hidden="true"
      style={{ width: ARROW, height: ARROW, bottom: `calc(${ARROW} / -2)` }}
      className="absolute end-[clamp(1rem,1.25vw,1.5rem)] z-10 flex items-center justify-center overflow-hidden rounded-full bg-white text-brand-orange shadow-[0_6px_18px_rgba(0,0,0,0.18)] transition-[background-color,color,box-shadow,transform] duration-300 ease-out group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white group-hover:shadow-[0_10px_24px_rgba(232,115,26,0.38)] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    >
      <span className="flex h-full w-full items-center justify-center rtl:-scale-x-100">
        <span className={`absolute inset-0 flex items-center justify-center ${move} group-hover:translate-x-full group-hover:-translate-y-full motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0`}>
          <ArrowIcon />
        </span>
        <span className={`absolute inset-0 flex -translate-x-full translate-y-full items-center justify-center ${move} group-hover:translate-x-0 group-hover:translate-y-0 motion-reduce:hidden`}>
          <ArrowIcon />
        </span>
      </span>
    </span>
  );
}

function CategoryCard({ item }) {
  const body = (
    <>
      <div className="relative">
        <div className="relative aspect-[384/247] overflow-hidden">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 1920px) 384px, (min-width: 1024px) 20vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
        <ArrowButton />
      </div>
      <div className="px-5 pb-6 pt-[calc(1.375rem+0.75rem)] lg:px-[clamp(1.25rem,1.25vw,1.5rem)] lg:pb-[clamp(1.1rem,1.15vw,1.4rem)] lg:pt-[calc(clamp(2.75rem,2.9vw,3.5rem)/2+clamp(0.375rem,0.45vw,0.625rem))]">
        <h3 className="pe-[clamp(2.5rem,3.4vw,4rem)] text-[1.125rem] font-semibold leading-[1.3] text-white lg:text-[clamp(1rem,1.2vw,1.4rem)]">{item.title}</h3>
        <p className="mt-1.5 text-[0.875rem] leading-[1.55] text-white/85 lg:mt-[clamp(0.25rem,0.3vw,0.375rem)] lg:max-w-[88%] lg:text-[clamp(0.8125rem,0.8vw,0.95rem)]">{item.desc}</p>
      </div>
    </>
  );

  const cls =
    "group block overflow-hidden rounded-[1.5rem] bg-[#202020] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(10,37,64,0.22)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:rounded-[clamp(1.25rem,1.46vw,1.75rem)]";

  if (!item.href) return <article className={cls}>{body}</article>;
  if (isExternal(item.href)) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {body}
      </a>
    );
  }
  return (
    <Link href={item.href} className={cls}>
      {body}
    </Link>
  );
}

// One block of the page: the photo band with its statement, then the category grid with the format filter.
export default function FlavoursSection({ section, meta, last = false }) {
  const [format, setFormat] = useState(DEFAULT_FORMAT);

  const items = section.items.map((item, i) => ({ ...item, ...(meta[i] || { formats: ["liquid", "powder"], href: null }) }));
  const visible = items.filter((item) => item.formats.includes(format));
  const chips = [
    { key: "liquid", label: section.liquid },
    { key: "powder", label: section.powder },
  ];

  return (
    <>
      {/* Photo band: 1920 x 538 in the design */}
      <div className="relative isolate flex min-h-[18rem] items-center justify-center overflow-hidden bg-brand-navy sm:min-h-[22rem] lg:aspect-[1920/538] lg:min-h-[24rem]">
        <Image src={section.bandImage} alt="" fill sizes="100vw" className="-z-20 animate-about-zoom object-cover motion-reduce:animate-none" />
        <div className="absolute inset-0 -z-10 bg-black/45" aria-hidden="true" />
        <div className={`${COL} py-14 text-center`}>
          <Reveal as="p" className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-white lg:text-[clamp(0.75rem,0.7vw,0.875rem)]">
            {section.eyebrow}
          </Reveal>
          <Reveal as="p" delay={120} className="mt-4 text-[1.375rem] font-normal leading-[1.45] text-white sm:text-[1.625rem] lg:mt-[clamp(1rem,1vw,1.25rem)] lg:text-[clamp(1.5rem,2.1vw,2.5rem)] lg:leading-[1.4]">
            {section.bandText}
          </Reveal>
        </div>
      </div>

      {/* Category grid */}
      <div
        className={`bg-[#fcfcfa] pt-14 sm:pt-16 lg:pt-[clamp(3.5rem,5.9vw,6.75rem)] ${
          last ? "pb-20 sm:pb-24 lg:pb-[clamp(5rem,14.7vw,17.5rem)]" : "pb-16 sm:pb-20 lg:pb-[clamp(4rem,8.6vw,10.25rem)]"
        }`}
      >
        <div className={COL}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <Reveal as="div">
              <h2 className="text-[1.75rem] font-semibold leading-[1.2] text-brand-navy sm:text-[2rem] lg:text-[clamp(1.75rem,2.1vw,2.5rem)]">{section.heading}</h2>
            </Reveal>
            <Reveal as="div" delay={100} className="flex flex-wrap items-center gap-3">
              <span className="text-[0.8125rem] text-ink/50 lg:text-[clamp(0.75rem,0.65vw,0.8125rem)]">{section.formatsLabel}</span>
              <div role="group" aria-label={section.formatsLabel} className="flex flex-wrap gap-3">
                {chips.map((chip) => {
                  const on = format === chip.key;
                  return (
                    <button
                      key={chip.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setFormat(chip.key)}
                      className={`h-11 rounded-[0.625rem] border px-5 text-[0.8125rem] font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/25 motion-reduce:transition-none lg:h-[clamp(2.5rem,2.55vw,3rem)] lg:px-[clamp(1rem,1.1vw,1.375rem)] lg:text-[clamp(0.75rem,0.72vw,0.875rem)] ${
                        on
                          ? "border-brand-orange bg-brand-orange text-white shadow-[0_6px_16px_rgba(232,115,26,0.28)]"
                          : "border-black/10 bg-white text-brand-navy hover:border-brand-orange hover:text-brand-orange"
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          </div>

          <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:mt-[clamp(1.75rem,2.6vw,3.125rem)] lg:grid-cols-3 lg:gap-x-[clamp(1rem,1.25vw,1.5rem)] lg:gap-y-[clamp(1.5rem,2.1vw,2.5rem)]">
            {visible.map((item, i) => (
              <Reveal key={`${format}-${item.title}`} delay={(i % 3) * 90}>
                <CategoryCard item={item} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
