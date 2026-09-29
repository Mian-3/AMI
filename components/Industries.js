import Reveal from "@/components/Reveal";

function Icon({ children }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

const industries = [
  { label: "Beverages", icon: <Icon><path d="M7 3h10l-1 6a4 4 0 0 1-8 0z" /><path d="M12 13v8M8 21h8" /></Icon> },
  { label: "Biscuits & Cakes", icon: <Icon><rect x="3" y="10" width="18" height="6" rx="2" /><path d="M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3" /></Icon> },
  { label: "Soaps & Detergents", icon: <Icon><rect x="6" y="4" width="12" height="17" rx="3" /><path d="M9 4V2h6v2" /></Icon> },
  { label: "Snacks", icon: <Icon><path d="M4 12a8 8 0 0 1 16 0c0 3-2 4-2 7H6c0-3-2-4-2-7Z" /><path d="M9 12h.01M15 12h.01M12 9h.01" /></Icon> },
  { label: "Confectionery", icon: <Icon><circle cx="7" cy="7" r="3" /><circle cx="17" cy="17" r="3" /><path d="m9.5 9.5 5 5" /></Icon> },
  { label: "Ice Cream & Dairy", icon: <Icon><path d="M8 10h8l-3 10h-2z" /><path d="M6 10a6 6 0 0 1 12 0z" /></Icon> },
  { label: "Cosmetics & Paints", icon: <Icon><path d="M8 3h8l1 5H7z" /><path d="M6 8h12v9a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" /></Icon> },
  { label: "Pharmaceutical", icon: <Icon><rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)" /><path d="m9.5 9.5 5 5" /></Icon> },
];

export default function Industries() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 md:py-20 xl:px-0">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-col items-center text-center">
          <Reveal as="p" className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-brand-navy">Industries We Serve</Reveal>
          <Reveal as="h2" delay={100} className="max-w-[560px] text-[26px] font-semibold leading-[1.25] text-brand-navy md:text-[32px] md:leading-[40px]">Solutions That Move With Your Industry</Reveal>
          <Reveal as="p" delay={200} className="mt-4 max-w-[560px] text-[14px] leading-[22px] text-ink/60">We work with businesses across diverse product categories, helping them respond to changing consumer expectations and market opportunities.</Reveal>
        </div>

                       <Reveal delay={300} className="mt-10 grid grid-cols-2 divide-x divide-y divide-brand-navy/10 md:grid-cols-4">
          {industries.map((item) => (
            <div key={item.label} className="group flex flex-col items-center justify-center gap-3 px-4 py-9 text-center transition-colors duration-300 hover:bg-brand-orange/10">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange transition-colors duration-300 group-hover:bg-brand-orange group-hover:text-white">{item.icon}</span>
              <span className="text-[13px] font-medium text-ink">{item.label}</span>
            </div>
          ))}
        </Reveal>

        <Reveal delay={450} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0">Explore Our Process →</a>
          <a href="#" className="flex h-9 items-center whitespace-nowrap rounded-md border border-brand-navy/20 px-4 text-[12px] font-medium text-brand-navy transition duration-200 hover:-translate-y-0.5 hover:bg-brand-navy/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0">Download Catalogue</a>
        </Reveal>
      </div>
    </section>
  );
}