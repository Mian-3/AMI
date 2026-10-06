"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// First visit or refresh: minimum time the loader stays (ms since the page started loading).
const FIRST_MIN_MS = 1300;
// First visit or refresh: give up waiting for the page to finish loading (ms).
const FIRST_MAX_MS = 10000;
// Link click: how long the animation plays before the new page is requested (ms).
const MIN_SHOW_MS = 1000;
// Link click: safety net if the new page never arrives (ms).
const MAX_WAIT_MS = 20000;

function Arcs({ className }) {
  return (
    <svg viewBox="0 0 600 600" fill="none" aria-hidden="true" className={className}>
      <g transform="rotate(-24 300 300)" strokeLinecap="round" stroke="currentColor">
        <path d="M40 300 A260 130 0 0 1 560 300" strokeOpacity="0.9" strokeWidth="14" />
        <path d="M80 330 A220 108 0 0 1 520 330" strokeOpacity="0.65" strokeWidth="10" />
        <path d="M120 360 A180 86 0 0 1 480 360" strokeOpacity="0.4" strokeWidth="7" />
      </g>
      <circle cx="470" cy="150" r="22" fill="currentColor" fillOpacity="0.7" />
    </svg>
  );
}

export default function NavigationLoader({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  // Starts visible so it is part of the very first paint.
  const [active, setActive] = useState(true);
  const [bar, setBar] = useState("idle");
  // Changing this remounts the page so its entrance animations play after the loader.
  const [gen, setGen] = useState(0);
  const busy = useRef(true);
  const firstDone = useRef(false);
  const timers = useRef([]);
  const lastPath = useRef(pathname);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const later = useCallback((fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  const finish = useCallback(() => {
    clearTimers();
    setBar("done");
    later(() => {
      setActive(false);
      busy.current = false;
    }, 250);
    later(() => setBar("idle"), 900);
  }, [clearTimers, later]);

  const begin = useCallback(
    (path) => {
      clearTimers();
      busy.current = true;
      setActive(true);
      setBar("idle");
      later(() => setBar("run"), 30);
      try {
        router.prefetch(path);
      } catch {}
      later(() => router.push(path), MIN_SHOW_MS);
      later(finish, MAX_WAIT_MS);
    },
    [clearTimers, later, finish, router]
  );

  // First visit or refresh.
  useEffect(() => {
    later(() => setBar("run"), 30);

    const revealPage = () => {
      if (firstDone.current) return;
      firstDone.current = true;
      setGen((g) => g + 1);
      finish();
    };

    const onLoad = () => later(revealPage, Math.max(0, FIRST_MIN_MS - performance.now()));

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    later(revealPage, Math.max(0, FIRST_MAX_MS - performance.now()));

    return () => window.removeEventListener("load", onLoad);
  }, [later, finish]);

  // New page arrived after a link click: let it settle for a moment, then reveal it.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    if (busy.current) later(finish, 80);
  }, [pathname, later, finish]);

  // Catch every internal link click.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest("a") : null;
      if (!a || !a.href || a.hasAttribute("download") || a.hasAttribute("data-no-loader")) return;
      if (a.target && a.target !== "_self") return;

      const url = new URL(a.href, window.location.href);
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      if (url.origin !== window.location.origin) return;
      if (/\.[a-z0-9]{2,5}$/i.test(url.pathname)) return;
      if (url.pathname === window.location.pathname) return;
      if (busy.current) return;

      e.preventDefault();
      begin(url.pathname + url.search + url.hash);
    };

    const onPageShow = (e) => {
      if (e.persisted && busy.current) finish();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [begin, finish]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const label = pathname && pathname.startsWith("/ar") ? "جارٍ التحميل" : "Loading";

  const barStyle =
    bar === "idle"
      ? { width: "0%", opacity: 1, transition: "none" }
      : bar === "run"
        ? { width: "88%", opacity: 1, transition: "width 2.2s cubic-bezier(0.1, 0.7, 0.2, 1)" }
        : { width: "100%", opacity: 0, transition: "width 0.25s ease-out, opacity 0.35s ease 0.25s" };

  return (
    <>
      {/* Top progress bar */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[110] h-[3px]">
        <div className="h-full bg-gradient-to-r from-brand-orange to-[#f7aa63] shadow-[0_0_10px_rgba(242,143,59,0.6)]" style={barStyle} />
      </div>

      {/* Full screen loader */}
      <div
        role="status"
        aria-live="polite"
        aria-hidden={!active}
        className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-white transition-[opacity,visibility] ease-out ${
          active ? "visible opacity-100 duration-200" : "pointer-events-none invisible opacity-0 duration-500"
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(242,143,59,0.12),transparent_65%)]" aria-hidden="true" />
        <Arcs className="absolute -start-24 -top-24 h-[360px] w-[360px] text-brand-orange opacity-[0.12] rtl:-scale-x-100 md:h-[520px] md:w-[520px]" />
        <Arcs className="absolute -bottom-28 -end-20 h-[320px] w-[320px] rotate-180 text-brand-orange opacity-[0.1] rtl:-scale-x-100 md:h-[460px] md:w-[460px]" />

        <div
          className={`relative flex flex-col items-center gap-5 transition duration-500 ease-out motion-reduce:transition-none ${
            active ? "translate-y-0 opacity-100 delay-100" : "translate-y-3 opacity-0"
          }`}
        >
          <Image
  src="/images/logo/am-international-logo.svg"
  alt="AM International"
  width={1184}
  height={329}
  priority
  className="w-[160px] h-auto"
/>

          <svg viewBox="0 0 120 70" width="150" height="88" aria-hidden="true" className="text-brand-orange motion-reduce:hidden">
            <defs>
              <filter id="ami-goo" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
              </filter>
            </defs>
            <g filter="url(#ami-goo)" fill="currentColor">
              <circle cx="26" cy="30" r="9">
                <animate attributeName="cx" values="26;60;26" keyTimes="0;0.5;1" dur="1.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
              </circle>
              <circle cx="94" cy="30" r="9">
                <animate attributeName="cx" values="94;60;94" keyTimes="0;0.5;1" dur="1.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
              </circle>
              <circle cx="60" cy="30" r="7">
                <animate attributeName="r" values="7;12;7" keyTimes="0;0.5;1" dur="1.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
              </circle>
            </g>
            <ellipse cx="60" cy="56" rx="14" ry="2.5" fill="currentColor" opacity="0.18">
              <animate attributeName="rx" values="14;30;14" keyTimes="0;0.5;1" dur="1.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.45 0 0.55 1;0.45 0 0.55 1" />
            </ellipse>
          </svg>

          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand-navy/60 rtl:normal-case rtl:tracking-normal">{label}</p>
        </div>
      </div>

      {/* The page itself. A new key restarts its entrance animations once the loader is ready. */}
      <Fragment key={gen}>{children}</Fragment>
    </>
  );
}