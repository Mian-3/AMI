import Image from "next/image";
import Reveal from "@/components/Reveal";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-5 w-5 rtl:-scale-x-100 xl:h-6 xl:w-6">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

export default function InsightsHero({ dict }) {
  const t = dict.insightsPage;

  return (
    <section className="relative isolate flex min-h-[440px] items-end overflow-hidden bg-brand-navy md:min-h-[480px] xl:min-h-[520px]">
      <Image src="/images/hero/hero-bg.jpg" alt="" fill priority sizes="100vw" className="-z-20 animate-about-zoom object-cover motion-reduce:animate-none" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/45 to-black/10 rtl:bg-gradient-to-l" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/55 via-transparent to-transparent" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 pb-14 pt-24 sm:px-6 md:pb-16 xl:px-0 xl:pb-16">
        <Reveal as="p" className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-white rtl:tracking-normal xl:mb-4 xl:text-[13px]">
          <span className="h-[2px] w-8 bg-brand-orange" aria-hidden="true" />
          {t.heroEyebrow}
        </Reveal>
        <Reveal as="h1" delay={100} className="max-w-[820px] text-[22px] font-bold leading-[1.25] text-white sm:text-[32px] md:text-[36px] md:leading-[44px] xl:text-[20px] xl:leading-[48px]">{t.heroHeading}</Reveal>
        <Reveal as="p" delay={220} className="mt-4 max-w-[640px] text-[12px] leading-[1.7] text-white/90 xl:text-[14px] xl:leading-[30px]">{t.heroParagraph}</Reveal>

        <a
          href="#blog-list"
          aria-label={t.bandHeading}
          className="group absolute bottom-12 end-4 hidden h-14 w-14 items-center justify-center rounded-full bg-white text-brand-orange shadow-lg outline-none transition duration-300 hover:bg-brand-orange hover:text-white focus-visible:ring-2 focus-visible:ring-white sm:end-6 sm:flex md:bottom-14 xl:bottom-16 xl:end-0 xl:h-16 xl:w-16"
        >
          <span className="transition-transform duration-300 group-hover:rotate-45 rtl:group-hover:-rotate-45 motion-reduce:transition-none">
            <ArrowIcon />
          </span>
        </a>
      </div>
    </section>
  );
}
