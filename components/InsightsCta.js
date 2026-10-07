import AboutReveal from "@/components/AboutReveal";

export default function InsightsCta({ dict }) {
  const t = dict.insightArticle;

  return (
    <section className="bg-[#212121] py-14 text-center text-white sm:py-[72px]">
      <div className="mx-auto max-w-[760px] px-4 sm:px-6">
        <AboutReveal>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">{t.ctaEyebrow}</p>
        </AboutReveal>
        <AboutReveal delay={100}>
          <h2 className="mt-3 text-[28px] font-semibold leading-[1.2] sm:text-[36px]">{t.ctaHeading}</h2>
        </AboutReveal>
        <AboutReveal delay={200}>
          <p className="mt-4 text-[13px] text-white/90">{t.ctaText}</p>
        </AboutReveal>
        <AboutReveal delay={300}>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a href="#" className="inline-flex h-9 items-center rounded-md bg-white px-5 text-[12px] font-medium text-ink transition duration-200 hover:-translate-y-0.5 hover:opacity-90">
              {dict.buttons.requestSample}
            </a>
            <a href="#" className="inline-flex h-9 items-center rounded-md border border-white/60 px-5 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10">
              {t.talk}
            </a>
          </div>
        </AboutReveal>
      </div>
    </section>
  );
}