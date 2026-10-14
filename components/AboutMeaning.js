import AboutReveal from "@/components/AboutReveal";

/*
  Design artboard 1920. At xl+ every size is calc(N * var(--u)) with a floor,
  so this section scales exactly like the Figma frame. Below xl the compact layout is kept.
*/
const P = "text-[1rem] leading-[1.7] text-ink/60 lg:text-[1.0625rem] xl:max-w-[calc(1170*var(--u))] xl:text-[max(16px,calc(24*var(--u)))] xl:leading-[calc(36*var(--u))]";
const BOX = "flex min-h-[5rem] items-center bg-[#f28b33] px-6 py-5 text-[1.0625rem] text-white transition duration-300 hover:-translate-y-1 hover:shadow-lg lg:px-9 xl:h-[max(76px,calc(103*var(--u)))] xl:px-[calc(36*var(--u))] xl:py-0 xl:text-[max(16px,calc(24*var(--u)))]";

export default function AboutMeaning({ dict }) {
  const t = dict.about;

  return (
    <section id="meaning" className="scroll-mt-28 bg-white py-14 [--u:1px] sm:py-20 lg:pb-[8.5rem] lg:pt-24 xl:pb-[calc(133*var(--u))] xl:pt-[calc(84*var(--u))] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6 xl:max-w-[calc(1200*var(--u))] xl:px-0">
        <AboutReveal>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-brand-navy/80 xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))] xl:tracking-[0.13em]">{t.meaningEyebrow}</p>
        </AboutReveal>
        <AboutReveal delay={100}>
          <h2 className="mt-2 text-[1.625rem] font-semibold leading-[1.2] text-[#f28b33] sm:text-[2rem] xl:mt-[calc(1*var(--u))] xl:text-[max(28px,calc(37*var(--u)))] xl:leading-[calc(44*var(--u))] xl:tracking-[-0.005em]">{t.meaningHeading}</h2>
        </AboutReveal>
        <AboutReveal delay={200}>
          <p className={`mt-4 max-w-[69rem] xl:mt-[calc(12*var(--u))] ${P}`}>{t.meaningParagraph}</p>
        </AboutReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:gap-6 xl:mt-[calc(36*var(--u))] xl:gap-[calc(26*var(--u))]">
          <AboutReveal from="start" delay={150}>
            <div className={BOX}>{t.meaningA}</div>
          </AboutReveal>
          <AboutReveal from="end" delay={250}>
            <div className={BOX}>{t.meaningM}</div>
          </AboutReveal>
        </div>

        <AboutReveal delay={200}>
          <p className={`mt-8 max-w-[69rem] lg:mt-12 xl:mt-[calc(29*var(--u))] ${P}`}>{t.meaningClosing}</p>
        </AboutReveal>
      </div>
    </section>
  );
}
