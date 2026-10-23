import Roll from "@/components/Roll";
import AboutReveal from "@/components/AboutReveal";

export default function InsightsCta({ dict }) {
  const t = dict.insightArticle;

  return (
    <section className="bg-[#212121] py-16 text-center text-white sm:py-20 xl:py-[96px]">
      <div className="mx-auto max-w-[860px] px-4 sm:px-6">
        <AboutReveal>
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-brand-orange rtl:tracking-normal xl:text-[14px]">{t.ctaEyebrow}</p>
        </AboutReveal>
        <AboutReveal delay={100}>
          <h2 className="mt-4 text-[30px] font-bold leading-[1.2] sm:text-[36px] xl:text-[40px] xl:leading-[48px]">{t.ctaHeading}</h2>
        </AboutReveal>
        <AboutReveal delay={200}>
          <p className="mx-auto mt-5 max-w-[640px] text-[16px] leading-[1.7] text-white/85 xl:text-[20px] xl:leading-[30px]">{t.ctaText}</p>
        </AboutReveal>
        <AboutReveal delay={300}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 xl:mt-10 xl:gap-4">
            <a href="#" className="inline-flex h-11 items-center rounded-md bg-white px-6 text-[14px] font-semibold text-ink transition duration-200 hover:-translate-y-0.5 hover:opacity-90 xl:h-14 xl:px-9 xl:text-[16px]">
              <Roll>{dict.buttons.requestSample}</Roll>
            </a>
            <a href="#" className="inline-flex h-11 items-center rounded-md border border-white/60 px-6 text-[14px] font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 xl:h-14 xl:px-9 xl:text-[16px]">
              <Roll>{t.talk}</Roll>
            </a>
          </div>
        </AboutReveal>
      </div>
    </section>
  );
}
