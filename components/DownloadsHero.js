import Image from "next/image";
import Reveal from "@/components/Reveal";

/*
  Design artboard 1920. At xl+ every size is calc(N * var(--u)) with a floor, same text scale as the Home page.
  Copy and the banner image come from dict.downloadsPage (Admin > Site content > Downloads page).
*/

const CSS = `
@keyframes dh-wipe{from{clip-path:inset(0 0 100% 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes dh-settle{from{transform:scale(1.14)}to{transform:scale(1)}}
@keyframes dh-line{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes dh-par{from{transform:translateY(-3.5%) scale(1.06)}to{transform:translateY(3.5%) scale(1.06)}}
.dh-wipe{animation:dh-wipe 1.4s cubic-bezier(.77,0,.18,1) .25s both}
.dh-settle{animation:dh-settle 2.4s cubic-bezier(.22,1,.36,1) .25s both}
.dh-line{transform-origin:left;animation:dh-line 1.1s cubic-bezier(.22,1,.36,1) .9s both}
[dir=rtl] .dh-line{transform-origin:right}
@supports (animation-timeline:view()){.dh-par{animation:dh-par linear both;animation-timeline:view();animation-range:cover 0% cover 100%}}
@media (prefers-reduced-motion:reduce){.dh-wipe,.dh-settle,.dh-line,.dh-par{animation:none!important}}
`;

export default function DownloadsHero({ dict }) {
  const c = dict.downloadsPage;

  return (
    <section className="[--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <style>{CSS}</style>
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
          <span aria-hidden="true" className="dh-line mt-6 block h-[2px] w-16 bg-brand-orange xl:mt-[calc(28*var(--u))] xl:w-[calc(72*var(--u))]" />
        </div>
      </div>

      <div className="dh-wipe relative h-[13.75rem] w-full overflow-hidden bg-[#e9e6df] sm:h-[20rem] lg:aspect-[1920/709] lg:h-auto">
        <div className="dh-par absolute inset-0">
          <Image
            src={c.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="dh-settle object-cover"
          />
        </div>
      </div>
    </section>
  );
}
