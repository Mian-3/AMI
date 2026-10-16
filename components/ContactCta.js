import Reveal from "@/components/Reveal";

export default function ContactCta({ dict }) {
  const c = dict.contactPage.cta;

  return (
    <section className="[--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)] bg-[#201e1e] px-4 py-16 text-center text-white sm:px-6 md:pb-[6.25rem] md:pt-[7.4rem]">
      <div className="mx-auto max-w-[75rem] xl:max-w-[calc(1200*var(--u))]">
        <Reveal as="p" className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] rtl:tracking-normal xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]">
          {c.eyebrow}
        </Reveal>
        <Reveal as="h2" delay={100} className="text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] md:text-[32px] md:leading-[40px] xl:text-[max(28px,calc(40*var(--u)))] xl:leading-[calc(48*var(--u))]">
          {c.heading}
        </Reveal>
        <Reveal as="p" delay={220} className="mx-auto mt-4 max-w-[42rem] text-white/90 xl:mt-[calc(16*var(--u))] xl:max-w-[calc(820*var(--u))] text-[14px] leading-[22px] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">
          {c.text}
        </Reveal>
        <Reveal delay={340} className="mt-10 flex flex-wrap items-center justify-center gap-3 md:mt-12">
          <a href="#" className="flex items-center h-9 px-4 text-[12px] rounded-md xl:h-[max(40px,calc(48*var(--u)))] xl:px-[calc(36*var(--u))] xl:text-[max(12px,calc(14*var(--u)))] xl:rounded-[calc(8*var(--u))] bg-white font-medium text-[#201e1e] transition duration-200 hover:-translate-y-0.5 hover:bg-white/90 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            {c.sample}
          </a>
          <a href="#contact-form" className="group flex items-center gap-2 h-9 px-4 text-[12px] rounded-md xl:h-[max(40px,calc(48*var(--u)))] xl:px-[calc(36*var(--u))] xl:text-[max(12px,calc(14*var(--u)))] xl:rounded-[calc(8*var(--u))] border border-white font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
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
