import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import CardCarousel from "@/components/CardCarousel";

function Icon({ children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

function getStats(dict) {
  return [
    {
      value: "2004",
      label: dict.stats.established,
      icon: (
        <Icon>
          <path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16" />
          <path d="M15 10h4a1 1 0 0 1 1 1v10" />
          <path d="M8 8h3M8 12h3M8 16h3M3 21h18" />
        </Icon>
      ),
    },
    {
      value: "2500+",
      label: dict.stats.products,
      icon: (
        <Icon>
          <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
          <path d="m3 8 9 5 9-5M12 13v8" />
        </Icon>
      ),
    },
    {
      value: "3500+",
      label: dict.stats.clients,
      icon: (
        <Icon>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
          <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
        </Icon>
      ),
    },
    {
      value: "6",
      label: dict.stats.countriesInOperations,
      icon: (
        <Icon>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </Icon>
      ),
    },
    {
      value: "100+",
      label: dict.stats.teamMembers,
      icon: (
        <Icon>
          <circle cx="9" cy="8" r="3.5" />
          <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
          <path d="M16.5 8.5a3 3 0 1 0 0-6" />
          <path d="M19 14.5a5.5 5.5 0 0 1 3 5" />
        </Icon>
      ),
    },
    {
      value: "100,000+",
      label: dict.stats.coveredArea,
      icon: (
        <Icon>
          <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
          <path d="M9 9h6v6H9z" />
        </Icon>
      ),
    },
  ];
}

function StatCard({ item }) {
  return (
    <div className="flex h-full min-h-[170px] min-w-0 flex-col justify-between rounded-[20px] bg-brand-orange p-5 text-white shadow-[0_8px_24px_rgba(242,143,59,0.25)] transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:h-[200px] lg:p-4 xl:p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/25">{item.icon}</span>
      <div className="min-w-0">
        <p className="whitespace-nowrap text-[clamp(1.375rem,2.2vw,2rem)] font-semibold leading-none">
          <CountUp value={item.value} />
        </p>
        <p className="mt-2 text-[12px] leading-snug xl:text-[13px]">{item.label}</p>
      </div>
    </div>
  );
}

export default function Stats({ dict }) {
  const stats = getStats(dict);

  return (
    <section className="relative bg-offwhite pb-10">
      <div className="absolute inset-x-0 bottom-0 top-[calc(50%-20px)] bg-cream max-lg:hidden" aria-hidden="true" />

      {/* Mobile: swipeable carousel */}
      <div className="relative sm:hidden">
        <Reveal>
          <CardCarousel>
            {stats.map((item) => (
              <StatCard key={item.label} item={item} />
            ))}
          </CardCarousel>
        </Reveal>
      </div>

      {/* Tablet and up: grid (6 cards in one row on desktop) */}
      <div className="relative mx-auto hidden max-w-[1200px] px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 lg:grid-cols-6 lg:gap-3 xl:gap-4 xl:px-0">
        {stats.map((item, index) => (
          <Reveal key={item.label} delay={index * 120}>
            <StatCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}