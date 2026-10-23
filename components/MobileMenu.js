"use client";

import Roll from "@/components/Roll";
import { useState } from "react";
import { useParams } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CatalogueDownloadLink from "@/components/CatalogueDownloadLink";
import { useMedia } from "@/components/MediaProvider";
import { resolveHref } from "@/lib/mediaShared";

export default function MobileMenu({ items, dict }) {
  const [open, setOpen] = useState(false);
  const { locale } = useParams();
  const media = useMedia();

  return (
    <>
      <button type="button" aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)} className={"flex h-10 w-10 items-center justify-center rounded-md text-brand-navy transition-colors hover:bg-brand-navy/5 active:scale-90 xl:hidden " + (open ? "mm-open" : "")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path className="mm-l mm-t" d="M4 6h16" /><path className="mm-l mm-m" d="M4 12h16" /><path className="mm-l mm-b" d="M4 18h16" />
        </svg>
      </button>

      <div id="mobile-menu" inert={!open} className={(open ? "mm-open " : "") + "absolute left-0 top-full z-50 grid w-full bg-white transition-[grid-template-rows] duration-300 motion-reduce:transition-none xl:hidden " + (open ? "grid-rows-[1fr] shadow-lg" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <nav aria-label="Mobile navigation" className="px-4 pb-5 pt-2 sm:px-6">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.label} className="mm-row border-b border-brand-navy/10" style={{ "--i": items.indexOf(item) }}>
                  <a href={item.href} onClick={() => setOpen(false)} className={"block py-3 text-[14px] " + (item.active ? "text-brand-orange" : "text-ink")}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="mm-row mt-4 flex items-center justify-between border-t border-brand-navy/10 pt-4" style={{ "--i": items.length }}>
              <span className="text-[12px] text-ink/60">Language</span>
              <LanguageSwitcher />
            </div>
            <div className="mm-row mt-4 flex flex-col gap-3 sm:flex-row" style={{ "--i": items.length + 1 }}>
              <a href={resolveHref(media.links.requestSample, locale)} onClick={() => setOpen(false)} className="rounded-md bg-brand-orange px-4 py-2.5 text-center text-[12px] font-medium text-white"><Roll>{dict.buttons.requestSample}</Roll></a>
              <CatalogueDownloadLink
                label={dict.buttons.downloadCatalogueArrow}
                icon="none"
                className="flex h-9 items-center whitespace-nowrap rounded-md border border-white/30 bg-white/15 px-4 text-[12px] font-medium text-white backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:bg-white/25 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              />
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
