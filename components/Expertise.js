import Image from "next/image";
import Reveal from "@/components/Reveal";
import CatalogueDownloadLink from "@/components/CatalogueDownloadLink";
import LocaleLink from "@/components/LocaleLink";
import { getMedia } from "@/lib/media";

/*
  Design artboard 1920. At xl+ every size is calc(N * var(--u)) with a floor,
  so this section scales exactly like the Figma frame. Below xl the compact layout is kept.
*/
function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[13px] w-[13px] rtl:-scale-x-100 xl:h-[max(14px,calc(22*var(--u)))] xl:w-[max(14px,calc(22*var(--u)))]">
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

function getItems(dict, media) {
  return [
    { title: dict.expertise.items.flavours.title, desc: dict.expertise.items.flavours.desc, src: media.expertise.flavours },
    { title: dict.expertise.items.fragrances.title, desc: dict.expertise.items.fragrances.desc, src: media.expertise.fragrances },
  ];
}

function ExpertiseCard({ item }) {
  return (
    <LocaleLink href="/flavours-fragrances" className="group relative block aspect-[3/4] transform-gpu overflow-hidden rounded-2xl bg-brand-navy outline-none [-webkit-tap-highlight-color:transparent] sm:aspect-[4/3] xl:aspect-[587/447] xl:rounded-[calc(32*var(--u))]">
      <Image src={item.src} alt={item.title} fill sizes="(min-width: 1280px) 600px, (min-width: 640px) 440px, 90vw" className="object-cover transition duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none" />
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-brand-navy/95 via-brand-navy/45 to-transparent" aria-hidden="true" />
      <span className="absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand-orange transition-all duration-300 ease-out group-hover:rotate-45 group-hover:bg-brand-orange group-hover:text-white rtl:group-hover:-rotate-45 motion-reduce:transition-none motion-reduce:group-hover:rotate-0 xl:end-[calc(32*var(--u))] xl:top-[calc(32*var(--u))] xl:h-[max(36px,calc(56*var(--u)))] xl:w-[max(36px,calc(56*var(--u)))]"><ArrowIcon /></span>
      <div className="absolute inset-x-0 bottom-0 p-4 xl:px-[calc(32*var(--u))] xl:pb-[calc(52*var(--u))] xl:pt-0">
        <h3 className="text-[18px] font-semibold text-white md:text-[19px] xl:text-[max(19px,calc(29*var(--u)))] xl:leading-[1.2]">{item.title}</h3>
        <p className="mt-1.5 text-[13px] leading-[20px] text-white/90 xl:mt-[calc(10*var(--u))] xl:max-w-[calc(300*var(--u))] xl:text-[max(13px,calc(16*var(--u)))] xl:leading-[calc(20*var(--u))]">{item.desc}</p>
      </div>
    </LocaleLink>
  );
}

export default async function Expertise({ dict }) {
  const media = await getMedia();
  const items = getItems(dict, media);
  const processCta = dict.expertise?.processCta ?? (dict.nav?.process === "Our Process" ? "Explore Our Process →" : dict.nav?.process);

  const ex = media.expertise;
  const mode = ex.bgMode === "video" && ex.bgVideo ? "video" : ex.bgMode === "image" && ex.bgImage ? "image" : "none";
  const dark = mode !== "none" && ex.bgOverlay === "dark";
  const overlayRgb = dark ? "11,23,54" : "252,252,250";

  return (
    <section className="relative isolate overflow-hidden bg-[#fcfcfa] py-16 [--u:1px] md:py-20 xl:pb-[calc(101*var(--u))] xl:pt-[calc(92*var(--u))] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      {mode === "video" ? (
        <video key={ex.bgVideo} src={ex.bgVideo} poster={ex.bgPoster || undefined} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      ) : null}
      {mode === "image" ? <Image src={ex.bgImage} alt="" fill sizes="100vw" className="-z-20 object-cover" /> : null}
      {mode !== "none" ? <div className="absolute inset-0 -z-10" style={{ backgroundColor: `rgba(${overlayRgb},${(ex.bgStrength ?? 70) / 100})` }} aria-hidden="true" /> : null}
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 xl:max-w-[calc(1200*var(--u))] xl:px-0">
        <div className="flex flex-col items-center text-center">
          <Reveal as="p" className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-orange xl:mb-[calc(12*var(--u))] xl:text-[max(12px,calc(16*var(--u)))] xl:leading-[calc(24*var(--u))]">{dict.expertise.eyebrow}</Reveal>
          <Reveal as="div" delay={100}>
            <h2 className={`max-w-[720px] text-[26px] font-semibold leading-[1.25] tracking-[-0.015em] ${dark ? "text-white" : "text-brand-navy"} md:text-[32px] md:leading-[40px] xl:max-w-none xl:text-[max(28px,calc(40*var(--u)))] xl:leading-[calc(48*var(--u))]`}>{dict.expertise.heading}</h2>
          </Reveal>
          <Reveal as="p" delay={250} className={`mt-5 max-w-[720px] text-[14px] leading-[22px] ${dark ? "text-white/85" : "text-ink/60"} xl:mt-[calc(15*var(--u))] xl:max-w-[calc(1080*var(--u))] xl:text-[max(15px,calc(20*var(--u)))] xl:leading-[calc(30*var(--u))]`}>{dict.expertise.paragraph}</Reveal>
        </div>

        <div className="mx-auto mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:mt-[calc(46*var(--u))] xl:gap-[calc(26*var(--u))]">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={350 + index * 150}>
              <ExpertiseCard item={item} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={650} className="mt-9 flex flex-wrap items-center justify-center gap-3 xl:mt-[calc(64*var(--u))] xl:gap-[calc(30*var(--u))]">
          <LocaleLink href="/our-process" className="flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-brand-orange px-4 text-[12px] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 motion-reduce:transition-none motion-reduce:hover:translate-y-0 xl:h-[max(40px,calc(48*var(--u)))] xl:min-w-[160px] xl:w-[calc(229*var(--u))] xl:rounded-[calc(8*var(--u))] xl:px-0 xl:text-[max(12px,calc(14*var(--u)))]">{processCta}</LocaleLink>
          <CatalogueDownloadLink
            label={dict.buttons.downloadCatalogueArrow ?? dict.buttons.downloadCatalogue}
            icon="none"
            className={`flex h-9 items-center whitespace-nowrap px-1 text-[12px] font-medium ${dark ? "text-white" : "text-brand-navy"} transition duration-200 hover:opacity-70 motion-reduce:transition-none xl:h-[max(40px,calc(48*var(--u)))] xl:text-[max(12px,calc(14*var(--u)))]`}
          />
        </Reveal>
      </div>
    </section>
  );
}
