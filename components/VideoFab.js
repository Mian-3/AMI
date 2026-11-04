"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { parseVideo } from "@/lib/videoUrl";

function VideoIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="5" width="14.5" height="14" rx="3" fill="currentColor" />
      <path d="M17.5 10.2 21.3 7.6a.8.8 0 0 1 1.2.7v7.4a.8.8 0 0 1-1.2.7l-3.8-2.6v-3.6Z" fill="currentColor" />
      <path d="m8.6 9.4 4 2.6-4 2.6V9.4Z" fill="#fff" className="video-fab-play" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ExpandIcon({ on }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {on ? (
        <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
      ) : (
        <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
      )}
    </svg>
  );
}

// Floating video button (home page only). Click opens a full screen player with a close button
// and a full screen toggle. The video is uploaded in the admin (Site content > WhatsApp and YouTube).
export default function VideoFab({ video, label, closeLabel, fullscreenLabel }) {
  const parsed = parseVideo(video);
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const shellRef = useRef(null);
  const videoRef = useRef(null);
  const btnRef = useRef(null);

  const close = useCallback(() => {
    try {
      if (document.fullscreenElement) document.exitFullscreen?.();
    } catch {}
    videoRef.current?.pause?.();
    setOpen(false);
    setFull(false);
    btnRef.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !document.fullscreenElement) close();
    };
    const onFs = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFs);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFs);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  function toggleFull() {
    const shell = shellRef.current;
    if (!shell) return;
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      } else if (shell.requestFullscreen) {
        shell.requestFullscreen();
      } else if (videoRef.current?.webkitEnterFullscreen) {
        videoRef.current.webkitEnterFullscreen(); // iPhone Safari
      }
    } catch {}
  }

  if (!parsed) return null;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={label}
        aria-haspopup="dialog"
        style={{ animationDelay: "1.75s" }}
        className="group fixed bottom-[5.5rem] end-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_8px_24px_rgba(242,143,59,0.4)] outline-none transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(242,143,59,0.58)] focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2 motion-safe:animate-wa-in motion-reduce:transition-none sm:bottom-[6.25rem] sm:end-6 sm:h-[60px] sm:w-[60px]"
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-brand-orange opacity-35 motion-safe:animate-ping motion-safe:[animation-duration:2.6s] motion-reduce:hidden" aria-hidden="true" />
        <span className="transition-transform duration-300 ease-out group-hover:scale-110 motion-safe:group-hover:-rotate-6 motion-reduce:transition-none">
          <VideoIcon />
        </span>
        <span className="pointer-events-none absolute end-full top-1/2 me-3 hidden -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-md bg-brand-navy px-3 py-2 text-[12px] font-medium text-white opacity-0 shadow-lg transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 rtl:-translate-x-2 rtl:group-hover:translate-x-0 rtl:group-focus-visible:translate-x-0 md:block">
          {label}
        </span>
      </button>

      {open ? (
        <div
          ref={shellRef}
          role="dialog"
          aria-modal="true"
          aria-label={label}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 motion-safe:animate-[video-pop_0.28s_ease-out]"
        >
          <style>{`@keyframes video-pop{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}`}</style>

          <div className="absolute end-3 top-3 z-10 flex items-center gap-2 sm:end-5 sm:top-5">
            <button
              type="button"
              onClick={toggleFull}
              aria-label={fullscreenLabel}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white outline-none backdrop-blur transition hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white"
            >
              <ExpandIcon on={full} />
            </button>
            <button
              type="button"
              onClick={close}
              aria-label={closeLabel}
              autoFocus
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white outline-none backdrop-blur transition hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white"
            >
              <CloseIcon />
            </button>
          </div>

          {parsed.kind === "file" ? (
            <video
              ref={videoRef}
              src={parsed.src}
              controls
              autoPlay
              playsInline
              controlsList="nodownload"
              className="h-full max-h-full w-full max-w-full bg-black object-contain"
            />
          ) : (
            <iframe
              title={label}
              src={`https://www.youtube-nocookie.com/embed/${parsed.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full border-0 bg-black"
            />
          )}
        </div>
      ) : null}
    </>
  );
}
