import Image from "next/image";
import AboutReveal from "@/components/AboutReveal";
import { eventHref } from "@/lib/eventsData";

function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-brand-orange">
      <path d="M12 21s-7-7.2-7-12a7 7 0 0 1 14 0c0 4.8-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}
function ArrowUpRight() {
  return (
    <span className="inline-flex rtl:-scale-x-100">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="-rotate-45 transition-transform duration-300 ease-out group-hover:rotate-0 motion-reduce:transition-none"
      >
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </svg>
    </span>
  );
}

export default function EventsHero({ event, locale, dict }) {
  return (
    <section className="relative h-[380px] w-full overflow-hidden bg-[#212121] sm:h-[440px] lg:h-[520px]">
      <Image
        src={event.heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="animate-about-zoom object-cover motion-reduce:animate-none"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto flex max-w-[1200px] items-end justify-between gap-6 px-4 pb-8 sm:px-6 sm:pb-12 xl:px-0">
          <div>
            <AboutReveal>
              <span className="inline-block rounded-full bg-brand-orange px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white rtl:tracking-normal">
                {event.dateLong}
              </span>
            </AboutReveal>
            <AboutReveal delay={100}>
              <h1 className="mt-3 text-[30px] font-semibold leading-[1.1] text-white sm:text-[42px]">{event.title}</h1>
            </AboutReveal>
            <AboutReveal delay={200}>
              <p className="mt-3 flex items-center gap-2 text-[14px] text-white/80">
                <PinIcon />
                {event.location}
              </p>
            </AboutReveal>
          </div>

          <AboutReveal delay={300}>
            <a
              href={eventHref(locale, event)}
              aria-label={`${dict.eventsPage.view}: ${event.title}`}
              className="group flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-white text-brand-orange transition duration-300 hover:scale-110 hover:bg-brand-orange hover:text-white sm:h-[60px] sm:w-[60px]"
            >
              <ArrowUpRight />
            </a>
          </AboutReveal>
        </div>
      </div>
    </section>
  );
}