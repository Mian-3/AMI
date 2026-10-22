// Images, files and links that are not part of the dictionary text.
// Safe to import from server and client components (no database code here).

const clientLogos = Array.from({ length: 20 }, (_, i) => ({ name: `Client${i + 1}`, src: `/images/clients/${i + 1}.png` }));

export const MEDIA_DEFAULTS = {
  catalogue: { pdf: "/documents/ami-catalogue.pdf" },
  hero: { video: "/videos/hero-2.mp4", poster: "/images/hero/hero-bg.jpg" },
  // The two photo cards in the home page Flavours and Fragrances section.
  expertise: {
    flavours: "/images/expertise/new1.png",
    fragrances: "/images/expertise/new2.png",
    // Optional section background. bgMode is "none", "image" or "video"; only the chosen one is shown.
    bgMode: "none",
    bgImage: "",
    bgVideo: "",
    bgPoster: "",
    bgOverlay: "light", // "light" keeps dark text, "dark" switches the heading text to white
    bgStrength: 70, // overlay strength, 0 to 90 percent
  },
  // {locale} becomes "en" or "ar". "#" means "no link yet".
  links: { requestSample: "/{locale}/contact", facebook: "#", instagram: "#", linkedin: "#" },
  footerLinks: {
    fragrances: ["#", "#", "#", "#", "#"],
    foodFlavours: ["#", "#", "#", "#", "#", "#"],
    quick: ["/{locale}/about", "/{locale}/about", "/{locale}#process", "/{locale}/events", "/{locale}/contact"],
  },
  clients: clientLogos,
};

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

export function resolveHref(href, locale) {
  if (typeof href !== "string" || !href) return "#";
  return href.replace("{locale}", locale === "ar" ? "ar" : "en");
}

export function isExternal(href) {
  return typeof href === "string" && /^https?:\/\//.test(href);
}

// Saved values win, anything missing falls back to the default.
export function mergeMedia(stored) {
  const out = {};
  for (const key of Object.keys(MEDIA_DEFAULTS)) {
    const base = MEDIA_DEFAULTS[key];
    const saved = stored?.[key];
    if (saved === undefined) out[key] = base;
    else if (isObject(base) && isObject(saved)) out[key] = { ...base, ...saved };
    else out[key] = saved;
  }
  return out;
}

function text(v, max) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function fileUrl(v, fallback) {
  const s = text(v, 800);
  return s.startsWith("https://") || s.startsWith("/") ? s : fallback;
}

function linkUrl(v, fallback) {
  const s = text(v, 800);
  if (!s) return fallback;
  return s === "#" || s.startsWith("/") || s.startsWith("https://") || s.startsWith("mailto:") || s.startsWith("tel:") ? s : fallback;
}

// Rebuilds the media object from untrusted input. Unknown keys are dropped.
export function sanitizeMedia(input) {
  const d = MEDIA_DEFAULTS;
  const src = isObject(input) ? input : {};

  const list = (value, fallback) =>
    fallback.map((def, i) => linkUrl(Array.isArray(value) ? value[i] : undefined, def));

  const clients = (Array.isArray(src.clients) ? src.clients : [])
    .slice(0, 60)
    .map((c, i) => ({ name: text(c?.name, 80) || `Client${i + 1}`, src: fileUrl(c?.src, "") }))
    .filter((c) => c.src);

  return {
    catalogue: { pdf: fileUrl(src.catalogue?.pdf, d.catalogue.pdf) },
    hero: {
      video: fileUrl(src.hero?.video, d.hero.video),
      poster: fileUrl(src.hero?.poster, d.hero.poster),
    },
    expertise: {
      flavours: fileUrl(src.expertise?.flavours, d.expertise.flavours),
      fragrances: fileUrl(src.expertise?.fragrances, d.expertise.fragrances),
      bgMode: ["none", "image", "video"].includes(src.expertise?.bgMode) ? src.expertise.bgMode : "none",
      bgImage: fileUrl(src.expertise?.bgImage, ""),
      bgVideo: fileUrl(src.expertise?.bgVideo, ""),
      bgPoster: fileUrl(src.expertise?.bgPoster, ""),
      bgOverlay: src.expertise?.bgOverlay === "dark" ? "dark" : "light",
      bgStrength: Math.min(90, Math.max(0, Math.round(Number(src.expertise?.bgStrength ?? d.expertise.bgStrength)) || 0)),
    },
    links: {
      requestSample: linkUrl(src.links?.requestSample, d.links.requestSample),
      facebook: linkUrl(src.links?.facebook, d.links.facebook),
      instagram: linkUrl(src.links?.instagram, d.links.instagram),
      linkedin: linkUrl(src.links?.linkedin, d.links.linkedin),
    },
    footerLinks: {
      fragrances: list(src.footerLinks?.fragrances, d.footerLinks.fragrances),
      foodFlavours: list(src.footerLinks?.foodFlavours, d.footerLinks.foodFlavours),
      quick: list(src.footerLinks?.quick, d.footerLinks.quick),
    },
    clients: clients.length ? clients : d.clients,
  };
}
