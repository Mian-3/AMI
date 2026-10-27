import Mx from "@/components/Mx";
import MxText from "@/components/MxText";
import EventCard from "@/components/EventCard";
import { eventHref } from "@/lib/eventsData";

// Finished events. Same cards, sizes and spacing as Upcoming Events.
// The headings come from Admin > Pages > Events > Page text.
export default function EventsPrevious({ events, dict, locale, fit = "fill" }) {
  if (!events.length) return null;
  const t = dict.eventsPage;

  return (
    <Mx as="section" className="border-t border-black/5 bg-white px-4 pb-16 pt-12 sm:px-6 md:pb-20 md:pt-14 xl:px-0 xl:pb-[calc(88*var(--u))] xl:pt-[calc(72*var(--u))] [--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="mx-auto xl:max-w-[calc(1200*var(--u))]">
        <div className="flex flex-col items-start">
          {t.previousEyebrow ? <p className="mx-eyebrow mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-brand-orange xl:text-[max(12px,calc(14*var(--u)))]">{t.previousEyebrow}</p> : null}
          <MxText as="h2" delay={150} className="text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] text-brand-navy sm:text-[32px] xl:text-[max(30px,calc(38*var(--u)))] xl:leading-[max(38px,calc(46*var(--u)))]">{t.previousHeading}</MxText>
          {t.previousParagraph ? <p style={{ "--d": "450ms" }} className="mx-fade mt-4 max-w-[460px] text-[14px] leading-[22px] text-ink/60 xl:max-w-[calc(640*var(--u))] xl:text-[max(14px,calc(17*var(--u)))] xl:leading-[calc(26*var(--u))]">{t.previousParagraph}</p> : null}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:mt-[calc(31*var(--u))] xl:gap-x-[calc(18*var(--u))] xl:gap-y-[calc(35*var(--u))]">
          {events.map((event, index) => (
            <div key={event.id ?? index} className="mx-curtain h-full" style={{ "--d": `${400 + (index % 2) * 180}ms`, "--mx-r": "20px" }}>
              <EventCard event={event} href={eventHref(locale, event)} label={`${t.view}: ${event.title}`} fit={fit} />
            </div>
          ))}
        </div>
      </div>
    </Mx>
  );
}
