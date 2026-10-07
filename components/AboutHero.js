import Image from "next/image";
import AboutReveal from "@/components/AboutReveal";

export default function AboutHero({ dict }) {
  const t = dict.about;

  return (
    <section>
      <div className="bg-[#f1ece3] py-12 sm:py-16 lg:py-[72px]">
        <div className="mx-auto max-w-[900px] px-4 sm:px-6">
          <AboutReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-brand-navy/70">
              {t.heroEyebrow}
            </p>
          </AboutReveal>
          <AboutReveal delay={120}>
            <h1 className="mt-3 max-w-[640px] text-[30px] font-semibold leading-[1.15] text-brand-navy sm:text-[40px]">
              {t.heroHeading}
            </h1>
          </AboutReveal>
          <AboutReveal delay={240}>
            <p className="mt-5 max-w-[680px] text-[15px] leading-[24px] text-ink/70">{t.heroP1}</p>
          </AboutReveal>
          <AboutReveal delay={340}>
            <p className="mt-3 max-w-[680px] text-[15px] leading-[24px] text-ink/70">{t.heroP2}</p>
          </AboutReveal>
        </div>
      </div>

      <div className="relative h-[220px] w-full overflow-hidden sm:h-[300px] lg:h-[380px]">
        <Image
          src="/images/about/about-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="animate-about-zoom object-cover motion-reduce:animate-none"
        />
      </div>
    </section>
  );
}