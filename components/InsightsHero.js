import Image from "next/image";
import Reveal from "@/components/Reveal";

function ArrowIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="rtl:-scale-x-100">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

export default function InsightsHero({ dict }) {
  const t = dict.insightsPage;

  return (
    <section className="relative isolate flex min-h-[420px] items-end overflow-hidden bg-brand-navy md:min-h-[480px]">
      <Image src="/images/hero/hero-bg.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/75 via-black/45 to-black/20 rtl:bg-gradient-to-l" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 pb-14 pt-24 sm:px-6 md:pb-16 xl:px-0">
        <Reveal as="p" className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white rtl:tracking-normal">{t.heroEyebrow}</Reveal>
        <Reveal as="h1" delay={100} className="max-w-[760px] text-[26px] font-semibold leading-[1.2] text-white sm:text-[34px] md:text-[42px]">{t.heroHeading}</Reveal>
        <Reveal as="p" delay={220} className="mt-5 max-w-[600px] text-[14px] leading-[22px] text-white/90 md:text-[16px] md:leading-[26px]">{t.heroParagraph}</Reveal>

        <a
          href="#blog-list"
          aria-label={t.bandHeading}
          className="group absolute bottom-12 end-4 hidden h-14 w-14 items-center justify-center rounded-full bg-white text-brand-orange shadow-lg outline-none transition duration-300 hover:bg-brand-orange hover:text-white focus-visible:ring-2 focus-visible:ring-white sm:end-6 sm:flex md:bottom-14 xl:end-0"
        >
          <span className="transition-transform duration-300 group-hover:rotate-45 rtl:group-hover:-rotate-45 motion-reduce:transition-none">
            <ArrowIcon />
          </span>
        </a>
      </div>
    </section>
  );
}