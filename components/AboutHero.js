import Image from "next/image";
import AboutReveal from "@/components/AboutReveal";

export default function AboutHero({ dict }) {
  const t = dict.about;

  return (
    <section>
      <div className="bg-[#f3eee7] py-12 sm:py-16 lg:pb-20 lg:pt-[5.5rem]">
        <div className="mx-auto max-w-[75rem] px-4 sm:px-6 xl:px-0">
          <AboutReveal>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-brand-navy/80 2xl:text-[0.875rem]">
              {t.heroEyebrow}
            </p>
          </AboutReveal>
          <AboutReveal delay={100}>
            <h1 className="mt-3 max-w-[62rem] text-[2rem] font-semibold leading-[1.2] text-brand-navy sm:text-[2.5rem] lg:text-[3rem] 2xl:text-[3.5rem]">
              {t.heroHeading}
            </h1>
          </AboutReveal>
          <AboutReveal delay={200}>
            <p className="mt-6 max-w-[72rem] text-[1rem] leading-[1.7] text-ink/60 lg:text-[1.0625rem] 2xl:mt-7 2xl:text-[1.25rem] 2xl:leading-[2.25rem]">
              {t.heroP1}
            </p>
          </AboutReveal>
          <AboutReveal delay={300}>
            <p className="mt-3 max-w-[72rem] text-[1rem] leading-[1.7] text-ink/60 lg:text-[1.0625rem] 2xl:text-[1.25rem] 2xl:leading-[2.25rem]">
              {t.heroP2}
            </p>
          </AboutReveal>
        </div>
      </div>

      <div className="relative h-[13.75rem] w-full overflow-hidden sm:h-[20rem] lg:h-auto lg:aspect-[1920/500]">
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
