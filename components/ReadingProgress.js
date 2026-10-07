"use client";

import { useEffect, useRef } from "react";

export default function ReadingProgress({ targetId = "article" }) {
  const bar = useRef(null);

  useEffect(() => {
    const el = document.getElementById(targetId);
    let raf = 0;

    const update = () => {
      raf = 0;
      if (!el || !bar.current) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.4;
      const done = Math.min(Math.max(-rect.top + window.innerHeight * 0.3, 0), Math.max(total, 1));
      bar.current.style.transform = `scaleX(${total > 0 ? done / total : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [targetId]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px]">
      <div ref={bar} className="h-full origin-left bg-brand-orange rtl:origin-right" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}