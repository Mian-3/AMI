import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import CardCarousel from "@/components/CardCarousel";
import StatIcon from "@/components/StatIcons";
import { defaultCards } from "@/lib/homeStats";

function StatCard({ item }) {
  return (
    <div className="flex h-full min-h-[170px] min-w-0 flex-col justify-between rounded-[20px] bg-brand-orange p-5 text-white shadow-[0_8px_24px_rgba(242,143,59,0.25)] transition duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:h-[200px] lg:p-4 xl:p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/25">
        <StatIcon id={item.icon} />
      </span>
      <div className="min-w-0">
        <p className="whitespace-nowrap text-[clamp(1.375rem,2.2vw,2rem)] font-semibold leading-none">
          <CountUp value={item.value} />
        </p>
        <p className="mt-2 text-[12px] leading-snug xl:text-[13px]">{item.label}</p>
      </div>
    </div>
  );
}

// `items` come from the admin (Home page > Statistics). Without them the default cards are shown.
export default function Stats({ dict, items }) {
  const stats = items && items.length ? items : defaultCards(dict?.stats);
  const cols = { "--c3": Math.min(stats.length, 3), "--c6": Math.min(stats.length, 6) };

  return (
    <section className="relative bg-offwhite pb-10">
      <div className="absolute inset-x-0 bottom-0 top-[calc(50%-20px)] bg-cream max-lg:hidden" aria-hidden="true" />

      {/* Mobile: swipeable carousel */}
      <div className="relative sm:hidden">
        <Reveal>
          <CardCarousel>
            {stats.map((item, index) => (
              <StatCard key={`${item.label}-${index}`} item={item} />
            ))}
          </CardCarousel>
        </Reveal>
      </div>

      {/* Tablet and up: grid (6 cards in one row on desktop) */}
      <div
        style={cols}
        className="relative mx-auto hidden max-w-[1200px] px-4 sm:grid sm:[grid-template-columns:repeat(var(--c3),minmax(0,1fr))] sm:gap-4 sm:px-6 lg:[grid-template-columns:repeat(var(--c6),minmax(0,1fr))] lg:gap-3 xl:gap-4 xl:px-0"
      >
        {stats.map((item, index) => (
          <Reveal key={`${item.label}-${index}`} delay={index * 120}>
            <StatCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}