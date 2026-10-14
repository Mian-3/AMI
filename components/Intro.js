import Reveal from "@/components/Reveal";
import CatalogueDownloadLink from "@/components/CatalogueDownloadLink";
import LocaleLink from "@/components/LocaleLink";

/*
  Design artboard 1920. At xl+ every size is calc(N * var(--u)) with a floor,
  so this section scales exactly like the Figma frame. Below xl the compact layout is kept.
*/
export default function Intro({ dict }) {
  return (
    <section className="bg-offwhite px-4 pb-14 pt-16 [--u:1px] sm:px-6 md:pt-[72px] xl:px-0 xl:pb-[calc(85*var(--u))] xl:pt-[calc(80*var(--u))] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center xl:max-w-[calc(1200*var(--u))]">
        <Reveal as="p" className="mb-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-brand-navy xl:mb-[calc(10*var(--u))] xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]">{dict.intro.eyebrow}</Reveal>
        <Reveal as="h2" delay={100} className="max-w-[660px] text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] text-brand-navy md:text-[32px] md:leading-[40px] xl:max-w-[calc(820*var(--u))] xl:text-[max(28px,calc(40*var(--u)))] xl:leading-[calc(50*var(--u))]">{dict.intro.heading}</Reveal>
        <Reveal as="p" delay={300} className="mt-4 max-w-[640px] text-[14px] leading-[22px] text-ink/60 xl:mt-[calc(13*var(--u))] xl:max-w-[calc(865*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]">
          <span className="xl:block">{dict.intro.paragraph1}</span>{" "}
          <span className="xl:block">{dict.intro.paragraph2}</span>
        </Reveal>
        <Reveal delay={400} className="mt-7 flex flex-wrap items-center justify-center gap-3 xl:mt-[calc(53*var(--u))] xl:gap-[calc(30*var(--u))]">
          <LocaleLink href="/about" className="flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0 xl:h-[max(40px,calc(48*var(--u)))] xl:w-[calc(229*var(--u))] xl:min-w-[160px] xl:rounded-[calc(8*var(--u))] xl:px-0 xl:text-[max(12px,calc(14*var(--u)))]">{dict.buttons.discoverAmInternational}</LocaleLink>
          <CatalogueDownloadLink
            label={dict.buttons.downloadCatalogueArrow}
            icon="none"
            className="flex h-9 items-center whitespace-nowrap px-1 text-[12px] font-medium text-brand-navy transition duration-200 hover:opacity-70 motion-reduce:transition-none xl:h-[max(40px,calc(48*var(--u)))] xl:text-[max(12px,calc(14*var(--u)))]"
          />
        </Reveal>
      </div>
    </section>
  );
}
