"use client";

import { useEffect, useRef } from "react";

// Marks itself data-in="true" when it scrolls into view. Everything inside that has an
// animation class (pr-a, pr-wipe, pr-bar, pr-digits-in) then plays. Plays once.
export default function ProcessScene({ as: Tag = "div", threshold = 0.2, children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.in = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.in = "true";
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} {...props}>
      {children}
    </Tag>
  );
}
