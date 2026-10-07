import AboutReveal from "@/components/AboutReveal";

const P = "text-[1rem] leading-[1.7] text-ink/60 lg:text-[1.0625rem] 2xl:text-[1.25rem] 2xl:leading-[2.25rem]";

export default function AboutMeaning({ dict }) {
  const t = dict.about;

  return (
    <section id="meaning" className="scroll-mt-28 bg-white py-14 sm:py-20 lg:pb-[8.5rem] lg:pt-24">
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6 xl:px-0">
        <AboutReveal>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-brand-navy/80 2xl:text-[0.875rem]">{t.meaningEyebrow}</p>
        </AboutReveal>
        <AboutReveal delay={100}>
          <h2 className="mt-2 text-[1.625rem] font-semibold leading-[1.2] text-[#f28b33] sm:text-[2rem] 2xl:text-[2.25rem]">{t.meaningHeading}</h2>
        </AboutReveal>
        <AboutReveal delay={200}>
          <p className={`mt-4 max-w-[69rem] ${P}`}>{t.meaningParagraph}</p>
        </AboutReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:gap-6">
          <AboutReveal from="start" delay={150}>
            <div className="flex min-h-[5rem] items-center bg-[#f28b33] px-6 py-5 text-[1.0625rem] text-white transition duration-300 hover:-translate-y-1 hover:shadow-lg lg:px-9 2xl:min-h-[6.4rem] 2xl:text-[1.4rem]">
              {t.meaningA}
            </div>
          </AboutReveal>
          <AboutReveal from="end" delay={250}>
            <div className="flex min-h-[5rem] items-center bg-[#f28b33] px-6 py-5 text-[1.0625rem] text-white transition duration-300 hover:-translate-y-1 hover:shadow-lg lg:px-9 2xl:min-h-[6.4rem] 2xl:text-[1.4rem]">
              {t.meaningM}
            </div>
          </AboutReveal>
        </div>

        <AboutReveal delay={200}>
          <p className={`mt-8 max-w-[69rem] lg:mt-12 ${P}`}>{t.meaningClosing}</p>
        </AboutReveal>
      </div>
    </section>
  );
}
