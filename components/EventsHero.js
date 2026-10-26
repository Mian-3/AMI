import AboutReveal from "@/components/AboutReveal";
import { eventHref } from "@/lib/eventsData";

function Pin() {
  return (
    <svg viewBox="0 0 28 34" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[20px] w-[17px] shrink-0 text-brand-orange xl:h-[max(20px,calc(34*var(--u)))] xl:w-[max(17px,calc(28*var(--u)))]">
      <path d="M14 32S3 21.5 3 13.5a11 11 0 0 1 22 0C25 21.5 14 32 14 32Z" />
      <circle cx="14" cy="13.5" r="4.2" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[40%] w-[40%] rtl:-scale-x-100 transition-transform duration-300 ease-out group-hover:rotate-45 rtl:group-hover:-rotate-45 motion-reduce:transition-none">
      <path d="M12 36 36 12M15 12h21v21" />
    </svg>
  );
}

export default function EventsHero({ event, locale, dict }) {
  const href = eventHref(locale, event);
  const linked = href && href !== "#";
  const Tag = linked ? "a" : "div";
  const linkProps = linked ? { href, "aria-label": event.title } : {};
  return (
    <section className="[--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <Tag
        {...linkProps}
        className="group relative block overflow-hidden bg-ink"
      >
        {/* The whole picture is shown, never cropped: it keeps its own proportions at full width. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.heroImage} alt="" className="block h-auto w-full" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/0 to-black/0 rtl:bg-gradient-to-l" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto flex w-full items-end justify-between gap-4 px-4 pb-8 sm:px-6 xl:max-w-[calc(1600*var(--u))] xl:px-0 xl:pb-[calc(91*var(--u))]">
            <div className="min-w-0 text-white">
              <AboutReveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md xl:gap-[calc(10*var(--u))] xl:px-[calc(22*var(--u))] xl:py-[calc(9*var(--u))] xl:text-[max(12px,calc(14*var(--u)))]">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-orange xl:h-[max(6px,calc(8*var(--u)))] xl:w-[max(6px,calc(8*var(--u)))]" />
                  {event.dateLong}
                </span>
              </AboutReveal>
              <AboutReveal delay={100}>
                <h1 className="mt-3 text-[26px] font-semibold leading-[1.15] tracking-[-0.01em] sm:text-[34px] xl:mt-[calc(20*var(--u))] xl:text-[max(34px,calc(46*var(--u)))] xl:leading-[max(40px,calc(56*var(--u)))]">
                  {event.title}
                </h1>
              </AboutReveal>
              <AboutReveal delay={200}>
                <p className="mt-2 flex items-center gap-2 text-[16px] leading-[1.7] text-white/85 xl:mt-[calc(10*var(--u))] xl:gap-[calc(12*var(--u))] xl:text-[max(16px,calc(20*var(--u)))] xl:leading-[max(24px,calc(30*var(--u)))]">
                  <Pin />
                  {event.location}
                </p>
              </AboutReveal>
            </div>

            <div className="shrink-0 xl:me-[calc(10*var(--u))]"><AboutReveal delay={250}>
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-brand-orange shadow-lg transition-transform duration-300 ease-out group-hover:scale-105 motion-reduce:transition-none sm:h-16 sm:w-16 xl:h-[max(64px,calc(98*var(--u)))] xl:w-[max(64px,calc(98*var(--u)))]">
                <Arrow />
              </span>
            </AboutReveal></div>
          </div>
        </div>
      </Tag>
    </section>
  );
}
