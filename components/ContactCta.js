import Reveal from "@/components/Reveal";

export default function ContactCta({ dict }) {
  const c = dict.contactPage.cta;

  return (
    <section className="bg-[#201e1e] px-4 py-16 text-center text-white sm:px-6 md:pb-[6.25rem] md:pt-[7.4rem]">
      <div className="mx-auto max-w-[75rem]">
        <Reveal as="p" className="mb-3 text-[clamp(0.75rem,0.73vw,0.875rem)] font-semibold uppercase tracking-[0.2em]">
          {c.eyebrow}
        </Reveal>
        <Reveal as="h2" delay={100} className="text-[clamp(2rem,2.92vw,3.5rem)] font-bold leading-[1.1] tracking-[-0.02em]">
          {c.heading}
        </Reveal>
        <Reveal as="p" delay={220} className="mx-auto mt-6 max-w-[42rem] text-[clamp(1rem,1.15vw,1.375rem)] leading-[1.5] text-white/90">
          {c.text}
        </Reveal>
        <Reveal delay={340} className="mt-10 flex flex-wrap items-center justify-center gap-3 md:mt-12">
          <a href="#" className="flex h-12 items-center rounded-lg bg-white px-8 text-[0.875rem] font-medium text-[#201e1e] transition duration-200 hover:-translate-y-0.5 hover:bg-white/90 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            {c.sample}
          </a>
          <a href="#contact-form" className="group flex h-12 items-center gap-2 rounded-lg border border-white px-8 text-[0.875rem] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            {c.talk}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
