import { resolveHref, isExternal } from "@/lib/mediaShared";
import AboutReveal from "@/components/AboutReveal";

// Standalone top banner of the Events page. Picture, height and text are edited in the admin.
// The picture is always shown whole, never cropped: scaled to fit, spare space filled with a soft blur.
// Text sits over the picture on computers and under it on phones.
export default function EventsBanner({ banner, locale, dict }) {
  const t = dict?.eventsPage || {};
  const text = banner?.showText !== false && (t.bannerEyebrow || t.bannerHeading || t.bannerText);
  if (!banner?.image && !text) return null;
  const href = banner.link ? resolveHref(banner.link, locale) : "";
  const ext = href && isExternal(href);
  const maxH = banner.maxHeight || 0;

  // Same type styling as the home page hero: small spaced eyebrow, big semibold heading, medium subheading.
  const copy = text ? (
    <div className="max-w-[640px] text-white xl:max-w-[calc(760*var(--u))]">
      {t.bannerEyebrow ? (
        <AboutReveal><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] xl:mb-[calc(20*var(--u))] xl:text-[max(12px,calc(16*var(--u)))]">{t.bannerEyebrow}</p></AboutReveal>
      ) : null}
      {t.bannerHeading ? (
        <AboutReveal delay={100}><h1 className="text-[34px] font-semibold leading-[1.12] md:text-[46px] md:leading-[52px] xl:text-[max(46px,calc(64*var(--u)))] xl:leading-[calc(70*var(--u))]">{t.bannerHeading}</h1></AboutReveal>
      ) : null}
      {t.bannerText ? (
        <AboutReveal delay={200}><p className="mt-4 text-[15px] font-medium leading-[1.6] md:text-[17px] xl:mt-[calc(24*var(--u))] xl:text-[max(16px,calc(21*var(--u)))]">{t.bannerText}</p></AboutReveal>
      ) : null}
    </div>
  ) : null;

  const picture = banner.image ? (
    <div className="relative overflow-hidden bg-ink" style={maxH ? { "--bh": `${maxH}px` } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {maxH ? <img src={banner.image} alt="" aria-hidden="true" className="absolute inset-0 hidden h-full w-full scale-110 object-cover opacity-70 blur-2xl md:block" /> : null}
      <picture className="relative block">
        {banner.imageMobile ? <source media="(max-width: 767px)" srcSet={banner.imageMobile} /> : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={banner.image} alt={banner.alt || ""} className={"relative mx-auto block h-auto w-full" + (maxH ? " md:max-h-[min(var(--bh),65vh)] md:object-contain" : "")} fetchPriority="high" />
      </picture>
      {copy ? (
        <>
          <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-t from-black/70 via-black/25 to-black/0 md:block" />
          <div className="absolute inset-x-0 bottom-0 hidden md:block"><div className="mx-auto w-full max-w-[1200px] px-6 pb-12 xl:max-w-[calc(1600*var(--u))] xl:px-0 xl:pb-[calc(70*var(--u))]">{copy}</div></div>
        </>
      ) : null}
    </div>
  ) : null;

  const body = (
    <>
      {picture}
      {copy ? <div className={"bg-brand-navy px-4 py-10 sm:px-6 " + (banner.image ? "md:hidden" : "md:py-20")}><div className="mx-auto max-w-[1200px] xl:max-w-[calc(1600*var(--u))]">{copy}</div></div> : null}
    </>
  );
  return (
    <section className="bg-white [--u:1px] xl:[--u:clamp(0.667px,0.0520833vw,1px)]">
      {href ? (
        <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="block">{body}</a>
      ) : body}
    </section>
  );
}
