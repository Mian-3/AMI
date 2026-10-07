import Image from "next/image";
import AboutReveal from "@/components/AboutReveal";

export default function RelatedInsights({ posts, dict, locale }) {
  return (
    <section className="bg-[#fcfbf8] py-14 sm:py-[72px]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 xl:px-0">
        <AboutReveal>
          <h2 className="text-center text-[24px] font-semibold text-brand-navy sm:text-[28px]">{dict.insightArticle.related}</h2>
        </AboutReveal>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((p, i) => (
            <li key={p.id}>
              <AboutReveal delay={i * 110} className="h-full">
                <a
                  href={`/${locale}/insights/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-[150px] overflow-hidden">
                    <Image
                      src={p.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute start-3 top-3 rounded-full bg-brand-orange px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                      {dict.insightsPage.filters[p.category] ?? p.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[11px] text-ink/50">
                      {p.readTime} · {p.date}
                    </p>
                    <h3 className="mt-2 text-[16px] font-semibold leading-[22px] text-brand-navy">{p.title}</h3>
                    <p className="mt-2 line-clamp-3 text-[12px] leading-[18px] text-ink/60">{p.excerpt}</p>
                    <span className="mt-auto pt-3 text-[11px] font-medium text-brand-orange">
                      {dict.insightsPage.seeDetails} <span className="inline-block rtl:-scale-x-100">→</span>
                    </span>
                  </div>
                </a>
              </AboutReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}