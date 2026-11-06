import AboutReveal from "@/components/AboutReveal";

// Insights page banner. Full width with no gaps on every screen. On computers the banner has a fixed,
// height of 80% of the screen: the bottom of the picture is always kept and only a little of the top is trimmed.
// On phones the whole picture is shown. Text sits over the picture on computers and under it on phones.
// The picture is a website file (public/images/insights/insights-banner.webp). Text comes from the admin.
const INSIGHTS_BANNER = "/images/insights/insights-banner.webp";

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
    <section className="bg-white [--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="relative overflow-hidden bg-ink md:h-[80vh] md:min-h-[420px]">
        {/* Full width, no gaps. The bottom of the picture is kept and a little of the top is trimmed on computers. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={INSIGHTS_BANNER} alt="" className="relative block h-auto w-full md:absolute md:inset-0 md:h-full md:object-cover md:object-bottom" fetchPriority="high" />
        <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-black/70 via-black/25 to-black/0 md:block" />
        <div className="absolute inset-x-0 bottom-0 hidden md:block">
          <div className="mx-auto w-full max-w-[1200px] px-6 pb-12 xl:max-w-[calc(1600*var(--u))] xl:px-0 xl:pb-[calc(70*var(--u))]">{copy}</div>
        </div>
      </div>
      <div className="bg-brand-navy px-4 py-10 sm:px-6 md:hidden"><div className="mx-auto max-w-[1200px]">{copy}</div></div>
    </section>
  );
}
