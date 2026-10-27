import Image from "next/image";
import AboutReveal from "@/components/AboutReveal";
import { eventHref } from "@/lib/eventsData";

function Pin() {
  return (
    <svg viewBox="0 0 28 34" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[15px] w-[12px] shrink-0 text-brand-orange xl:h-[max(15px,calc(20*var(--u)))] xl:w-[max(12px,calc(16*var(--u)))]">
      <path d="M14 32S3 21.5 3 13.5a11 11 0 0 1 22 0C25 21.5 14 32 14 32Z" />
      <circle cx="14" cy="13.5" r="4.2" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[46%] w-[46%] rtl:-scale-x-100 transition-transform duration-300 ease-out group-hover:rotate-45 rtl:group-hover:-rotate-45 motion-reduce:transition-none">
      <path d="M12 36 36 12M15 12h21v21" />
    </svg>
  );
}

export default function EventsGrid({ events, dict, locale }) {
  if (!events.length) return null;
  const hrefOf = (event) => eventHref(locale, event);
  return (
    <section className="bg-white px-4 pb-12 pt-12 sm:px-6 md:pb-14 md:pt-16 xl:px-0 xl:pb-[calc(72*var(--u))] xl:pt-[calc(72*var(--u))] [--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="mx-auto xl:max-w-[calc(1200*var(--u))]">
        <AboutReveal>
          <h2 className="text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] text-brand-navy sm:text-[32px] xl:text-[max(30px,calc(38*var(--u)))] xl:leading-[max(38px,calc(46*var(--u)))]">
            {dict.eventsPage.heading}
          </h2>
        </AboutReveal>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:mt-[calc(31*var(--u))] xl:gap-x-[calc(18*var(--u))] xl:gap-y-[calc(35*var(--u))]">
          {events.map((event, index) => {
            const href = hrefOf(event);
            const linked = href && href !== "#";
            const Tag = linked ? "a" : "div";
            const linkProps = linked ? { href, "aria-label": `${dict.eventsPage.view}: ${event.title}` } : {};
            return (
            <AboutReveal key={event.id ?? index} delay={(index % 2) * 120} className="h-full">
              <Tag
                {...linkProps}
                className="group box-border flex h-full flex-col overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:border-brand-orange hover:shadow-[0_20px_40px_-18px_rgba(251,160,31,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 xl:rounded-[max(20px,calc(28*var(--u)))]"
              >
                <div className="relative h-[190px] w-full overflow-hidden sm:h-[210px] xl:h-[max(150px,calc(219*var(--u)))]">
                  <Image src={event.image} alt="" fill sizes="(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
                  <span className="absolute start-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md xl:start-[calc(20*var(--u))] xl:top-[calc(20*var(--u))] xl:gap-[calc(8*var(--u))] xl:px-[calc(16*var(--u))] xl:py-[calc(8*var(--u))] xl:text-[max(11px,calc(14*var(--u)))]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#fba01f] xl:h-[max(6px,calc(8*var(--u)))] xl:w-[max(6px,calc(8*var(--u)))]" />
                    {event.dateShort}
                  </span>
                </div>
                <div className="flex flex-1 items-center justify-between gap-4 px-5 py-5 xl:min-h-[max(96px,calc(130*var(--u)))] xl:gap-[calc(20*var(--u))] xl:px-[calc(28*var(--u))] xl:py-[calc(24*var(--u))]">
                  <div className="min-w-0">
                    <h3 className="text-[18px] font-semibold leading-[1.3] text-brand-navy xl:text-[max(17px,calc(24*var(--u)))] xl:leading-[max(24px,calc(32*var(--u)))]">{event.title}</h3>
                    <p className="mt-2 flex items-center gap-2 text-[14px] text-ink/55 xl:mt-[calc(10*var(--u))] xl:gap-[calc(8*var(--u))] xl:text-[max(14px,calc(17*var(--u)))]">
                      <Pin />
                      {event.location}
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fba01f] text-[#202020] transition duration-300 ease-out group-hover:scale-105 group-hover:shadow-[0_0_0_6px_rgba(251,160,31,0.18)] motion-reduce:transition-none xl:h-[max(44px,calc(57*var(--u)))] xl:w-[max(44px,calc(57*var(--u)))]">
                    <Arrow />
                  </span>
                </div>
              </Tag>
            </AboutReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
