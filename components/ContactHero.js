import Reveal from "@/components/Reveal";

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function ContactHero({ dict }) {
  const c = dict.contactPage.hero;

  return (
    <section className="bg-[#fcfcfa] px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-[3.75rem] xl:px-0">
      <div className="mx-auto max-w-[75rem]">
        <Reveal as="p" className="mb-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#4b5563] rtl:tracking-normal md:text-[13px]">
          {c.eyebrow}
        </Reveal>
        <Reveal as="h1" delay={100} className="text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-brand-navy sm:text-[34px] md:text-[38px] xl:text-[40px] xl:leading-[48px]">
          {c.heading}
        </Reveal>
        <Reveal as="p" delay={220} className="mt-5 max-w-[52rem] text-[16px] font-semibold leading-[1.4] text-brand-orange md:mt-5 md:text-[17px] xl:text-[19px] xl:leading-[28px]">
          {c.sub}
        </Reveal>
        <Reveal as="p" delay={340} className="mt-3 max-w-[52rem] text-[14px] leading-[1.7] text-[#737878] xl:text-[16px] xl:leading-[26px]">
          {c.paragraph}
        </Reveal>
        <Reveal delay={460} className="mt-8 md:mt-10">
          <a
            href="#contact-form"
            className="group inline-flex h-12 items-center gap-2 rounded-lg bg-brand-orange px-9 text-[14px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {c.cta}
            <ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
