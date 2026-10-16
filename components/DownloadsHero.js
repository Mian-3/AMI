import Image from "next/image";
import Reveal from "@/components/Reveal";

/*
  Design artboard 1920. At xl+ every size is calc(N * var(--u)) with a floor, same text scale as the Home page.
  Copy and the banner image come from dict.downloadsPage (Admin > Site content > Downloads page).
*/
export default function DownloadsHero({ dict }) {
  const c = dict.downloadsPage;

  return (
    <section className="[--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="bg-[#fcfcfa] px-4 pb-10 pt-12 sm:px-6 md:pb-14 md:pt-[3.75rem] xl:px-0 xl:pb-[calc(60*var(--u))] xl:pt-[calc(76*var(--u))]">
        <div className="mx-auto max-w-[75rem] xl:max-w-[calc(1200*var(--u))]">
          <Reveal as="p" className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-navy rtl:tracking-normal xl:mb-[calc(8*var(--u))] xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]">
            {c.eyebrow}
          </Reveal>
          <Reveal as="h1" delay={100} className="text-[28px] font-bold leading-[1.2] tracking-[-0.01em] text-brand-navy sm:text-[34px] md:text-[38px] xl:text-[40px] xl:leading-[48px]">
            {c.heading}
          </Reveal>
          <Reveal as="p" delay={220} className="mt-4 max-w-[52rem] text-[14px] leading-[22px] text-ink/60 xl:mt-[calc(14*var(--u))] xl:max-w-[calc(1160*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">
            {c.paragraph}
          </Reveal>
        </div>
      </div>

      <div className="relative h-[13.75rem] w-full overflow-hidden bg-[#e9e6df] sm:h-[20rem] lg:aspect-[1920/709] lg:h-auto">
        <Image
          src={c.heroImage}
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
