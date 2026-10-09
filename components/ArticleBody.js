import Image from "next/image";
import AboutReveal from "@/components/AboutReveal";
import ShareButton from "@/components/ShareButton";

function TagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </svg>
  );
}

const SPACING = { h: "mt-14", p: "mt-5", list: "mt-8", quote: "mt-10", callout: "mt-10", image: "mt-10" };

function Block({ block, anchor, isLead }) {
  switch (block.type) {
    case "h":
      return (
        <h2 id={anchor} className="scroll-mt-32 text-[24px] font-semibold leading-[1.25] text-brand-navy sm:text-[28px]">
          <span aria-hidden="true" className="mb-3 block h-[3px] w-10 bg-brand-orange" />
          {block.text}
        </h2>
      );
    case "p":
      return isLead ? (
        <p className="text-[18px] leading-[31px] text-brand-navy/90">{block.text}</p>
      ) : (
        <p className="text-[16px] leading-[29px] text-ink/75">{block.text}</p>
      );
    case "quote":
      return (
        <blockquote className="border-s-4 border-brand-orange bg-[#f1ece3]/60 py-5 pe-5 ps-6 text-[20px] font-medium leading-[32px] text-brand-navy">
          {block.text}
          {(block.cite || block.author) && <footer className="mt-3 text-[12px] font-normal text-ink/60">{block.cite || block.author}</footer>}
        </blockquote>
      );
    case "callout":
      return (
        <div className="rounded-xl bg-brand-navy p-6 text-white sm:p-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-orange">{block.title}</p>
          <p className="mt-2 text-[15px] leading-[26px] text-white/90">{block.text}</p>
        </div>
      );
    case "image":
      return (
        <figure>
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
            <Image src={block.src} alt={block.alt || block.caption || ""} fill sizes="(min-width: 1024px) 760px, 100vw" className="object-cover" />
          </div>
          {block.caption && <figcaption className="mt-2 text-center text-[12px] text-ink/50">{block.caption}</figcaption>}
        </figure>
      );
    case "list": {
      const items = (block.items || []).map((it, i) =>
        typeof it === "string"
          ? { n: String(i + 1).padStart(2, "0"), title: "", text: it }
          : { n: it.n || String(i + 1).padStart(2, "0"), title: it.title || "", text: it.text || "" }
      );
      const cols = items.length === 2 ? "sm:grid-cols-2" : items.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3";
      return (
        <div>
          {block.intro ? <p className="text-[15px] font-semibold text-brand-navy">{block.intro}</p> : null}
          <ul className={`${block.intro ? "mt-4" : ""} grid gap-4 ${cols}`}>
            {items.map((item, i) => (
              <li key={i} className="h-full">
                <AboutReveal delay={i * 120} className="h-full">
                  <div className="group h-full rounded-xl border border-ink/10 bg-[#f1ece3]/60 p-5 transition duration-300 hover:-translate-y-1 hover:border-brand-orange/50 hover:bg-white hover:shadow-md">
                    <span className="text-[32px] font-semibold leading-none text-brand-orange">{item.n}</span>
                    {item.title ? <p className="mt-4 text-[15px] font-semibold text-brand-navy">{item.title}</p> : null}
                    {item.text ? <p className={`${item.title ? "mt-1.5" : "mt-4"} text-[13px] leading-[21px] text-ink/70`}>{item.text}</p> : null}
                  </div>
                </AboutReveal>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    default:
      return null;
  }
}

export default function ArticleBody({ blocks, tags, dict, title }) {
  const t = dict.insightArticle;
  const toc = blocks.map((b, i) => ({ b, i })).filter((x) => x.b.type === "h");
  const leadIndex = blocks.findIndex((b) => b.type === "p");

  return (
    <div className="bg-[#f1ece3] pb-16 sm:pb-24">
      <div className="relative z-10 mx-auto -mt-10 max-w-[1100px] px-4 sm:-mt-16 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_230px] lg:items-start">
          <article
            id="article"
            className="rounded-2xl bg-white p-6 shadow-[0_24px_60px_-30px_rgba(10,30,63,0.4)] sm:p-12"
          >
            {blocks.map((block, i) => (
              <AboutReveal key={i} className={i === 0 ? "" : SPACING[block.type] || "mt-5"}>
                <Block block={block} anchor={`section-${i}`} isLead={i === leadIndex} />
              </AboutReveal>
            ))}

            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6">
              <div className="flex flex-wrap items-center gap-2 text-ink/60">
                <TagIcon />
                {(tags || []).map((tag) => (
                  <span key={tag} className="rounded-full bg-[#f1ece3] px-3 py-1 text-[11px] text-ink/70">
                    {tag}
                  </span>
                ))}
              </div>
              <ShareButton label={t.share} copiedLabel={t.copied} title={title} />
            </div>
          </article>

          {toc.length > 0 && (
            <aside className="hidden lg:sticky lg:top-32 lg:block">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-brand-navy/70">{t.toc}</p>
              <ul className="mt-4 space-y-1 border-s-2 border-brand-navy/10">
                {toc.map(({ b, i }) => (
                  <li key={i}>
                    <a
                      href={`#section-${i}`}
                      className="-ms-[2px] block border-s-2 border-transparent py-1.5 ps-4 text-[13px] leading-[18px] text-ink/70 transition-colors hover:border-brand-orange hover:text-brand-orange"
                    >
                      {b.text}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}