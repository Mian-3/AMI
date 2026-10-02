import Image from "next/image";
import Reveal from "@/components/Reveal";

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-7.2-7-12a7 7 0 0 1 14 0c0 4.8-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:-scale-x-100">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

function getEvents(dict) {
  return [
    { date: dict.events.items.event1.date, title: dict.events.items.event1.title, venue: dict.events.items.event1.venue, src: "/images/events/in-1.png" },
    { date: dict.events.items.event2.date, title: dict.events.items.event2.title, venue: dict.events.items.event2.venue, src: "/images/events/Rectangle 240649825.png" },
  ];
}

export default function Events({ dict }) {
  const events = getEvents(dict);

  return (
    <section className="bg-ink px-4 py-16 sm:px-6 md:py-20 xl:px-0">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <Reveal>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-brand-orange">{dict.events.eyebrow}</p>
            <h2 className="text-[26px] font-semibold leading-[1.25] text-white md:text-[32px] md:leading-[40px]">{dict.events.heading}</h2>
            <p className="mt-4 max-w-[460px] text-[14px] leading-[22px] text-white/60">{dict.events.paragraph}</p>
          </Reveal>
          <Reveal delay={150}>
            <a href="#" className="flex h-9 w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0"><CalendarIcon />{dict.buttons.seeAllEvents}</a>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {events.map((event, index) => (
            <Reveal key={event.title} delay={250 + index * 150}>
              <a href="#" className="group block overflow-hidden rounded-xl border border-white/10 transition-colors duration-300 hover:border-white/20">
                <div className="relative h-[180px] w-full sm:h-[210px]">
                  <Image src={event.src} alt={event.title} fill sizes="(min-width: 768px) 580px, 100vw" className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none" />
                </div>
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-brand-orange">{event.date}</p>
                    <h3 className="mt-0.5 text-[16px] font-semibold text-white">{event.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-[12px] text-white/50"><PinIcon />{event.venue}</p>
                  </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white transition-transform duration-300 ease-out group-hover:rotate-45 rtl:group-hover:-rotate-45 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"><ArrowIcon /></span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}