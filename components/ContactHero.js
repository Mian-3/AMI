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
        <Reveal as="p" className="mb-3 text-[clamp(0.75rem,0.73vw,0.875rem)] font-medium uppercase tracking-[0.2em] text-[#4b5563]">
          {c.eyebrow}
        </Reveal>
        <Reveal as="h1" delay={100} className="text-[clamp(2.25rem,3.33vw,4rem)] font-bold leading-[1.1] tracking-[-0.01em] text-brand-navy">
          {c.heading}
        </Reveal>
        <Reveal as="p" delay={220} className="mt-6 max-w-[52rem] text-[clamp(1.25rem,1.67vw,2rem)] font-semibold leading-[1.3] text-brand-orange md:mt-8">
          {c.sub}
        </Reveal>
        <Reveal as="p" delay={340} className="mt-4 max-w-[59rem] text-[clamp(1rem,1.25vw,1.5rem)] leading-[1.55] text-[#737878]">
          {c.paragraph}
        </Reveal>
        <Reveal delay={460} className="mt-8 md:mt-10">
          <a
            href="#contact-form"
            className="group inline-flex h-12 items-center gap-2 rounded-lg bg-brand-orange px-9 text-[0.875rem] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            {c.cta}
            <ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
