import Link from "next/link";
import { getSession } from "@/lib/auth";
import { allowedPages } from "@/lib/adminPages";
import { getOverrides } from "@/lib/siteContent";

export default async function PagesHub() {
  const session = await getSession();
  const pages = allowedPages(session?.sections || [], Boolean(session?.isOwner));
  const overrides = await getOverrides();
  const edited = (href) => {
    const m = href.match(/^\/admin\/content\/(.+)$/);
    return m ? Boolean(overrides[m[1]]) : false;
  };

  const website = pages.filter((p) => p.id !== "sitewide");
  const wide = pages.filter((p) => p.id === "sitewide");

  const Card = ({ page }) => (
    <li className="flex flex-col rounded-xl border border-black/5 bg-white p-5 shadow-sm transition hover:border-brand-orange/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[17px] font-bold text-brand-navy">{page.label}</h3>
        <span className="shrink-0 rounded-full bg-black/[0.05] px-2.5 py-1 text-[11px] font-medium text-ink/60">
          {page.sections.length} {page.sections.length === 1 ? "section" : "sections"}
        </span>
      </div>
      <p className="mt-1.5 text-[13px] leading-5 text-ink/60">{page.blurb}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {page.sections.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-2.5 py-1 text-[12px] text-ink/75 transition-colors hover:border-brand-orange hover:text-brand-orange"
            >
              {edited(s.href) ? <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> : null}
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-2 pt-1">
        <Link href={page.sections[0].href} className="rounded-lg bg-brand-navy px-3.5 py-2 text-[13px] font-medium text-white transition hover:opacity-90">
          Edit page
        </Link>
        {page.id !== "sitewide" ? (
          <a href={`/en${page.live}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-black/10 px-3.5 py-2 text-[13px] font-medium text-ink transition hover:bg-black/[0.03]">
            View live
          </a>
        ) : null}
      </div>
    </li>
  );

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-brand-navy">Pages</h1>
      <p className="mt-1 text-sm text-ink/60">
        Pick a page, then a section to edit. Text is in English and Arabic. Changes appear on the website within seconds. A green dot means the section has been edited.
      </p>

      <h2 className="mb-3 mt-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">Website pages</h2>
      <ul className="grid gap-4 md:grid-cols-2">
        {website.map((p) => (
          <Card key={p.id} page={p} />
        ))}
      </ul>

      {wide.length ? (
        <>
          <h2 className="mb-3 mt-10 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45">On every page</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            {wide.map((p) => (
              <Card key={p.id} page={p} />
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
