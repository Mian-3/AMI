import { resolveHref, isExternal } from "@/lib/mediaShared";

// Standalone top banner of the Events page, edited in Admin > Photos and links.
// It is independent of the events list. The picture is always shown whole (h-auto, never cropped).
export default function EventsBanner({ banner, locale }) {
  if (!banner?.image) return null;
  const href = banner.link ? resolveHref(banner.link, locale) : "";
  const ext = href && isExternal(href);
  const picture = (
    <picture>
      {banner.imageMobile ? <source media="(max-width: 767px)" srcSet={banner.imageMobile} /> : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={banner.image} alt={banner.alt || ""} className="block h-auto w-full" fetchPriority="high" />
    </picture>
  );
  return (
    <section className="bg-white">
      {href ? (
        <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="block">{picture}</a>
      ) : picture}
    </section>
  );
}
