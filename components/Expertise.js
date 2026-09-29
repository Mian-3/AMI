import Image from "next/image";
import Reveal from "@/components/Reveal";
import CardCarousel from "@/components/CardCarousel";

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

const items = [
  { title: "Flavours", desc: "Distinctive taste solutions for food, beverage and beyond.", src: "/images/expertise/flavours.jpg" },
  { title: "Fragrances", desc: "Memorable fragrance experiences for personal and home care.", src: "/images/expertise/fragrances.jpg" },
  { title: "Ingredients", desc: "Specialty ingredients selected for quality, function and performance.", src: "/images/expertise/ingredients.jpg" },
  { title: "Custom Solutions", desc: "The right solution for your specific product challenge.", src: "/images/expertise/custom-solutions.jpg" },
];

function ExpertiseCard({ item }) {
  return (
    <a href="#" className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-brand-navy">
      <Image src={item.src} alt={item.title} fill sizes="(min-width: 1024px) 285px, 80vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" aria-hidden="true" />
      <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-brand-orange motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"><ArrowIcon /></span>
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="text-[18px] font-semibold text-white md:text-[19px]">{item.title}</h3>
        <p className="mt-1.5 text-[13px] font-light leading-[20px] text-white/80">{item.desc}</p>
      </div>
    </a>
  );
}

export default function Expertise() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 xl:px-0">
        <div className="flex flex-col items-center text-center">
          <Reveal as="p" className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-brand-navy">Our Expertise</Reveal>
          <Reveal as="div" delay={100} className="group/heading relative inline-block">
            <h2 className="max-w-[560px] text-[26px] font-semibold leading-[1.25] text-brand-navy md:text-[32px] md:leading-[40px]">Ingredients. Expertise. Possibilities.</h2>
            <span className="absolute -bottom-2 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-brand-orange transition-all duration-700 ease-out group-has-[+*]/heading:w-14 motion-reduce:transition-none" aria-hidden="true" />
          </Reveal>
          <Reveal as="p" delay={250} className="mt-5 max-w-[560px] text-[14px] leading-[22px] text-ink/60">From flavour and fragrance to specialty ingredients, we provide solutions designed around the needs of modern products and markets.</Reveal>
        </div>
      </div>

      {/* Mobile: swipeable photo-card carousel */}
      <div className="mt-9 sm:hidden">
        <Reveal>
          <CardCarousel>
            {items.map((item) => (
              <ExpertiseCard key={item.title} item={item} />
            ))}
          </CardCarousel>
        </Reveal>
      </div>

      {/* Tablet and up: original grid */}
      <div className="mx-auto hidden max-w-[1200px] px-4 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 lg:grid-cols-4 lg:gap-5 xl:px-0">
        {items.map((item, index) => (
          <Reveal key={item.title} delay={350 + index * 120}>
            <ExpertiseCard item={item} />
          </Reveal>
        ))}
      </div>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 xl:px-0">
        <Reveal delay={850} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0">Explore Our Process →</a>
          <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md border border-brand-navy/20 px-4 text-[12px] font-medium text-brand-navy transition duration-200 hover:-translate-y-0.5 hover:bg-brand-navy/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">Download Catalogue</a>
        </Reveal>
      </div>
    </section>
  );
}