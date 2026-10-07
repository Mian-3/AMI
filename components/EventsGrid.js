import Image from "next/image";
import AboutReveal from "@/components/AboutReveal";
import { eventHref } from "@/lib/eventsData";

function PinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-[#fba01f]">
      <path d="M12 21s-7-7.2-7-12a7 7 0 0 1 14 0c0 4.8-7 12-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function ArrowUpRight() {
  return (
    <span className="inline-flex rtl:-scale-x-100">
      <svg
        width="20"
        height="20"
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

export default function EventsGrid({ events, dict, locale }) {
  return (
    <section id="upcoming" className="scroll-mt-24 bg-[#fcfbf8] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 xl:px-0">
        <AboutReveal>
          <h2 className="text-[26px] font-semibold text-brand-navy sm:text-[32px]">{dict.eventsPage.heading}</h2>
        </AboutReveal>

        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {events.map((event, i) => (
            <li key={event.id}>
              <AboutReveal delay={(i % 2) * 120} className="h-full">
                <a
                  href={eventHref(locale, event)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#212121] transition duration-300 hover:-translate-y-1 hover:border-[#fba01f]/60 hover:shadow-xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="relative h-[150px] w-full overflow-hidden sm:h-[170px]">
                    <Image
                      src={event.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 590px, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#fba01f] rtl:tracking-normal">{event.dateShort}</p>
                      <h3 className="mt-1.5 text-[18px] font-medium leading-[24px] text-white">{event.title}</h3>
                      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/60">
                        <PinIcon />
                        {event.location}
                      </p>
                    </div>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fba01f] text-[#212121] transition duration-300 group-hover:scale-110 group-hover:bg-white">
                      <ArrowUpRight />
                    </span>
                  </div>
                </a>
              </AboutReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}