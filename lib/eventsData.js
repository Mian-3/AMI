// One entry per event. Dates are ISO (YYYY-MM-DD) and are formatted per language automatically.
// heroImage is optional: it is used on the big top banner when the event is the first one.
const EVENTS = [
  {
    id: 1,
    slug: "connecting-collaborating-growing-1",
    date: "2026-06-18",
    image: "/images/events/event-1.jpg",
    heroImage: "/images/events/event-hero.jpg",
    title: { en: "Connecting. Collaborating. Growing.", ar: "نتواصل. نتعاون. ننمو." },
    location: { en: "Expo Center in Lahore", ar: "مركز المعارض في لاهور" },
  },
  {
    id: 2,
    slug: "connecting-collaborating-growing-2",
    date: "2026-06-18",
    image: "/images/events/event-2.jpg",
    title: { en: "Connecting. Collaborating. Growing.", ar: "نتواصل. نتعاون. ننمو." },
    location: { en: "Expo Center in Lahore", ar: "مركز المعارض في لاهور" },
  },
  {
    id: 3,
    slug: "connecting-collaborating-growing-3",
    date: "2026-06-18",
    image: "/images/events/event-1.jpg",
    title: { en: "Connecting. Collaborating. Growing.", ar: "نتواصل. نتعاون. ننمو." },
    location: { en: "Expo Center in Lahore", ar: "مركز المعارض في لاهور" },
  },
  {
    id: 4,
    slug: "connecting-collaborating-growing-4",
    date: "2026-06-18",
    image: "/images/events/event-2.jpg",
    title: { en: "Connecting. Collaborating. Growing.", ar: "نتواصل. نتعاون. ننمو." },
    location: { en: "Expo Center in Lahore", ar: "مركز المعارض في لاهور" },
  },
  {
    id: 5,
    slug: "connecting-collaborating-growing-5",
    date: "2026-06-18",
    image: "/images/events/event-1.jpg",
    title: { en: "Connecting. Collaborating. Growing.", ar: "نتواصل. نتعاون. ننمو." },
    location: { en: "Expo Center in Lahore", ar: "مركز المعارض في لاهور" },
  },
];

function formatEventDate(iso, locale, month) {
  const tag = locale === "ar" ? "ar-u-nu-latn-ca-gregory" : "en-GB";
  return new Intl.DateTimeFormat(tag, { day: "numeric", month, year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`)
  );
}

// Where an event's arrow button goes. Detail pages are not designed yet, so it stays "#".
// When the event detail page exists, change only this line to: `/${locale}/events/${event.slug}`
export function eventHref(locale, event) {
  return "#";
}

export function getEvents(locale) {
  const lang = locale === "ar" ? "ar" : "en";
  return EVENTS.map((e) => ({
    id: e.id,
    slug: e.slug,
    image: e.image,
    heroImage: e.heroImage ?? e.image,
    title: e.title[lang],
    location: e.location[lang],
    dateIso: e.date,
    dateShort: formatEventDate(e.date, locale, "short"),
    dateLong: formatEventDate(e.date, locale, "long"),
  })).sort((a, b) => a.dateIso.localeCompare(b.dateIso));
}