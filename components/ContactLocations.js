import Image from "next/image";
import Reveal from "@/components/Reveal";

// Pin positions as a percentage of the map image (1920 x 626 design crop)
const PINS = [
  { key: "faisalabad", x: 54.64, y: 31.8 },
  { key: "lahore", x: 57.34, y: 37.4 },
  { key: "karachi", x: 45.26, y: 81.8 },
];

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Pin({ pin, label, index }) {
  return (
    <div className="absolute" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
      <Reveal delay={600 + index * 180} className="relative">
        <div className="group relative">
          <span className="absolute -left-[0.3125rem] -top-[0.3125rem] block h-[0.625rem] w-[0.625rem] rounded-full bg-white shadow-[0_0_0_2px_rgba(0,0,0,0.12)] max-md:h-[0.4rem] max-md:w-[0.4rem]" />
          <span className="absolute -left-[0.3125rem] -top-[0.3125rem] block h-[0.625rem] w-[0.625rem] animate-ping rounded-full bg-white/80 motion-reduce:animate-none max-md:h-[0.4rem] max-md:w-[0.4rem]" aria-hidden="true" />
          <span
            className="absolute left-[0.9em] top-0 -translate-y-1/2 whitespace-nowrap rounded-[0.2rem] bg-[#201e1e] px-[0.7em] py-[0.35em] text-[clamp(0.4375rem,0.78vw,0.9375rem)] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-300 group-hover:bg-brand-navy before:absolute before:-left-[0.5em] before:top-1/2 before:-translate-y-1/2 before:border-y-[0.5em] before:border-e-[0.55em] before:border-y-transparent before:border-e-[#201e1e] before:transition-colors before:duration-300 group-hover:before:border-e-brand-navy before:content-['']"
          >
            {label}
          </span>
        </div>
      </Reveal>
    </div>
  );
}

export default function ContactLocations({ dict }) {
  const c = dict.contactPage.locations;

  return (
    <section className="bg-[#fcfcfa]">
      <div className="px-4 pb-8 pt-16 text-center sm:px-6 md:pt-[6.9rem]">
        <Reveal as="p" className="mb-3 text-[clamp(0.75rem,0.73vw,0.875rem)] font-medium uppercase tracking-[0.2em] text-[#4b5563]">
          {c.eyebrow}
        </Reveal>
        <Reveal as="h2" delay={100} className="text-[clamp(2.25rem,2.92vw,3.5rem)] font-bold leading-[1.1] text-brand-navy">
          {c.heading}
        </Reveal>
        <Reveal as="p" delay={200} className="mt-4 text-[clamp(1.25rem,1.67vw,2rem)] font-semibold leading-[1.3] text-brand-orange">
          {c.sub}
        </Reveal>
        <Reveal as="p" delay={300} className="mx-auto mt-3 max-w-[38rem] text-[clamp(1rem,1.15vw,1.375rem)] leading-[1.6] text-[#737878]">
          {c.paragraph}
        </Reveal>
      </div>

      {/* Map band */}
      <div className="relative w-full overflow-hidden" dir="ltr">
        <div className="relative aspect-[1920/626] w-full">
          <Image src="/images/contact/contact-map.webp" alt="Map of Pakistan with AM International office locations" fill sizes="100vw" className="object-cover" />
          {PINS.map((pin, index) => (
            <Pin key={pin.key} pin={pin} label={c.items.find((item) => item.key === pin.key).city} index={index} />
          ))}
        </div>
      </div>

      {/* Offices card, overlapping into the orange band below */}
      <div className="bg-[linear-gradient(to_bottom,#fef4e5_0,#fef4e5_8rem,#f28a35_8rem)] px-4 sm:px-6 md:bg-[linear-gradient(to_bottom,#fef4e5_0,#fef4e5_13.25rem,#f28a35_13.25rem)] xl:px-0">
        <Reveal className="mx-auto max-w-[75rem]">
          <div className="rounded-b-[2.5rem] rounded-t-[1.5rem] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:rounded-t-[2.5rem] md:p-[3.125rem] md:pt-[3.5rem]">
            <h3 className="text-[clamp(1.375rem,1.67vw,2rem)] font-semibold text-brand-orange">{c.cardHeading}</h3>
            <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-[342fr_392fr_366fr] md:gap-8">
              {c.items.map((office, index) => (
                <Reveal key={office.key} delay={150 + index * 130}>
                  <p className="text-[clamp(0.75rem,0.73vw,0.875rem)] font-medium uppercase tracking-[0.01em] text-[#4b5563]">{office.label}</p>
                  <p className="mt-2 text-[clamp(1.5rem,1.67vw,2rem)] font-bold leading-[1.15] text-brand-navy">{office.city}</p>
                  <p className="mt-4 max-w-[22rem] text-[clamp(0.9375rem,0.99vw,1.1875rem)] leading-[1.45] text-[#737878]">{office.address}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.mapsQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-5 inline-flex items-center gap-1.5 text-[clamp(0.875rem,0.83vw,1rem)] font-medium text-brand-orange transition-colors hover:text-brand-orange/80"
                  >
                    {c.directions}
                    <ArrowIcon />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
