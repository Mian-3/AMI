"use client";

import { useEffect, useRef, useState } from "react";

/* One library row. Wipes in when it scrolls into view (see DL_CSS in DownloadsLibrary). */
export default function DownloadsRow({ delay = 0, children }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-in={on ? "true" : "false"} style={{ "--d": `${delay}ms` }}>
      <div className="dl-row">{children}</div>
    </div>
  );
}
