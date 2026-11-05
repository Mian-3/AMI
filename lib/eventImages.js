// Event photos live in the website files, not in the admin.
// The admin controls the text, dates and visibility. This file controls the photo, on the Events page and on the home page.
//
// An event gets its photo in two ways (the first match wins):
//  1. EVENT_IMAGES: the event address (slug) -> photo
//  2. EVENT_IMAGE_RULES: a word in the English title or address -> photo (not case sensitive)
// Photos are in public/images/events/. Card shape is 2:1 (1600 x 800).
export const EVENT_IMAGES = {
  // "event-address": "/images/events/file.webp",
};

export const EVENT_IMAGE_RULES = [
  { word: "annual", image: "/images/events/annual-event.webp" },
  { word: "iftech", image: "/images/events/iftech-2026.webp" },
  { word: "beauty", image: "/images/events/beauty-asia.webp" },
];

export function eventImage(slug, title = "") {
  if (EVENT_IMAGES[slug]) return EVENT_IMAGES[slug];
  const text = `${title} ${slug}`.toLowerCase();
  const rule = EVENT_IMAGE_RULES.find((r) => text.includes(r.word));
  return rule ? rule.image : "";
}
