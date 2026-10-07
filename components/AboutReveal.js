"use client";

import { useEffect, useRef, useState } from "react";

const HIDDEN = {
  up: "translate-y-6",
  start: "-translate-x-8 rtl:translate-x-8",
  end: "translate-x-8 rtl:-translate-x-8",
};

export default function AboutReveal({ children, delay = 0, from = "up", className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? "translate-x-0 translate-y-0 opacity-100" : `opacity-0 ${HIDDEN[from]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}