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

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

const events = [
  { date: "18 Jun 2026", title: "Connecting. Collaborating. Growing.", venue: "Expo Center in Lahore", src: "/images/events/event-1.jpg" },
  { date: "18 Jun 2026", title: "Food Flavors Event", venue: "Expo Center in Lahore", src: "/images/events/event-2.jpg" },
  { date: "18 Jun 2026", title: "IFTECH 2026", venue: "Expo Center in Lahore", src: "/images/events/event-3.jpg" },
];

export default function Events() {
  return (
    <section className="bg-ink px-4 py-16 sm:px-6 md:py-20 xl:px-0">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr] lg:gap-8">
        <div>
          <Reveal as="p" className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-brand-orange">Events</Reveal>
          <Reveal as="h2" delay={100} className="text-[26px] font-semibold leading-[1.25] text-white md:text-[32px] md:leading-[40px]">Meet Us. Connect. Discover.</Reveal>
          <Reveal as="p" delay={200} className="mt-4 max-w-[380px] text-[14px] leading-[22px] text-white/60">We participate in industry events, exhibitions and professional gatherings where ideas, opportunities and partnerships come together.</Reveal>
          <Reveal delay={300}>
            <a href="#" className="mt-6 flex h-9 w-fit items-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0">See All Events →</a>
          </Reveal>
        </div>

        <div className="flex flex-col gap-3">
          {events.map((event, index) => (
            <Reveal key={event.title} delay={350 + index * 130}>
              <a href="#" className="group block overflow-hidden rounded-xl border border-white/10 transition-colors duration-300 hover:border-white/20">
                <div className="relative h-[90px] w-full sm:h-[100px]">
                  <Image src={event.src} alt={event.title} fill sizes="(min-width: 1024px) 780px, 100vw" className="object-cover" />
                </div>
                <div className="flex items-center justify-between gap-3 p-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-brand-orange">{event.date}</p>
                    <h3 className="mt-0.5 truncate text-[14px] font-semibold text-white">{event.title}</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/50"><PinIcon />{event.venue}</p>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white"><ArrowIcon /></span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}