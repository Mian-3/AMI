"use client";

import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "EN", label: "English" },
  { code: "AR", label: "العربية" },
];

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={"transition-transform duration-200 " + (open ? "rotate-180" : "")}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(languages[0]);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open} className="flex items-center gap-1.5 transition-opacity hover:opacity-80">
        <GlobeIcon />
        <span>{current.code}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <ul role="listbox" className="absolute right-0 top-full z-10 mt-2 w-28 overflow-hidden rounded-md border border-white/10 bg-brand-navy shadow-lg">
          {languages.map((lang) => (
            <li key={lang.code}>
              <button type="button" onClick={() => { setCurrent(lang); setOpen(false); }} className={"flex w-full items-center justify-between px-3 py-2 text-left text-[11px] transition-colors hover:bg-white/10 " + (lang.code === current.code ? "text-brand-orange" : "text-white")}>
                {lang.label}
                {lang.code === current.code && <span>✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}