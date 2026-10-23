"use client";

import { useEffect, useRef, useState } from "react";

// Motion scope for the home page. Starts "pending", flips to "in" when it scrolls into view,
// and feeds the pointer position to any [data-spot] element inside (for the moving light).
export default function Mx({ as: Tag = "div", className = "", children, threshold = 0.08, ...rest }) {
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
      { threshold, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  function onPointerMove(e) {
    if (e.pointerType === "touch") return;
    const card = e.target.closest?.("[data-spot]");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--sx", `${e.clientX - r.left}px`);
    card.style.setProperty("--sy", `${e.clientY - r.top}px`);
  }

  return (
    <Tag ref={ref} data-mx={state} onPointerMove={onPointerMove} className={`mx ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
