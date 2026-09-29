import Image from "next/image";
import Reveal from "@/components/Reveal";

const steps = [
  { number: "01", title: "R&D", desc: "Where new flavours and fragrances are born.", tint: "from-amber-300/45 to-amber-600/10", ring: "hover:ring-amber-300/40" },
  { number: "02", title: "Production", desc: "10 tons of flavours and fragrances, made daily.", tint: "from-sky-400/45 to-sky-700/10", ring: "hover:ring-sky-300/40" },
  { number: "03", title: "QC", desc: "Every batch tested: Flash Point, Moisture, Brix, pH and more.", tint: "from-emerald-400/45 to-emerald-700/10", ring: "hover:ring-emerald-300/40" },
  { number: "04", title: "Application", desc: "Tested in real food and non food applications, before it reaches you.", tint: "from-fuchsia-400/45 to-fuchsia-700/10", ring: "hover:ring-fuchsia-300/40" },
];

export default function Process() {
  return (
    <section className="relative overflow-hidden bg-brand-navy px-4 py-16 text-white sm:px-6 md:py-20 xl:px-0">
           <Image src="/images/process/process-bg.png" alt="" fill sizes="100vw" className="object-cover animate-slow-zoom motion-reduce:animate-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-black/20 to-brand-navy/70" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Reveal>
            <h2 className="text-[24px] font-semibold leading-[1.3] md:text-[28px]">From Need to Solution</h2>
            <p className="mt-2 max-w-[420px] text-[14px] text-white/70">We keep the process simple, focused and collaborative.</p>
          </Reveal>
          <Reveal delay={150}>
            <a href="#" className="flex h-9 shrink-0 items-center whitespace-nowrap rounded-md bg-white px-4 text-[12px] font-medium text-brand-navy transition duration-200 hover:-translate-y-0.5 hover:bg-white/90 motion-reduce:transition-none motion-reduce:hover:translate-y-0">Explore Our Process →</a>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={300 + index * 130}>
              <div className={"group relative flex h-full min-h-[190px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br p-5 pt-11 shadow-lg ring-1 ring-transparent backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 " + step.tint + " " + step.ring}>
                <span className="absolute left-0 top-0 rounded-br-xl rounded-tl-2xl bg-step-red px-3 py-1.5 text-[11px] font-medium shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none">Step {step.number}</span>
                <span className="ml-1 mt-2 h-5 w-px bg-white/50" aria-hidden="true" />
                <span className="ml-0.5 -mt-1 h-1.5 w-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" aria-hidden="true" />
                <div className="mt-2 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none">
                  <h3 className="text-[18px] font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-[13px] font-light leading-[20px] text-white/85">{step.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}