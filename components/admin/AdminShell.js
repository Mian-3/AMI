"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

/* ---------- icons (18px, 1.6 stroke, one visual family) ---------- */
const P = {
  home: <path d="M3.5 9.2 10 3.8l6.5 5.4V16a.8.8 0 0 1-.8.8H12v-4.4H8v4.4H4.3a.8.8 0 0 1-.8-.8V9.2Z" />,
  insights: (
    <>
      <rect x="3.5" y="3.5" width="13" height="13" rx="2" />
      <path d="M6.8 7.4h6.4M6.8 10h6.4M6.8 12.6h3.6" />
    </>
  ),
  events: (
    <>
      <rect x="3.5" y="4.6" width="13" height="11.9" rx="2" />
      <path d="M3.5 8.4h13M7 3v3M13 3v3" />
    </>
  ),
  downloads: <path d="M10 3.8v8.4m0 0L6.8 9m3.2 3.2L13.2 9M4 13.6v1.6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1.6" />,
  enquiries: (
    <>
      <path d="M3.5 10.6 5.6 4.9a1 1 0 0 1 .94-.65h6.92a1 1 0 0 1 .94.65l2.1 5.7" />
      <path d="M3.5 10.6v4.6a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.6h-3.7a2.8 2.8 0 0 1-5.6 0H3.5Z" />
    </>
  ),
  content: (
    <>
      <rect x="3.5" y="3.5" width="13" height="13" rx="2" />
      <path d="M3.5 7.6h13M7.6 7.6v8.9" />
    </>
  ),
  flavours: <path d="M8 3.6h4M8.8 3.6v4.1L4.6 14.6a1.6 1.6 0 0 0 1.4 2.4h8a1.6 1.6 0 0 0 1.4-2.4l-4.2-6.9V3.6M6.4 12.2h7.2" />,
  media: (
    <>
      <rect x="3.5" y="4" width="13" height="12" rx="2" />
      <circle cx="7.8" cy="8.2" r="1.2" />
      <path d="m3.8 14.2 3.7-3.5 2.6 2.4 2.2-2 3.9 3.2" />
    </>
  ),
  team: (
    <>
      <circle cx="8" cy="7.2" r="2.7" />
      <path d="M2.9 16c.4-2.6 2.5-4 5.1-4s4.7 1.4 5.1 4" />
      <path d="M13 4.7a2.5 2.5 0 0 1 0 5M14.3 12.3c1.5.5 2.5 1.7 2.8 3.7" />
    </>
  ),
  activity: <path d="M2.8 10.4h3l2-5.6 3.4 10.2 2-4.6h3.9" />,
  search: (
    <>
      <circle cx="9" cy="9" r="5" />
      <path d="m16 16-3.4-3.4" />
    </>
  ),
  external: <path d="M8 4.5H5.2a1 1 0 0 0-1 1v9.3a1 1 0 0 0 1 1h9.3a1 1 0 0 0 1-1V12M11 4h5v5M16 4l-7 7" />,
  menu: <path d="M3.5 6h13M3.5 10h13M3.5 14h13" />,
  close: <path d="m5 5 10 10M15 5 5 15" />,
  chevron: <path d="m6 8 4 4 4-4" />,
};

function Icon({ name, className = "" }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {P[name]}
    </svg>
  );
}

/* ---------- navigation model ---------- */
const GROUPS = [
  {
    items: [
      { href: "/admin", label: "Home", icon: "home" },
      { href: "/admin/insights", label: "Insights", icon: "insights", section: "insights" },
      { href: "/admin/events", label: "Events", icon: "events", section: "events" },
      { href: "/admin/downloads", label: "Downloads", icon: "downloads", section: "downloads" },
      { href: "/admin/enquiries", label: "Enquiries", icon: "enquiries", section: "enquiries" },
    ],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/home", label: "Home page", icon: "home", section: "content" },
      { href: "/admin/content", label: "Site content", icon: "content", section: "content" },
      { href: "/admin/flavours", label: "Flavours page", icon: "flavours", section: "content" },
      { href: "/admin/media", label: "Media and links", icon: "media", section: "media" },
    ],
  },
  {
    title: "Admin",
    items: [
      { href: "/admin/team", label: "Team and access", icon: "team", ownerOnly: true },
      { href: "/admin/activity", label: "Activity", icon: "activity", ownerOnly: true },
    ],
  },
];

function isActive(pathname, href) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/");
}

function initials(user) {
  const s = (user.name || user.email || "A").trim();
  const parts = s.split(/[\s@._-]+/).filter(Boolean);
  return ((parts[0]?.[0] || "A") + (parts[1]?.[0] || "")).toUpperCase();
}

/* ---------- sidebar ---------- */
function Sidebar({ groups, pathname, user, logoutAction, onNavigate, onSearch, isMac }) {
  const [menu, setMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menu]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 shrink-0 items-center px-4">
        <Link href="/admin" onClick={onNavigate} className="flex h-9 items-center rounded-lg bg-white px-2.5 transition-opacity hover:opacity-90" aria-label="AM International admin home">
          <Image src="/images/logo/am-international-logo.svg" alt="AM International" width={1184} height={329} priority className="h-[26px] w-auto" />
        </Link>
      </div>

      <div className="px-3 pb-2 pt-1">
        <button
          type="button"
          onClick={onSearch}
          className="flex h-9 w-full items-center gap-2.5 rounded-lg bg-white/[0.08] px-3 text-left text-[13px] text-white/60 transition-colors hover:bg-white/[0.12] hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          <Icon name="search" className="shrink-0" />
          <span className="flex-1">Search</span>
          <kbd className="font-sans text-[12px] text-white/45">{isMac ? "⌘ K" : "Ctrl K"}</kbd>
        </button>
      </div>

      <nav aria-label="Admin" className="flex-1 overflow-y-auto px-3 pb-3 [scrollbar-width:thin]">
        {groups.map((g, gi) => (
          <div key={gi} className={gi === 0 ? "pt-1" : "pt-5"}>
            {g.title ? <p className="px-3 pb-1.5 text-[12px] font-medium tracking-wide text-white/45">{g.title}</p> : null}
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`group flex h-9 items-center gap-3 rounded-lg px-3 text-[14px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-white/60 ${
                        active ? "bg-white/[0.14] font-semibold text-white" : "font-medium text-white/75 hover:bg-white/[0.08] hover:text-white"
                      }`}
                    >
                      <Icon name={item.icon} className={`shrink-0 ${active ? "text-brand-orange" : "text-white/60 group-hover:text-white/90"}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div ref={menuRef} className="relative shrink-0 border-t border-white/10 p-3">
        {menu ? (
          <div role="menu" className="absolute bottom-[calc(100%-4px)] left-3 right-3 z-20 rounded-xl border border-black/10 bg-white p-1.5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)]">
            <div className="px-3 py-2">
              <p className="truncate text-[13px] font-semibold text-ink">{user.name || "Account"}</p>
              <p className="truncate text-[12px] text-ink/55">{user.email}</p>
            </div>
            <div className="my-1 h-px bg-black/5" />
            <form action={logoutAction}>
              <button type="submit" role="menuitem" className="flex h-9 w-full items-center rounded-lg px-3 text-left text-[13px] font-medium text-ink transition-colors hover:bg-black/5">
                Log out
              </button>
            </form>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setMenu((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menu}
          className="flex h-11 w-full items-center gap-3 rounded-lg px-2 text-left transition-colors hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-orange text-[11px] font-bold text-white">{initials(user)}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold leading-4 text-white">{user.name || user.email}</span>
            <span className="block truncate text-[11px] leading-4 text-white/50">{user.isOwner ? "Owner" : "Team member"}</span>
          </span>
          <Icon name="chevron" className={`shrink-0 text-white/50 transition-transform ${menu ? "rotate-180" : ""}`} />
        </button>
      </div>
    </div>
  );
}

/* ---------- command palette (Ctrl/Cmd K) ---------- */
function Palette({ open, onClose, flat }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? flat.filter((i) => i.label.toLowerCase().includes(t)) : flat;
  }, [q, flat]);

  useEffect(() => {
    if (open) {
      setQ("");
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  if (!open) return null;

  const go = (item) => {
    if (!item) return;
    onClose();
    router.push(item.href);
  };

  const onKey = (e) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") go(results[idx]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]" role="dialog" aria-modal="true" aria-label="Search admin">
      <button type="button" aria-label="Close search" onClick={onClose} className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-[2px]" />
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_64px_-16px_rgba(0,0,0,0.5)]" onKeyDown={onKey}>
        <div className="flex h-14 items-center gap-3 border-b border-black/5 px-4">
          <Icon name="search" className="shrink-0 text-ink/45" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIdx(0);
            }}
            placeholder="Go to a section"
            className="h-full flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink/40"
          />
          <kbd className="rounded-md border border-black/10 px-1.5 py-0.5 font-sans text-[11px] text-ink/50">Esc</kbd>
        </div>
        <ul className="max-h-[320px] overflow-y-auto p-2">
          {results.length === 0 ? <li className="px-3 py-6 text-center text-[13px] text-ink/55">Nothing found</li> : null}
          {results.map((item, i) => (
            <li key={item.href}>
              <button
                type="button"
                onMouseEnter={() => setIdx(i)}
                onClick={() => go(item)}
                className={`flex h-10 w-full items-center gap-3 rounded-lg px-3 text-left text-[14px] ${i === idx ? "bg-black/[0.05] text-ink" : "text-ink/80"}`}
              >
                <Icon name={item.icon} className="shrink-0 text-ink/55" />
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- shell ---------- */
export default function AdminShell({ user, sections = [], isOwner = true, logoutAction, children }) {
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [palette, setPalette] = useState(false);
  const [isMac, setIsMac] = useState(false);

  const groups = useMemo(
    () =>
      GROUPS.map((g) => ({
        ...g,
        items: g.items.filter((i) => (i.ownerOnly ? isOwner : i.section ? sections.includes(i.section) : true)),
      })).filter((g) => g.items.length),
    [sections, isOwner],
  );
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const current = flat.find((i) => isActive(pathname, i.href)) || flat[0];

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || ""));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const sidebarProps = { groups, pathname, user: { ...user, isOwner }, logoutAction, isMac };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[240px] md:block">
        <Sidebar {...sidebarProps} onSearch={() => setPalette(true)} />
      </aside>

      {/* mobile bar */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-[#1a1a1a] px-3 md:hidden">
        <button type="button" onClick={() => setDrawer(true)} aria-label="Open menu" className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10">
          <Icon name="menu" />
        </button>
        <Link href="/admin" className="flex h-8 items-center rounded-md bg-white px-2">
          <Image src="/images/logo/am-international-logo.svg" alt="AM International" width={1184} height={329} className="h-[22px] w-auto" />
        </Link>
        <button type="button" onClick={() => setPalette(true)} aria-label="Search" className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10">
          <Icon name="search" />
        </button>
      </div>

      {/* mobile drawer */}
      <div className={`fixed inset-0 z-40 md:hidden ${drawer ? "" : "pointer-events-none"}`} aria-hidden={!drawer}>
        <button type="button" tabIndex={drawer ? 0 : -1} aria-label="Close menu" onClick={() => setDrawer(false)} className={`absolute inset-0 cursor-default bg-black/50 transition-opacity duration-200 ${drawer ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute inset-y-0 left-0 w-[270px] max-w-[85vw] bg-[#1a1a1a] transition-transform duration-250 ease-out ${drawer ? "translate-x-0" : "-translate-x-full"}`}>
          <button type="button" onClick={() => setDrawer(false)} aria-label="Close menu" className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white">
            <Icon name="close" />
          </button>
          <Sidebar {...sidebarProps} onNavigate={() => setDrawer(false)} onSearch={() => { setDrawer(false); setPalette(true); }} />
        </div>
      </div>

      {/* canvas */}
      <div className="md:pl-[240px]">
        <div className="min-h-[calc(100vh-56px)] bg-[#f6f6f4] md:min-h-screen max-md:rounded-t-xl md:border-l md:border-black/[0.06]">
          <header className="sticky top-14 z-20 flex h-14 items-center max-md:rounded-t-xl justify-between gap-3 border-b border-black/[0.06] bg-[#f6f6f4]/90 px-4 backdrop-blur md:top-0 md:px-8">
            <div className="flex min-w-0 items-center gap-2.5 text-ink">
              {current ? <Icon name={current.icon} className="shrink-0 text-ink/60" /> : null}
              <p className="truncate text-[14px] font-semibold">{current?.label}</p>
            </div>
            <a
              href="/en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-black/10 bg-white px-3.5 text-[13px] font-medium text-ink transition-colors hover:bg-black/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-navy"
            >
              View website
              <Icon name="external" className="text-ink/55" />
            </a>
          </header>
          <main className="p-4 md:p-8">{children}</main>
        </div>
      </div>

      <Palette open={palette} onClose={() => setPalette(false)} flat={flat} />
    </div>
  );
}
