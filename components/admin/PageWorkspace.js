"use client";

import Link from "next/link";
import SectionLayout from "@/components/admin/SectionLayout";
import { LAYOUT_PAGES } from "@/lib/sectionRegistry";

// Wraps an editor with its page context: a section list on the left (a scrolling row on phones).
export default function PageWorkspace({ page, sections, activeHref, layoutState = {}, canLayout = false, children }) {
  const layoutPage = canLayout ? LAYOUT_PAGES.find((l) => l.id === page.id) : null;
  return (
    <div className="lg:grid lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-8">
      <aside className="mb-6 lg:mb-0">
        <div className="lg:sticky lg:top-[88px]">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">Page</p>
              <p className="mt-0.5 text-[17px] font-bold leading-6 text-brand-navy">{page.label}</p>
            </div>
            {page.id !== "sitewide" ? (
              <a
                href={`/en${page.live}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0 inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:border-brand-orange hover:text-brand-orange lg:mt-3"
              >
                View live page
                <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 4.5H5.2a1 1 0 0 0-1 1v9.3a1 1 0 0 0 1 1h9.3a1 1 0 0 0 1-1V12M11 4h5v5M16 4l-7 7" />
                </svg>
              </a>
            ) : null}
          </div>

          <p className="mb-2 mt-5 hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45 lg:block">Sections</p>
          <nav aria-label={`${page.label} sections`} className="mt-4 lg:mt-0">
            <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:block lg:space-y-1 lg:overflow-visible lg:px-0 lg:pb-0">
              {sections.map((s) => {
                const active = activeHref === s.href;
                return (
                  <li key={s.href} className="shrink-0">
                    <Link
                      href={s.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-2.5 whitespace-nowrap rounded-lg border px-3 py-2 text-[13px] transition-colors lg:whitespace-normal ${
                        active
                          ? "border-brand-navy bg-brand-navy font-semibold text-white"
                          : "border-black/10 bg-white font-medium text-ink/75 hover:border-brand-orange/50 hover:text-brand-navy lg:border-transparent lg:bg-transparent lg:hover:bg-white"
                      }`}
                    >
                      <span aria-hidden="true" className={`hidden h-1.5 w-1.5 shrink-0 rounded-full lg:block ${active ? "bg-brand-orange" : "bg-ink/20"}`} />
                      {s.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          {layoutPage ? <SectionLayout key={page.id} page={layoutPage} initial={layoutState} compact defaultOpen /> : null}
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
