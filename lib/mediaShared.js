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
    cardOverlay: 25, // dark tint over both card photos or videos, 0 to 80 percent, keeps the text clear
    // Each card shows its photo, or a looping video when its mode is "video" (the photo is then the poster).
    flavoursMode: "image",
    flavoursVideo: "",
    fragrancesMode: "image",
    fragrancesVideo: "",
    // Optional section background. bgMode is "none", "image" or "video"; only the chosen one is shown.
    bgMode: "none",
    bgImage: "",
    bgVideo: "",
    bgPoster: "",
    bgOverlay: "light", // "light" keeps dark text, "dark" switches the heading text to white
    bgStrength: 70, // overlay strength, 0 to 90 percent
  },
  // {locale} becomes "en" or "ar". "#" means "no link yet".
  links: { requestSample: "/{locale}/contact" },
  // Social icons in the header and footer, in this order. Add or remove them in the admin.
  socials: [
    { platform: "facebook", url: "#" },
    { platform: "linkedin", url: "#" },
  ],
  footerLinks: {
    fragrances: ["#", "#", "#", "#", "#"],
    foodFlavours: ["#", "#", "#", "#", "#", "#"],
    quick: ["/{locale}/about", "/{locale}/about", "/{locale}#process", "/{locale}/events", "/{locale}/contact"],
  },
  clients: clientLogos,
  // Certification badges at the bottom of the home page. Each can open a PDF certificate.
  certifications: [
    { image: "/images/certifications/Mask group.png", pdf: "/documents/certificates/FSSC Intertek AMI.pdf", alt: "Certification FSSC Intertek AMI" },
    { image: "/images/certifications/Mask group (1).png", pdf: "/documents/certificates/isoqar14001.pdf", alt: "Certification 2" },
    { image: "/images/certifications/Mask group (2).png", pdf: "/documents/certificates/isoqar9001.pdf", alt: "Certification 3" },
    { image: "/images/certifications/Mask group (3).png", pdf: "/documents/certificates/IHC Halal Certificate-AM INTERNATIONAL-2026-2027.pdf", alt: "Certification 4" },
    { image: "/images/certifications/Mask group (4).png", pdf: "/documents/certificates/punjabfoodauth.pdf", alt: "Certification 5" },
  ],
};

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

export const SOCIAL_PLATFORMS = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "x", label: "X (Twitter)" },
  { id: "youtube", label: "YouTube" },
  { id: "tiktok", label: "TikTok" },
];

// Older saved settings kept three fixed links. Carry facebook and linkedin over, instagram is dropped.
function legacySocials(links) {
  if (!isObject(links)) return undefined;
  const out = [];
  if (typeof links.facebook === "string") out.push({ platform: "facebook", url: links.facebook });
  if (typeof links.linkedin === "string") out.push({ platform: "linkedin", url: links.linkedin });
  return out.length ? out : undefined;
}

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
    let saved = stored?.[key];
    if (key === "socials" && saved === undefined) saved = legacySocials(stored?.links);
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
      cardOverlay: Math.min(80, Math.max(0, Math.round(Number(src.expertise?.cardOverlay ?? d.expertise.cardOverlay)) || 0)),
      flavoursMode: src.expertise?.flavoursMode === "video" ? "video" : "image",
      flavoursVideo: fileUrl(src.expertise?.flavoursVideo, ""),
      fragrancesMode: src.expertise?.fragrancesMode === "video" ? "video" : "image",
      fragrancesVideo: fileUrl(src.expertise?.fragrancesVideo, ""),
      bgMode: ["none", "image", "video"].includes(src.expertise?.bgMode) ? src.expertise.bgMode : "none",
      bgImage: fileUrl(src.expertise?.bgImage, ""),
      bgVideo: fileUrl(src.expertise?.bgVideo, ""),
      bgPoster: fileUrl(src.expertise?.bgPoster, ""),
      bgOverlay: src.expertise?.bgOverlay === "dark" ? "dark" : "light",
      bgStrength: Math.min(90, Math.max(0, Math.round(Number(src.expertise?.bgStrength ?? d.expertise.bgStrength)) || 0)),
    },
    links: {
      requestSample: linkUrl(src.links?.requestSample, d.links.requestSample),
    },
    socials: (Array.isArray(src.socials) ? src.socials : legacySocials(src.links) || d.socials)
      .slice(0, 8)
      .map((x) => ({ platform: SOCIAL_PLATFORMS.some((p) => p.id === x?.platform) ? x.platform : "", url: linkUrl(x?.url, "") }))
      .filter((x) => x.platform && x.url),
    footerLinks: {
      fragrances: list(src.footerLinks?.fragrances, d.footerLinks.fragrances),
      foodFlavours: list(src.footerLinks?.foodFlavours, d.footerLinks.foodFlavours),
      quick: list(src.footerLinks?.quick, d.footerLinks.quick),
    },
    clients: clients.length ? clients : d.clients,
    certifications: (Array.isArray(src.certifications) ? src.certifications : d.certifications)
      .slice(0, 12)
      .map((c, i) => ({ image: fileUrl(c?.image, ""), pdf: fileUrl(c?.pdf, ""), alt: text(c?.alt, 120) || `Certification ${i + 1}` }))
      .filter((c) => c.image),
  };
}
