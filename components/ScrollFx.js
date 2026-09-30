"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollFx({ children, delay = 0, className = "", as = "div", y = 24, scale = 0.97 }) {
  const Tag = as;
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { opacity: 1, y: 0, scale: 1 });
      return;
    }

    gsap.set(el, { opacity: 0, y, scale });

    const anim = gsap.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      delay: delay / 1000,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        once: true,
      },
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [delay, y, scale]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}