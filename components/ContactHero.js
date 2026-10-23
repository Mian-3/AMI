import Roll from "@/components/Roll";
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
    <section className="[--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)] bg-[#fcfcfa] px-4 pb-16 pt-12 sm:px-6 md:pb-24 md:pt-[3.75rem] xl:px-0">
      <div className="mx-auto max-w-[75rem] xl:max-w-[calc(1200*var(--u))]">
        <Reveal as="p" className="mb-3 text-brand-navy text-[11px] font-semibold uppercase tracking-[0.13em] rtl:tracking-normal xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]">
          {c.eyebrow}
        </Reveal>
        <Reveal as="h1" delay={100} className="text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-brand-navy sm:text-[34px] md:text-[38px] xl:text-[40px] xl:leading-[48px]">
          {c.heading}
        </Reveal>
        <Reveal as="p" delay={220} className="mt-5 max-w-[52rem] text-brand-orange xl:mt-[calc(18*var(--u))] text-[15px] font-semibold leading-[1.4] md:text-[16px] xl:text-[max(16px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">
          {c.sub}
        </Reveal>
        <Reveal as="p" delay={340} className="mt-3 max-w-[52rem] text-ink/60 xl:mt-[calc(10*var(--u))] xl:max-w-[calc(900*var(--u))] text-[14px] leading-[22px] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">
          {c.paragraph}
        </Reveal>
        <Reveal delay={460} className="mt-8 md:mt-10 xl:mt-[calc(40*var(--u))]">
          <a
            href="#contact-form"
            className="group inline-flex items-center gap-2 h-9 px-4 text-[12px] rounded-md xl:h-[max(40px,calc(48*var(--u)))] xl:px-[calc(36*var(--u))] xl:text-[max(12px,calc(14*var(--u)))] xl:rounded-[calc(8*var(--u))] bg-brand-orange font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            <Roll>{c.cta}</Roll>
            <ArrowIcon />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
