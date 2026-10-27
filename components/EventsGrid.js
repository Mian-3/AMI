import AboutReveal from "@/components/AboutReveal";
import EventCard from "@/components/EventCard";
import { eventHref } from "@/lib/eventsData";

export default function EventsGrid({ events, dict, locale, fit = "fill" }) {
  if (!events.length) return null;
  return (
    <section className="bg-white px-4 pb-12 pt-12 sm:px-6 md:pb-14 md:pt-16 xl:px-0 xl:pb-[calc(72*var(--u))] xl:pt-[calc(72*var(--u))] [--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="mx-auto xl:max-w-[calc(1200*var(--u))]">
        <AboutReveal>
          <h2 className="text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] text-brand-navy sm:text-[32px] xl:text-[max(30px,calc(38*var(--u)))] xl:leading-[max(38px,calc(46*var(--u)))]">
            {dict.eventsPage.heading}
          </h2>
        </AboutReveal>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:mt-[calc(31*var(--u))] xl:gap-x-[calc(18*var(--u))] xl:gap-y-[calc(35*var(--u))]">
          {events.map((event, index) => (
            <AboutReveal key={event.id ?? index} delay={(index % 2) * 120} className="h-full">
              <EventCard event={event} href={eventHref(locale, event)} label={`${dict.eventsPage.view}: ${event.title}`} fit={fit} />
            </AboutReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
