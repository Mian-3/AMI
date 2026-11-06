import AboutReveal from "@/components/AboutReveal";

// Insights page banner: text only on a navy background (no picture). The text comes from the admin.

export default function InsightsHero({ dict }) {
  const t = dict.insightsPage;
  const copy = (
    <div className="max-w-[640px] text-white xl:max-w-[calc(780*var(--u))]">
      {t.heroEyebrow ? (
        <AboutReveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] rtl:tracking-normal xl:mb-[calc(16*var(--u))] xl:text-[max(12px,calc(15*var(--u)))]">{t.heroEyebrow}</p></AboutReveal>
      ) : null}
      {t.heroHeading ? (
        <AboutReveal delay={100}><h1 className="text-[30px] font-semibold leading-[1.15] md:text-[38px] md:leading-[44px] xl:text-[max(38px,calc(52*var(--u)))] xl:leading-[calc(60*var(--u))]">{t.heroHeading}</h1></AboutReveal>
      ) : null}
      {t.heroParagraph ? (
        <AboutReveal delay={200}><p className="mt-3 text-[14px] font-medium leading-[1.6] md:text-[16px] xl:mt-[calc(20*var(--u))] xl:text-[max(15px,calc(19*var(--u)))] xl:leading-[calc(30*var(--u))]">{t.heroParagraph}</p></AboutReveal>
      ) : null}
    </div>
  );

  return (
    <section className="bg-brand-navy [--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 md:py-24 xl:max-w-[calc(1600*var(--u))] xl:px-0 xl:py-[calc(120*var(--u))]">{copy}</div>
    </section>
  );
}
