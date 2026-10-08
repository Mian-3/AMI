import Reveal from "@/components/Reveal";

export default function ContactDirect({ dict }) {
  const c = dict.contactPage.direct;

  return (
    <section className="bg-brand-orange px-4 pb-20 pt-14 text-center text-white sm:px-6 md:pb-[6.9rem] md:pt-[5.125rem]">
      <div className="mx-auto max-w-[75rem]">
        <Reveal as="p" className="mb-3 text-[clamp(0.75rem,0.73vw,0.875rem)] font-semibold uppercase tracking-[0.2em]">
          {c.eyebrow}
        </Reveal>
        <Reveal as="h2" delay={100} className="text-[clamp(1.75rem,2.08vw,2.5rem)] font-bold leading-[1.15]">
          {c.heading}
        </Reveal>
        <Reveal as="p" delay={200} className="mx-auto mt-5 max-w-[42rem] text-[clamp(1rem,1.25vw,1.5rem)] leading-[1.5]">
          {c.text}
        </Reveal>
        <Reveal delay={320} className="mt-9 flex flex-col items-center justify-center gap-4 md:mt-12 md:flex-row md:gap-14 text-[clamp(1rem,1.15vw,1.375rem)]">
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
