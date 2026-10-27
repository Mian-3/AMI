import FitImage, { fitBox } from "@/components/FitImage";

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

// One event card, used by Upcoming and Previous so every card has the same height,
// text sizes and arrow size. Titles are limited to 3 lines so rows never differ in height.
export default function EventCard({ event, href, label, fit = "fill" }) {
  const linked = href && href !== "#";
  const Tag = linked ? "a" : "div";
  const linkProps = linked ? { href, "aria-label": label } : {};
  return (
    <Tag
      {...linkProps}
      className="group box-border flex h-full flex-col overflow-hidden rounded-[20px] border border-black/10 bg-white shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:border-brand-orange hover:shadow-[0_20px_40px_-18px_rgba(251,160,31,0.35)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 xl:rounded-[max(20px,calc(28*var(--u)))]"
    >
      <div className={"relative w-full shrink-0 overflow-hidden " + fitBox(fit)}>
        <FitImage src={event.image} fit={fit} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        <span className="absolute start-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md xl:start-[calc(20*var(--u))] xl:top-[calc(20*var(--u))] xl:gap-[calc(8*var(--u))] xl:px-[calc(16*var(--u))] xl:py-[calc(8*var(--u))] xl:text-[max(11px,calc(14*var(--u)))]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#fba01f] xl:h-[max(6px,calc(8*var(--u)))] xl:w-[max(6px,calc(8*var(--u)))]" />
          {event.dateShort}
        </span>
      </div>
      <div className="flex min-h-[132px] flex-1 items-center justify-between gap-4 px-5 py-5 xl:min-h-[max(140px,calc(176*var(--u)))] xl:gap-[calc(20*var(--u))] xl:px-[calc(28*var(--u))] xl:py-[calc(24*var(--u))]">
        <div className="min-w-0">
          <h3 className="line-clamp-3 text-[18px] font-semibold leading-[1.3] text-brand-navy xl:text-[max(17px,calc(24*var(--u)))] xl:leading-[max(24px,calc(32*var(--u)))]">{event.title}</h3>
          <p className="mt-2 flex items-center gap-2 text-[14px] text-ink/55 xl:mt-[calc(10*var(--u))] xl:gap-[calc(8*var(--u))] xl:text-[max(14px,calc(17*var(--u)))]">
            <Pin />
            <span className="min-w-0 truncate">{event.location}</span>
          </p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fba01f] text-[#202020] transition duration-300 ease-out group-hover:scale-105 group-hover:shadow-[0_0_0_6px_rgba(251,160,31,0.18)] motion-reduce:transition-none xl:h-[max(44px,calc(57*var(--u)))] xl:w-[max(44px,calc(57*var(--u)))]">
          <Arrow />
        </span>
      </div>
    </Tag>
  );
}
