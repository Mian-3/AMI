import Image from "next/image";
import Reveal from "@/components/Reveal";
import CatalogueDownloadLink from "@/components/CatalogueDownloadLink";

function getArticles(dict) {
  return [
    { ...dict.insights.items.article1, src: "/images/insights/Rectangle 240649770 (1).png" },
    { ...dict.insights.items.article2, src: "/images/insights/Rectangle 240649819.png" },
    { ...dict.insights.items.article3, src: "/images/insights/Rectangle 240649822.png" },
    { ...dict.insights.items.article4, src: "/images/insights/in-1.png" },
  ];
}

export default function Insights({ dict }) {
  const articles = getArticles(dict);

  return (
    <section className="bg-offwhite px-4 py-16 sm:px-6 md:py-20 xl:px-0">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center text-center">
          <Reveal as="p" className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-brand-navy">{dict.insights.eyebrow}</Reveal>
          <Reveal as="h2" delay={100} className="max-w-[560px] text-[26px] font-semibold leading-[1.25] text-brand-navy md:text-[32px] md:leading-[40px]">{dict.insights.heading}</Reveal>
          <Reveal as="p" delay={200} className="mt-4 max-w-[560px] text-[14px] leading-[22px] text-ink/60">{dict.insights.paragraph}</Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article, index) => (
            <Reveal key={article.title} delay={300 + index * 110}>
              <a href="#" className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-navy/10 bg-white transition-colors duration-300 hover:border-brand-orange/30">
                <div className="relative h-[150px] w-full overflow-hidden">
                  <Image src={article.src} alt={article.title} fill sizes="(min-width: 1024px) 285px, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none" />
                  <span className="absolute start-3 top-3 rounded-full bg-brand-orange px-2.5 py-1 text-[10px] font-medium text-white">{article.tag}</span>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[11px] text-ink/50">{article.readTime} · {article.date}</p>
                  <h3 className="mt-2 text-[15px] font-semibold leading-snug text-brand-navy">{article.title}</h3>
                  <p className="mt-2 flex-1 text-[12.5px] leading-[19px] text-ink/60">{article.excerpt}</p>
                  <span className="mt-4 text-[12px] font-medium text-brand-orange transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">{dict.insights.readMore} →</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={750} className="mt-9 flex flex-wrap items-center justify-center gap-5">
          <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md border border-brand-navy/20 px-4 text-[12px] font-medium text-brand-navy transition duration-200 hover:-translate-y-0.5 hover:bg-brand-navy/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">{dict.insights.seeAll}</a>
          <CatalogueDownloadLink label={dict.buttons.downloadCatalogueArrow} className="flex items-center gap-1.5 text-[12px] font-medium text-brand-orange transition-colors hover:text-brand-orange/80" />
        </Reveal>
      </div>
    </section>
  );
}