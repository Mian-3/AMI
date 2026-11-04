// Turns the header settings (Media and links) plus the site text into what the header shows.
// Safe for server and client components.
import { resolveHref, isExternal } from "@/lib/mediaShared";

const isPdf = (h) => /\.pdf(\?.*)?$/i.test(h || "");
const opensNewTab = (h) => isExternal(h) || isPdf(h);

export function buildHeader(dict, media, locale, active) {
  const L = locale === "ar" ? "ar" : "en";
  const h = media.header;
  const fromDict = {
    home: dict.nav.home,
    about: dict.nav.about,
    flavours: dict.nav.flavoursFragrances,
    process: dict.nav.process,
    downloads: dict.nav.downloads,
    events: dict.nav.events,
    insights: dict.nav.insights,
    contact: dict.nav.contact,
  };

  const nav = h.nav
    .filter((n) => n.show)
    .map((n) => {
      const href = resolveHref(n.href, locale);
      return {
        label: n[L] || fromDict[n.id] || n.en || n.ar || "",
        href,
        external: opensNewTab(href),
        active: n.id === active,
      };
    })
    .filter((n) => n.label);

  const rq = h.requestSample;
  const rqLink = rq.mode === "link";
  const rqHref = rqLink ? resolveHref(rq.href || "/{locale}/contact", locale) : `/${locale}/contact`;
  const request = {
    show: rq.show,
    label: rq[L] || dict.buttons.requestSample,
    enquiry: !rqLink,
    href: rqHref,
    external: rqLink && opensNewTab(rqHref),
  };

  const ct = h.catalogue;
  const custom = ct[L];
  const catalogue = {
    show: ct.show,
    label: custom || dict.buttons.downloadCatalogue,
    labelArrow: custom ? (/[→←]\s*$/.test(custom) ? custom : `${custom} →`) : dict.buttons.downloadCatalogueArrow,
    href: ct.href ? resolveHref(ct.href, locale) : "",
  };

  return { nav, request, catalogue };
}

export { opensNewTab };
