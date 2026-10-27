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
  // Top banner of the Events page. Not tied to any event. Empty image = no banner.
  eventsBanner: {
    image: "", imageMobile: "", alt: "", link: "", maxHeight: 620, showText: true, fit: "fill", focus: 50,
    en: {
      eyebrow: "EVENTS",
      heading: "On the Ground, At the Industry’s Biggest Events",
      text: "As a food flavour & fragrance manufacturer in Pakistan, A.M International takes part in trade shows, exhibitions and industry gatherings across the country and beyond. Here’s where we’ve been, and where to meet us next.",
    },
    ar: {
      eyebrow: "الفعاليات",
      heading: "في الميدان، في أكبر فعاليات القطاع",
      text: "بصفتنا شركة مصنّعة للنكهات والعطور الغذائية في باكستان، تشارك A.M International في المعارض التجارية والمعارض المتخصصة والتجمعات الصناعية داخل البلاد وخارجها. إليكم أين كنّا، وأين يمكنكم لقاءنا بعد ذلك.",
    },
  },
  // How event card pictures sit in their cards: "fill", "whole" or "natural".
  eventsCards: { fit: "fill" },
  // {locale} becomes "en" or "ar". "#" means "no link yet".
  links: { requestSample: "/{locale}/contact" },
  // Social icons in the header and footer, in this order. Add or remove them in the admin.
  socials: [
    { platform: "facebook", url: "#" },
    { platform: "linkedin", url: "#" },
  ],
  // Footer links, in the same order as the footer labels. The Flavours and Fragrances links open that tab.
  // Food tabs: 0 Confectionery, 1 Baking, 2 Beverages, 3 Pharmaceutical, 4 Frozen Food, 5 Savory, 6 Cup Cake.
  // Fragrance tabs: 0 Soap, 1 Detergents, 2 Cosmetics, 3 Paints, 4 Baby / Skin Care, 5 Home Care, 6 Leather & Car Care.
  footerLinks: {
    fragrances: [
      "/{locale}/flavours-fragrances#fragrance-1", // Detergents
      "/{locale}/flavours-fragrances#fragrance-0", // Shampoos (personal wash)
      "/{locale}/flavours-fragrances#fragrance-3", // Paints
      "/{locale}/flavours-fragrances#fragrance-2", // Cosmetics
      "/{locale}/flavours-fragrances#fragrance-4", // Body / Skin Care
    ],
    foodFlavours: [
      "/{locale}/flavours-fragrances#food-5", // Savoury Products
      "/{locale}/flavours-fragrances#food-3", // Pharmaceuticals
      "/{locale}/flavours-fragrances#food-4", // Dairy Products (Frozen Food)
      "/{locale}/flavours-fragrances#food-0", // Confectionries
      "/{locale}/flavours-fragrances#food-2", // Beverages
      "/{locale}/flavours-fragrances#food-1", // Bakery
    ],
    quick: ["/{locale}/about", "/{locale}/about#leadership", "/{locale}/our-process", "/{locale}/events", "/{locale}/contact"],
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
    if (key === "footerLinks" && isObject(saved)) {
      const OLD_QUICK = ["/{locale}/about", "/{locale}/about", "/{locale}#process", "/{locale}/events", "/{locale}/contact"];
      const fix = (list, def, old) => def.map((d, i) => { const v = Array.isArray(list) ? list[i] : undefined; return !v || v === "#" || (old && v === old[i]) ? d : v; });
      out[key] = { fragrances: fix(saved.fragrances, base.fragrances), foodFlavours: fix(saved.foodFlavours, base.foodFlavours), quick: fix(saved.quick, base.quick, OLD_QUICK) };
    } else if (saved === undefined) out[key] = base;
    else if (key === "eventsBanner" && isObject(saved)) out[key] = { ...base, ...saved, en: { ...base.en, ...(saved.en || {}) }, ar: { ...base.ar, ...(saved.ar || {}) } };
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
    fallback.map((def, i) => {
      const v = linkUrl(Array.isArray(value) ? value[i] : undefined, def);
      return v === "#" ? def : v;
    });

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
    eventsCards: { fit: ["fill", "whole", "natural"].includes(src.eventsCards?.fit) ? src.eventsCards.fit : "fill" },
    eventsBanner: {
      image: fileUrl(src.eventsBanner?.image, ""),
      imageMobile: fileUrl(src.eventsBanner?.imageMobile, ""),
      alt: text(src.eventsBanner?.alt, 160),
      link: linkUrl(src.eventsBanner?.link, ""),
      en: { eyebrow: text(src.eventsBanner?.en?.eyebrow, 80), heading: text(src.eventsBanner?.en?.heading, 200), text: text(src.eventsBanner?.en?.text, 700) },
      ar: { eyebrow: text(src.eventsBanner?.ar?.eyebrow, 80), heading: text(src.eventsBanner?.ar?.heading, 200), text: text(src.eventsBanner?.ar?.text, 700) },
      fit: src.eventsBanner?.fit === "whole" ? "whole" : "fill",
      focus: Math.min(100, Math.max(0, Math.round(Number(src.eventsBanner?.focus ?? 50)) || 0)),
      showText: src.eventsBanner?.showText === false ? false : true,
      maxHeight: (() => { const n = Math.round(Number(src.eventsBanner?.maxHeight ?? d.eventsBanner.maxHeight)); return n === 0 ? 0 : Math.min(1400, Math.max(200, n || d.eventsBanner.maxHeight)); })(),
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
