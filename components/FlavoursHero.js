import Reveal from "@/components/Reveal";

// Layout note: the design is a 1920px artboard with a 1200px content column (62.5% of the width).
// Below 1920 the column and the type scale with the viewport (vw) so proportions match the design,
// with floors so nothing becomes too small on laptops and phones.
export default function FlavoursHero({ dict }) {
  const t = dict.flavoursPage;

  return (
    <section className="bg-[#fcfcfa]">
      <div className="mx-auto w-full max-w-[75rem] px-4 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-12 lg:w-[max(62.5vw,56rem)] lg:px-0 lg:pb-[clamp(3.5rem,4.7vw,5.5rem)] lg:pt-[clamp(2.5rem,3.3vw,4rem)]">
        <Reveal as="p" className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-brand-navy/80 lg:text-[clamp(0.75rem,0.78vw,0.875rem)]">
          {t.heroEyebrow}
        </Reveal>
        <Reveal as="div" delay={100}>
          <h1 className="mt-3 text-[1.875rem] font-semibold leading-[1.2] text-brand-navy sm:text-[2.125rem] lg:text-[clamp(2rem,2.3vw,2.75rem)]">
            {t.heroHeading}
          </h1>
        </Reveal>
        <Reveal as="p" delay={200} className="mt-5 max-w-[56rem] text-[1rem] leading-[1.65] text-ink/60 lg:mt-[clamp(1.25rem,1.3vw,1.5rem)] lg:max-w-[min(100%,58vw)] lg:text-[clamp(1rem,1.25vw,1.5rem)] lg:leading-[1.45]">
          {t.heroP1}
        </Reveal>
        <Reveal as="p" delay={300} className="mt-4 max-w-[56rem] text-[1rem] leading-[1.65] text-ink/60 lg:mt-[clamp(1rem,1.1vw,1.25rem)] lg:max-w-[min(100%,58vw)] lg:text-[clamp(1rem,1.25vw,1.5rem)] lg:leading-[1.45]">
          {t.heroP2}
        </Reveal>
      </div>
    </section>
  );
}
