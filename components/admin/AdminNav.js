"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Dashboard", ready: true },
  { href: "/admin/insights", label: "Insights", ready: true, section: "insights" },
  { href: "/admin/events", label: "Events", ready: false, section: "events" },
  { href: "/admin/enquiries", label: "Enquiries", ready: true, section: "enquiries" },
  { href: "/admin/content", label: "Site content", ready: true, section: "content" },
  { href: "/admin/flavours", label: "Flavours page", ready: true, section: "content" },
  { href: "/admin/media", label: "Media and links", ready: true, section: "media" },
  { href: "/admin/team", label: "Team and access", ready: true, ownerOnly: true },
];

export default function AdminNav({ sections = [], isOwner = true }) {
  const pathname = usePathname();
  const items = ITEMS.filter((i) => (i.ownerOnly ? isOwner : i.section ? sections.includes(i.section) : true));

  return (
    <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible" aria-label="Admin">
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        const base = "flex items-center justify-between whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors";
        if (!item.ready) {
          return (
            <span key={item.href} className={`${base} cursor-not-allowed text-white/40`}>
              {item.label}
              <span className="ms-3 rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide">Soon</span>
            </span>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${base} ${active ? "bg-white/15 text-white" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
