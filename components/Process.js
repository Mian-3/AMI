import Image from "next/image";
import Reveal from "@/components/Reveal";

function getSteps(dict) {
  return [
    { number: "01", title: dict.process.steps.rd.title, desc: dict.process.steps.rd.desc, tint: "from-amber-400 via-amber-500/70 to-transparent", ring: "hover:ring-amber-300/40" },
    { number: "02", title: dict.process.steps.application.title, desc: dict.process.steps.application.desc, tint: "from-fuchsia-500 via-fuchsia-500/70 to-transparent", ring: "hover:ring-fuchsia-300/40" },
    { number: "03", title: dict.process.steps.production.title, desc: dict.process.steps.production.desc, tint: "from-sky-500 via-sky-500/70 to-transparent", ring: "hover:ring-sky-300/40" },
    { number: "04", title: dict.process.steps.qc.title, desc: dict.process.steps.qc.desc, tint: "from-emerald-500 via-emerald-500/70 to-transparent", ring: "hover:ring-emerald-300/40" },
  ];
}
export default function Process({ dict }) {
  const steps = getSteps(dict);

  return (
    <section className="relative overflow-hidden bg-brand-navy px-4 py-16 text-white sm:px-6 md:py-20 xl:px-0">
      <Image src="/images/process/process-bg.png" alt="" fill sizes="100vw" className="object-cover animate-slow-zoom motion-reduce:animate-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-black/20 to-brand-navy/70" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1200px]">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <Reveal>
            <h2 className="text-[24px] font-semibold leading-[1.3] md:text-[28px]">{dict.process.heading}</h2>
            <p className="mt-2 max-w-[420px] text-[14px] text-white/70">{dict.process.tagline}</p>
          </Reveal>
          <Reveal delay={150}>
            <a href="#" className="flex h-9 shrink-0 items-center whitespace-nowrap rounded-md bg-white px-4 text-[12px] font-medium text-brand-navy transition duration-200 hover:-translate-y-0.5 hover:bg-white/90 motion-reduce:transition-none motion-reduce:hover:translate-y-0">{dict.buttons.exploreProcess}</a>
          </Reveal>
        </div>

                      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={300 + index * 130}>
              <div className={"group relative flex h-full min-h-[190px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-brand-navy p-5 pt-11 shadow-lg ring-1 ring-transparent backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 " + step.ring}>
                <div className={"pointer-events-none absolute -inset-x-6 bottom-[-40%] h-[90%] bg-gradient-to-t blur-2xl transition-all duration-700 ease-out group-hover:inset-x-0 group-hover:bottom-0 group-hover:h-full group-hover:rounded-2xl group-hover:blur-0 " + step.tint} aria-hidden="true" />
                <span className="relative start-0 top-0 -ms-5 -mt-11 w-fit rounded-tl-2xl rtl:rounded-tl-none rtl:rounded-tr-2xl bg-step-red px-3 py-1.5 text-[11px] font-medium shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5 motion-reduce:transition-none">{dict.process.stepLabel} {step.number}</span>
                <span className="relative ms-1 mt-2 h-5 w-px bg-white/50" aria-hidden="true" />
                <span className="relative ms-0.5 -mt-1 h-1.5 w-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" aria-hidden="true" />
                <div className="relative mt-2">
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