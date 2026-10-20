"use client";

import { useEffect, useRef, useState } from "react";

export default function CountUp({ value, duration = 1600 }) {
  // Numbers may have thousands separators (100,000+). Text after the number is kept as it is.
  const match = String(value).match(/^(\d[\d,]*)(.*)$/);
  const digits = match ? match[1].replace(/,/g, "") : "";
  const end = match ? parseInt(digits, 10) : 0;
  const suffix = match ? match[2] : "";
  const grouped = match ? match[1].includes(",") : false;
  const show = (n) => (grouped ? n.toLocaleString("en-US") : String(n));
  const ref = useRef(null);
  const [current, setCurrent] = useState(end);

  useEffect(() => {
    const el = ref.current;
    if (!el || !match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame;
    setCurrent(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCurrent(Math.round(end * eased));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration]);

  return (
    <span ref={ref}>
      {show(current)}
      {suffix}
    </span>
  );
}