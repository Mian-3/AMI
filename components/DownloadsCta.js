import Reveal from "@/components/Reveal";

/* Dark call-to-action band. Same text scale as the Home page. "Request for Sample" opens the enquiry popup. */
const BTN = "h-9 px-4 text-[12px] rounded-md xl:h-[max(40px,calc(48*var(--u)))] xl:px-[calc(36*var(--u))] xl:text-[max(12px,calc(14*var(--u)))] xl:rounded-[calc(8*var(--u))]";

export default function DownloadsCta({ dict, locale }) {
  const c = dict.downloadsPage;

  return (
    <section className="bg-[#201e1e] px-4 py-16 text-center text-white [--u:1px] sm:px-6 md:pb-[6.25rem] md:pt-[7rem] xl:px-0 xl:pb-[calc(100*var(--u))] xl:pt-[calc(104*var(--u))] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="mx-auto max-w-[75rem] xl:max-w-[calc(1200*var(--u))]">
        <Reveal as="p" className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] rtl:tracking-normal xl:mb-[calc(8*var(--u))] xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]">{c.ctaEyebrow}</Reveal>
        <Reveal as="h2" delay={100} className="text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] md:text-[32px] md:leading-[40px] xl:text-[max(28px,calc(40*var(--u)))] xl:leading-[calc(48*var(--u))]">{c.ctaHeading}</Reveal>
        <Reveal as="p" delay={220} className="mx-auto mt-4 max-w-[42rem] text-[14px] leading-[22px] text-white/90 xl:mt-[calc(16*var(--u))] xl:max-w-[calc(820*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">{c.ctaText}</Reveal>
        <Reveal delay={340} className="mt-8 flex flex-wrap items-center justify-center gap-3 xl:mt-[calc(40*var(--u))] xl:gap-[calc(16*var(--u))]">
          <a data-enquiry href={`/${locale}/contact`} className={`flex items-center bg-white font-medium text-[#201e1e] transition duration-200 hover:-translate-y-0.5 hover:bg-white/90 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${BTN}`}>
            {c.ctaSample}
          </a>
          <a href={`/${locale}/contact`} className={`group flex items-center gap-2 border border-white font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${BTN}`}>
            {c.ctaTalk}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
