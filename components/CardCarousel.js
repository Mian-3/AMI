"use client";

import { useEffect, useRef, useState, Children } from "react";

export default function CardCarousel({ children, interval = 3000 }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const count = Children.count(children);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth || 1;
    const gap = 16;
    const index = Math.round(el.scrollLeft / (cardWidth + gap));
    setActive(Math.min(Math.max(index, 0), count - 1));
  };

  const scrollToIndex = (index) => {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.firstChild?.offsetWidth || 1;
    const gap = 16;
    el.scrollTo({ left: index * (cardWidth + gap), behavior: "smooth" });
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      if (pausedRef.current) return;
      setActive((prev) => {
        const next = (prev + 1) % count;
        scrollToIndex(next);
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [count, interval]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div onMouseEnter={pause} onMouseLeave={resume} onTouchStart={pause} onTouchEnd={() => setTimeout(resume, interval)}>
      <div ref={trackRef} onScroll={handleScroll} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {Children.map(children, (child) => (
          <div className="w-[78%] shrink-0 snap-center first:ml-4 last:mr-4">{child}</div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-1.5">
        {Array.from({ length: count }).map((_, i) => (
          <button key={i} type="button" aria-label={"Go to card " + (i + 1)} onClick={() => { pause(); scrollToIndex(i); setTimeout(resume, interval); }} className={"h-1.5 rounded-full transition-all duration-300 " + (i === active ? "w-5 bg-brand-orange" : "w-1.5 bg-brand-navy/20")} />
        ))}
      </div>
    </div>
  );
}