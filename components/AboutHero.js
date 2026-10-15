import Image from "next/image";
import AboutReveal from "@/components/AboutReveal";

/*
  Design artboard 1920. At xl+ every size is calc(N * var(--u)) with a floor,
  so the hero scales exactly like the Figma frame. Below xl the compact layout is kept.
*/
export default function AboutHero({ dict }) {
  const t = dict.about;

  return (
    <section className="[--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="bg-[#f3eee7] py-12 sm:py-16 lg:pb-20 lg:pt-[5.5rem] xl:pb-[calc(80*var(--u))] xl:pt-[calc(75*var(--u))]">
        <div className="mx-auto max-w-[75rem] px-4 sm:px-6 xl:max-w-[calc(1200*var(--u))] xl:px-0">
          <AboutReveal>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-brand-navy/80 xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))] xl:tracking-[0.14em]">
              {t.heroEyebrow}
            </p>
          </AboutReveal>
          <AboutReveal delay={100}>
            <h1 className="mt-3 max-w-[62rem] text-[2rem] font-semibold leading-[1.2] text-brand-navy sm:text-[2.5rem] lg:text-[3rem] xl:mt-[calc(7*var(--u))] xl:max-w-[calc(1000*var(--u))] xl:text-[max(36px,calc(52*var(--u)))] xl:leading-[calc(62*var(--u))] xl:tracking-[-0.02em]">
              {t.heroHeading}
            </h1>
          </AboutReveal>
          <AboutReveal delay={200}>
            <p className="mt-6 max-w-[72rem] text-[1rem] leading-[1.7] text-ink/60 lg:text-[1.0625rem] xl:mt-[calc(18*var(--u))] xl:max-w-[calc(1200*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">
              {t.heroP1}
            </p>
          </AboutReveal>
          <AboutReveal delay={300}>
            <p className="mt-3 max-w-[72rem] text-[1rem] leading-[1.7] text-ink/60 lg:text-[1.0625rem] xl:mt-[calc(10*var(--u))] xl:max-w-[calc(1200*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">
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
