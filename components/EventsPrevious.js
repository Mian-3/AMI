import Image from "next/image";
import Mx from "@/components/Mx";
import MxText from "@/components/MxText";
import { eventHref } from "@/lib/eventsData";

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-7.2-7-12a7 7 0 0 1 14 0c0 4.8-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

// Finished events, in the same dark style as the Events block on the Home page.
// The headings come from Admin > Pages > Events > Page text.
export default function EventsPrevious({ events, dict, locale }) {
  if (!events.length) return null;
  const t = dict.eventsPage;

  return (
    <Mx as="section" className="bg-ink px-4 py-16 sm:px-6 md:py-20 xl:px-0">
      <div className="mx-auto max-w-[900px]">
        <div className="flex flex-col items-start">
          {t.previousEyebrow ? <p className="mx-eyebrow mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-brand-orange">{t.previousEyebrow}</p> : null}
          <MxText as="h2" delay={150} className="text-[26px] font-semibold leading-[1.25] text-white md:text-[32px] md:leading-[40px]">{t.previousHeading}</MxText>
          {t.previousParagraph ? <p style={{ "--d": "450ms" }} className="mx-fade mt-4 max-w-[460px] text-[14px] leading-[22px] text-white/60">{t.previousParagraph}</p> : null}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {events.map((event, index) => {
            const href = eventHref(locale, event);
            const linked = href && href !== "#";
            const Tag = linked ? "a" : "div";
            const linkProps = linked ? { href, "aria-label": `${t.view}: ${event.title}` } : {};
            return (
              <div key={event.id ?? index} className="mx-curtain" style={{ "--d": `${400 + (index % 2) * 180}ms`, "--mx-r": "12px" }}>
                <Tag {...linkProps} className="group block overflow-hidden rounded-xl border border-white/10 transition-colors duration-300 hover:border-white/20">
                  <div className="mx-media relative h-[180px] w-full sm:h-[210px]" style={{ "--d": `${400 + (index % 2) * 180}ms` }}>
                    <Image src={event.image} alt="" fill sizes="(min-width: 768px) 440px, 100vw" className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none" />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-brand-orange">{event.dateShort}</p>
                      <h3 className="mt-0.5 text-[16px] font-semibold text-white">{event.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-[12px] text-white/50"><PinIcon />{event.location}</p>
                    </div>
                    <span className="mx-pop flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white transition-transform duration-300 ease-out group-hover:rotate-45 rtl:group-hover:-rotate-45 motion-reduce:transition-none motion-reduce:group-hover:rotate-0"><ArrowIcon /></span>
                  </div>
                </Tag>
              </div>
            );
          })}
        </div>
      </div>
    </Mx>
  );
}
