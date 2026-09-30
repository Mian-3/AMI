"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const languages = [
  { code: "en", label: "English", short: "EN" },
  { code: "ar", label: "العربية", short: "AR" },
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

export default function LanguageSwitcher({ variant = "light" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/");
  const currentCode = segments[1] === "ar" ? "ar" : "en";
  const current = languages.find((l) => l.code === currentCode) || languages[0];

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const switchTo = (code) => {
    setOpen(false);
    if (code === currentCode) return;
    document.cookie = "preferred_locale=" + code + ";path=/;max-age=31536000";
    const rest = segments.slice(2).join("/");
    router.push("/" + code + (rest ? "/" + rest : ""));
  };

  const isDark = variant === "dark";

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open} className={"flex items-center gap-1.5 transition-opacity hover:opacity-80 " + (isDark ? "text-white" : "text-brand-navy")}>
        <GlobeIcon />
        <span>{current.short}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <ul role="listbox" className={"absolute end-0 top-full z-10 mt-2 w-28 overflow-hidden rounded-md border shadow-lg " + (isDark ? "border-white/10 bg-brand-navy" : "border-brand-navy/10 bg-white")}>
          {languages.map((lang) => (
            <li key={lang.code}>
              <button type="button" onClick={() => switchTo(lang.code)} className={"flex w-full items-center justify-between px-3 py-2 text-left text-[11px] transition-colors " + (isDark ? "hover:bg-white/10" : "hover:bg-brand-navy/5") + " " + (lang.code === currentCode ? "text-brand-orange" : isDark ? "text-white" : "text-brand-navy")}>
                {lang.label}
                {lang.code === currentCode && <span>✓</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}