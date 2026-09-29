"use client";

import { useEffect, useState } from "react";

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function VideoButton({ src, label }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="group hidden shrink-0 items-center gap-3 text-[12px] text-white md:flex">
        <span>{label}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/50 bg-white/15 backdrop-blur-sm transition duration-200 group-hover:scale-110 group-hover:bg-white/30 motion-reduce:transition-none"><PlayIcon /></span>
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-label={label} onClick={() => setOpen(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[960px]">
            <button type="button" aria-label="Close video" onClick={() => setOpen(false)} className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/40">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <video src={src} controls autoPlay playsInline className="aspect-video w-full rounded-lg bg-black" />
          </div>
        </div>
      )}
    </>
  );
}