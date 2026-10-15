"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { login } from "@/app/admin/actions";

// Typing one of these opens the private sign-in for the website team. It is never listed or suggested to visitors.
const ADMIN_WORDS = ["admin", "admin login", "login", "ادمن", "الادمن", "لوحة التحكم"];

const CSS = `
@keyframes ss-fade{from{opacity:0}to{opacity:1}}
@keyframes ss-pop{from{opacity:0;transform:translateY(-10px) scale(.98)}to{opacity:1;transform:none}}
.ss-fade{animation:ss-fade .18s ease-out both}
.ss-pop{animation:ss-pop .22s cubic-bezier(.2,.8,.2,1) both}
@media (prefers-reduced-motion:reduce){.ss-fade,.ss-pop{animation:none}}
`;

const FIELD =
  "h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-[16px] text-ink outline-none transition placeholder:text-ink/35 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";

function Svg({ children, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const SearchIcon = ({ size }) => (
  <Svg size={size}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </Svg>
);

const LockIcon = () => (
  <Svg>
    <rect x="4" y="11" width="16" height="10" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);

const PageIcon = () => (
  <Svg>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
  </Svg>
);

function AdminSignIn({ ar, onBack }) {
  const [state, formAction, pending] = useActionState(login, null);
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <form action={formAction} className="ss-fade space-y-4 p-6" dir="ltr">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange/10 text-brand-orange">
          <LockIcon />
        </span>
        <div>
          <p className="text-[16px] font-semibold text-brand-navy">Admin sign in</p>
          <p className="text-[13px] text-ink/55">Use the email you were invited with and your password.</p>
        </div>
      </div>
      <input ref={ref} name="email" type="email" required autoComplete="username" placeholder="Email" className={FIELD} />
      <input name="password" type="password" required autoComplete="current-password" placeholder="Password" className={FIELD} />
      {state?.error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{state.error}</p> : null}
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="h-12 flex-1 rounded-xl bg-brand-orange text-[15px] font-semibold text-white transition hover:opacity-90 disabled:cursor-wait disabled:opacity-70">
          {pending ? "Signing in..." : "Sign in"}
        </button>
        <button type="button" onClick={onBack} className="h-12 rounded-xl px-4 text-[14px] font-medium text-ink/60 transition hover:bg-black/5">
          {ar ? "رجوع" : "Back"}
        </button>
      </div>
    </form>
  );
}

export default function SiteSearch({ items = [], locale = "en" }) {
  const ar = locale === "ar";
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState("search"); // "search" | "admin"
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const pages = useMemo(() => items.filter((i) => i.href && i.href !== "#"), [items]);
  const term = q.trim().toLowerCase();
  const isAdmin = ADMIN_WORDS.includes(term);
  const results = useMemo(() => {
    if (isAdmin) return [{ kind: "admin", label: "Admin login" }];
    const list = term ? pages.filter((p) => p.label.toLowerCase().includes(term)) : pages;
    return list.map((p) => ({ kind: "page", label: p.label, href: p.href }));
  }, [isAdmin, term, pages]);

  function openIt() {
    setQ("");
    setActive(0);
    setMode("search");
    setOpen(true);
  }

  function closeIt() {
    setOpen(false);
    btnRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e) => {
      if (e.key === "Escape") closeIt();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function choose(r) {
    if (r.kind === "admin") {
      setMode("admin");
      return;
    }
    window.location.assign(r.href);
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      choose(results[active]);
    }
  }

  return (
    <>
      <button ref={btnRef} type="button" aria-label={ar ? "بحث" : "Search"} aria-haspopup="dialog" onClick={openIt} className="transition-opacity hover:opacity-80">
        <SearchIcon size={12} />
      </button>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[120]" dir={ar ? "rtl" : "ltr"}>
              <style>{CSS}</style>
              <div className="ss-fade absolute inset-0 bg-[#0a2540]/55 backdrop-blur-sm" onClick={closeIt} aria-hidden="true" />
              <div className="relative mx-auto mt-[10vh] w-[calc(100%-2rem)] max-w-[34rem]">
                <div role="dialog" aria-modal="true" aria-label={ar ? "بحث" : "Search"} className="ss-pop overflow-hidden rounded-2xl bg-white shadow-[0_40px_90px_-20px_rgba(0,0,0,0.5)]">
                  {mode === "admin" ? (
                    <AdminSignIn ar={ar} onBack={() => setMode("search")} />
                  ) : (
                    <>
                      <div className="flex items-center gap-3 border-b border-black/10 px-5">
                        <span className="text-ink/40"><SearchIcon size={20} /></span>
                        <input
                          ref={inputRef}
                          value={q}
                          onChange={(e) => {
                            setQ(e.target.value);
                            setActive(0);
                          }}
                          onKeyDown={onKeyDown}
                          placeholder={ar ? "ابحث في الموقع" : "Search the website"}
                          aria-label={ar ? "ابحث في الموقع" : "Search the website"}
                          autoComplete="off"
                          autoCapitalize="none"
                          spellCheck={false}
                          className="h-14 w-full bg-transparent text-[16px] text-ink outline-none placeholder:text-ink/40"
                        />
                        <button type="button" onClick={closeIt} className="shrink-0 rounded-md border border-black/10 px-2 py-1 text-[11px] font-medium text-ink/50 transition hover:bg-black/5">
                          Esc
                        </button>
                      </div>
                      <ul role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
                        {results.length === 0 ? <li className="px-4 py-8 text-center text-[14px] text-ink/50">{ar ? "لا توجد نتائج" : "No results"}</li> : null}
                        {results.map((r, i) => (
                          <li key={r.label + i} role="option" aria-selected={i === active}>
                            <button
                              type="button"
                              onMouseEnter={() => setActive(i)}
                              onClick={() => choose(r)}
                              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-start text-[15px] transition-colors ${i === active ? "bg-brand-orange/10 text-brand-navy" : "text-ink/80"}`}
                            >
                              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${r.kind === "admin" ? "bg-brand-orange text-white" : "bg-black/5 text-ink/50"}`}>
                                {r.kind === "admin" ? <LockIcon /> : <PageIcon />}
                              </span>
                              <span className="font-medium">{r.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
