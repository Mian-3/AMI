import Reveal from "@/components/Reveal";

// Navy hero from the design. Text follows the Home scale. A very slow drifting glow keeps it alive
// without pulling attention from the copy.
export default function FlavoursHero({ dict }) {
  const t = dict.flavoursPage;

  return (
    <section className="relative isolate overflow-hidden bg-brand-navy text-white">
      <style>{`
@keyframes fh-drift-a{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(6%,8%,0) scale(1.15)}}
@keyframes fh-drift-b{0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(-8%,-6%,0) scale(1.1)}}
.fh-glow-a{animation:fh-drift-a 16s ease-in-out infinite}
.fh-glow-b{animation:fh-drift-b 20s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.fh-glow-a,.fh-glow-b{animation:none}}
`}</style>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="fh-glow-a absolute -top-1/2 end-[-10%] h-[120%] w-[55%] rounded-full bg-[radial-gradient(closest-side,rgba(242,143,59,0.22),transparent)]" />
        <div className="fh-glow-b absolute -bottom-1/2 start-[-10%] h-[120%] w-[50%] rounded-full bg-[radial-gradient(closest-side,rgba(90,120,220,0.22),transparent)]" />
      </div>
      <div className="mx-auto w-full max-w-[64rem] px-5 pb-12 pt-10 sm:px-6 sm:pb-14 sm:pt-12 xl:w-[max(calc(1200*var(--u)),60rem)] xl:max-w-none xl:px-0 xl:pb-[calc(88*var(--u))] xl:pt-[calc(64*var(--u))]">
        <Reveal as="p" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white xl:text-[max(12px,calc(16*var(--u)))]">
          {t.heroEyebrow}
        </Reveal>
        <Reveal as="div" delay={100}>
          <h1 className="mt-3 text-[26px] font-semibold leading-[1.2] sm:text-[32px] xl:mt-[calc(16*var(--u))] xl:text-[max(28px,calc(48*var(--u)))]">{t.heroHeading}</h1>
        </Reveal>
        <Reveal as="p" delay={200} className="mt-4 max-w-[48rem] text-[14px] leading-[22px] text-white sm:text-[15px] sm:leading-[24px] xl:mt-[calc(24*var(--u))] xl:max-w-[calc(1000*var(--u))] xl:text-[max(15px,calc(24*var(--u)))] xl:leading-[calc(36*var(--u))]">
          {t.heroP1}
        </Reveal>
        <Reveal as="p" delay={300} className="mt-3 max-w-[48rem] text-[14px] leading-[22px] text-white sm:text-[15px] sm:leading-[24px] xl:mt-[calc(20*var(--u))] xl:max-w-[calc(1000*var(--u))] xl:text-[max(15px,calc(24*var(--u)))] xl:leading-[calc(36*var(--u))]">
          {t.heroP2}
        </Reveal>
      </div>
    </section>
  );
}