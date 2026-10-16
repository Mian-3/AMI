import Reveal from "@/components/Reveal";

export default function ContactDirect({ dict }) {
  const c = dict.contactPage.direct;

  return (
    <section className="[--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)] bg-brand-orange px-4 pb-20 pt-14 text-center text-white sm:px-6 md:pb-[6.9rem] md:pt-[5.125rem]">
      <div className="mx-auto max-w-[75rem] xl:max-w-[calc(1200*var(--u))]">
        <Reveal as="p" className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] rtl:tracking-normal xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]">
          {c.eyebrow}
        </Reveal>
        <Reveal as="h2" delay={100} className="text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] md:text-[32px] md:leading-[40px] xl:text-[max(28px,calc(40*var(--u)))] xl:leading-[calc(48*var(--u))]">
          {c.heading}
        </Reveal>
        <Reveal as="p" delay={200} className="mx-auto mt-4 max-w-[42rem] xl:mt-[calc(16*var(--u))] xl:max-w-[calc(820*var(--u))] text-[14px] leading-[22px] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">
          {c.text}
        </Reveal>
        <Reveal delay={320} className="mt-9 flex flex-col items-center justify-center gap-4 md:mt-12 md:flex-row md:gap-14 text-[14px] leading-[22px] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <span className="font-bold">{c.call}</span>
            <a href="tel:+923004018352" dir="ltr" className="underline-offset-4 transition-opacity hover:underline hover:opacity-90">+92 300 4018 352</a>
            <span className="hidden h-6 w-px bg-white md:block" aria-hidden="true" />
            <a href="tel:+923218404292" dir="ltr" className="underline-offset-4 transition-opacity hover:underline hover:opacity-90">+92 321 8404 292</a>
          </p>
          <p className="flex flex-wrap items-center justify-center gap-x-3">
            <span className="font-bold">{c.email}</span>
            <a href="mailto:sales@aminternational.pk" className="underline-offset-4 transition-opacity hover:underline hover:opacity-90">sales@aminternational.pk</a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
