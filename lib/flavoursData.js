// Settings for the category cards on the Flavours & Fragrances page.
// Safe to import from server and client code (no database access here).
//
// Text and photos are edited in Site content. This part, which formats each card is
// available in and where it links to, is edited in the admin under "Flavours page".
// Cards are matched by position (same order as the page).

export const CARD_COUNT = 7;
export const DEFAULT_FORMAT = "liquid";
export const META_KEY = "flavoursMeta";

const card = () => ({ liquid: true, powder: true, href: "" });

export const FLAVOURS_META_DEFAULTS = {
  food: Array.from({ length: CARD_COUNT }, card),
  fragrance: Array.from({ length: CARD_COUNT }, card),
};

function cleanHref(value) {
  const s = typeof value === "string" ? value.trim().slice(0, 800) : "";
  if (!s || s === "#") return "";
  return s.startsWith("/") || s.startsWith("https://") || s.startsWith("mailto:") || s.startsWith("tel:") ? s : "";
}

function cleanList(list) {
  const src = Array.isArray(list) ? list : [];
  return Array.from({ length: CARD_COUNT }, (_, i) => {
    const c = src[i];
    return {
      liquid: c?.liquid === undefined ? true : Boolean(c.liquid),
      powder: c?.powder === undefined ? true : Boolean(c.powder),
      href: cleanHref(c?.href),
    };
  });
}

export function sanitizeFlavoursMeta(input) {
  return { food: cleanList(input?.food), fragrance: cleanList(input?.fragrance) };
}

// Turns the saved settings into what the page component uses.
export function toCardMeta(list, locale) {
  const lang = locale === "ar" ? "ar" : "en";
  return list.map((c) => ({
    formats: [c.liquid ? "liquid" : null, c.powder ? "powder" : null].filter(Boolean),
    href: c.href ? c.href.replace("{locale}", lang) : null,
  }));
}
