import Roll from "@/components/Roll";
import { getItemLayout } from "@/lib/itemLayoutServer";
import { arrange, partShown } from "@/lib/itemLayout";
import InsightImage from "@/components/InsightImage";
import Mx from "@/components/Mx";
import MxText from "@/components/MxText";
import CatalogueDownloadLink from "@/components/CatalogueDownloadLink";

// `posts` comes from the database (see lib/insightsDb.js): the latest published articles.
export default async function Insights({ dict, locale, posts = [] }) {
  const IL = await getItemLayout();
  const filters = dict.insightsPage?.filters || {};
  const articles = arrange(IL, "home.insights", posts.slice(0, 4)).map((x) => x.item);

  return (
    <Mx as="section" className="bg-offwhite px-4 py-16 sm:px-6 md:py-20 xl:px-0">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center text-center">
          <p className="mx-eyebrow mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-brand-navy">{dict.insights.eyebrow}</p>
          <MxText as="h2" delay={150} className="max-w-[560px] text-[26px] font-semibold leading-[1.25] text-brand-navy md:text-[32px] md:leading-[40px]">{dict.insights.heading}</MxText>
          <p style={{ "--d": "450ms" }} className="mx-fade mt-4 max-w-[560px] text-[14px] leading-[22px] text-ink/60">{dict.insights.paragraph}</p>
        </div>

        {articles.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article, index) => (
              <div key={article.slug} className="mx-curtain h-full" style={{ "--d": `${450 + index * 120}ms`, "--mx-r": "16px" }}>
                <a href={`/${locale}/insights/${article.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-navy/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-brand-orange/30 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <InsightImage src={article.image} alt={article.title} sizes="(min-width: 1024px) 285px, (min-width: 640px) 50vw, 100vw">
                    <span className="absolute start-3 top-3 rounded-full bg-brand-orange px-2.5 py-1 text-[10px] font-medium text-white">{filters[article.category] || ""}</span>
                  </InsightImage>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[11px] text-ink/50">{article.readTime} · {article.date}</p>
                    <h3 className="mt-2 line-clamp-3 text-[15px] font-semibold leading-snug text-brand-navy">{article.title}</h3>
                    <p className="mt-2 line-clamp-3 text-[12.5px] leading-[19px] text-ink/60">{article.excerpt}</p>
                    <span className="mt-auto inline-flex pt-4 text-[12px] font-medium text-brand-orange transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">{dict.insights.readMore} →</span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        ) : null}

        <div style={{ "--d": "950ms" }} className="mx-fade mt-9 flex flex-wrap items-center justify-center gap-5">
          <a href={`/${locale}/insights`} className="flex h-9 items-center whitespace-nowrap rounded-md border border-brand-navy/20 px-4 text-[12px] font-medium text-brand-navy transition duration-200 hover:-translate-y-0.5 hover:bg-brand-navy/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"><Roll>{dict.insights.seeAll}</Roll></a>
          <CatalogueDownloadLink
            label={dict.buttons.downloadCatalogueArrow}
            icon="none"
            className="flex items-center gap-1.5 text-[12px] font-medium text-brand-orange transition-colors hover:text-brand-orange/80"
          />
        </div>
      </div>
    </Mx>
  );
}
