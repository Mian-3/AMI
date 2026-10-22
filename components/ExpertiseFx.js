"use client";

import { useEffect, useRef, useState } from "react";

// Starts the section's own entrance animation (see .xp rules in globals.css) once it scrolls into view.
export default function ExpertiseFx({ children, className = "" }) {
  const ref = useRef(null);
  const [state, setState] = useState("pending");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("in");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("in");
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-xp={state} className={`xp ${className}`}>
      {children}
    </div>
  );
}
