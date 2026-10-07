import AboutReveal from "@/components/AboutReveal";

export default function AboutMeaning({ dict }) {
  const t = dict.about;

  return (
    <section id="meaning" className="scroll-mt-28 bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6">
        <AboutReveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-navy/70">{t.meaningEyebrow}</p>
        </AboutReveal>
        <AboutReveal delay={100}>
          <h2 className="mt-2 text-[26px] font-semibold leading-[1.2] text-brand-orange sm:text-[32px]">{t.meaningHeading}</h2>
        </AboutReveal>
        <AboutReveal delay={200}>
          <p className="mt-4 max-w-[760px] text-[15px] leading-[24px] text-ink/70">{t.meaningParagraph}</p>
        </AboutReveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <AboutReveal from="start" delay={150}>
            <div className="flex min-h-[72px] items-center bg-brand-orange px-5 py-4 text-[14px] font-medium text-white transition duration-300 hover:-translate-y-1">
              {t.meaningA}
            </div>
          </AboutReveal>
          <AboutReveal from="end" delay={250}>
            <div className="flex min-h-[72px] items-center bg-brand-orange px-5 py-4 text-[14px] font-medium text-white transition duration-300 hover:-translate-y-1">
              {t.meaningM}
            </div>
          </AboutReveal>
        </div>

        <AboutReveal delay={200}>
          <p className="mt-8 max-w-[760px] text-[15px] leading-[24px] text-ink/70">{t.meaningClosing}</p>
        </AboutReveal>
      </div>
    </section>
  );
}