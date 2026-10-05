"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

const PAGE_SIZE = 8;
const CATEGORIES = ["all", "fragrances", "flavours", "rd", "process"];

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M8.5 11h5" />
    </svg>
  );
}

function SwirlMark({ className }) {
  return (
    <svg viewBox="0 0 600 600" fill="none" aria-hidden="true" className={className}>
      <g transform="rotate(-24 300 300)" strokeLinecap="round">
        <path d="M40 300 A260 130 0 0 1 560 300" stroke="white" strokeOpacity="0.3" strokeWidth="14" />
        <path d="M80 330 A220 108 0 0 1 520 330" stroke="white" strokeOpacity="0.22" strokeWidth="10" />
        <path d="M120 360 A180 86 0 0 1 480 360" stroke="white" strokeOpacity="0.15" strokeWidth="7" />
      </g>
      <circle cx="470" cy="150" r="22" fill="white" fillOpacity="0.25" />
    </svg>
  );
}

export default function BlogExplorer({ dict, posts }) {
  const t = dict.insightsPage;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (category !== "all" && post.category !== category) return false;
      if (!q) return true;
      const haystack = `${post.title} ${post.excerpt} ${t.filters[post.category] || ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query, category, t]);

  const shown = filtered.slice(0, visible);
  const hasMore = filtered.length > visible;

  const handleQuery = (e) => {
    setQuery(e.target.value);
    setVisible(PAGE_SIZE);
  };

  const handleCategory = (key) => {
    setCategory(key);
    setVisible(PAGE_SIZE);
  };

  return (
    <>
      {/* Orange search band */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#f7aa63] to-[#f39b4b] px-4 py-12 sm:px-6 md:py-14 xl:px-0">
        <SwirlMark className="pointer-events-none absolute -start-24 top-1/2 -z-10 h-[340px] w-[340px] -translate-y-1/2 opacity-70 rtl:-scale-x-100 md:-start-16 md:h-[520px] md:w-[520px] md:opacity-100" />
        <SwirlMark className="pointer-events-none absolute -bottom-24 -end-16 -z-10 hidden h-[300px] w-[300px] rotate-180 rtl:-scale-x-100 md:block" />

        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center text-center">
          <Reveal as="h2" className="max-w-[700px] text-[24px] font-semibold leading-[1.25] text-white md:text-[32px] md:leading-[40px]">{t.bandHeading}</Reveal>
          <Reveal as="p" delay={100} className="mt-3 max-w-[640px] text-[13px] leading-[20px] text-white md:text-[14px] md:leading-[22px]">{t.bandParagraph}</Reveal>

          <Reveal delay={200} className="mt-6 w-full max-w-[480px]">
            <form role="search" onSubmit={(e) => e.preventDefault()} className="relative flex h-11 items-center rounded-md bg-white shadow-sm transition-shadow duration-200 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.45)]">
              <input
                type="search"
                value={query}
                onChange={handleQuery}
                placeholder={t.searchPlaceholder}
                aria-label={t.searchPlaceholder}
                className="h-full w-full rounded-md bg-transparent ps-4 pe-11 text-start text-[13px] text-ink outline-none placeholder:text-ink/50"
              />
              <span className="pointer-events-none absolute end-4 text-brand-navy/70"><SearchIcon /></span>
            </form>
          </Reveal>
        </div>
      </section>

      {/* Filters + grid */}
      <section id="blog-list" className="scroll-mt-20 bg-offwhite px-4 py-12 sm:px-6 md:py-16 xl:px-0">
        <div className="mx-auto max-w-[1200px]">
          <div role="group" aria-label={t.filtersLabel} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map((key) => {
              const active = category === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => handleCategory(key)}
                  className={
                    active
                      ? "h-9 shrink-0 whitespace-nowrap rounded-md bg-brand-orange px-5 text-[12px] font-medium text-white shadow-sm transition duration-200"
                      : "h-9 shrink-0 whitespace-nowrap rounded-md border border-brand-navy/15 bg-white px-5 text-[12px] font-medium text-ink/70 transition duration-200 hover:border-brand-orange/40 hover:text-brand-orange"
                  }
                >
                  {t.filters[key]}
                </button>
              );
            })}
          </div>

          {shown.length > 0 ? (
            <div key={category} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {shown.map((post, index) => (
                <Reveal key={post.id} delay={(index % 4) * 90} className="h-full">
                  <a
                    href="#"
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-navy/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-orange/30 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <div className="relative h-[170px] w-full overflow-hidden">
                      <Image src={post.image} alt={post.title} fill sizes="(min-width: 1024px) 285px, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none" />
                      <span className="absolute start-3 top-3 rounded-full bg-brand-orange px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white rtl:tracking-normal">{t.filters[post.category]}</span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[11px] text-ink/50">{post.readTime} · {post.date}</p>
                      <h3 className="mt-2 text-[15px] font-semibold leading-snug text-brand-navy">{post.title}</h3>
                      <p className="mt-2 flex-1 text-[12.5px] leading-[19px] text-ink/60">{post.excerpt}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-brand-orange transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                        {t.seeDetails}
                        <span className="inline-block rtl:-scale-x-100" aria-hidden="true">→</span>
                      </span>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          ) : (
            <div role="status" className="mt-14 flex flex-col items-center text-center text-brand-navy/60">
              <EmptyIcon />
              <p className="mt-4 text-[16px] font-semibold text-brand-navy">{t.noResults}</p>
              <p className="mt-1 max-w-[320px] text-[13px] text-ink/60">{t.noResultsHint}</p>
            </div>
          )}

          {hasMore && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + 4)}
                className="h-10 rounded-md border border-brand-navy/20 bg-white px-8 text-[12px] font-medium text-brand-navy shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-brand-navy/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {t.loadMore}
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}