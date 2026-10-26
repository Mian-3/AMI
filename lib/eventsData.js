// Shared (safe for client and server). The DEFAULT_EVENTS below are the starter events.
// Once the owner opens Admin > Events and imports them, the database takes over (see lib/eventsServer.js).
// Dates are ISO (YYYY-MM-DD) and are formatted per language automatically.
// heroImage is optional: it is used on the big top banner when the event is the first one.
export const DEFAULT_EVENTS = [
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

// "18 June 2026" for one day, "18-20 June 2026" (Intl range) for several days.
function formatEventRange(start, end, locale, month) {
  if (!end || end <= start) return formatEventDate(start, locale, month);
  const tag = locale === "ar" ? "ar-u-nu-latn-ca-gregory" : "en-GB";
  const fmt = new Intl.DateTimeFormat(tag, { day: "numeric", month, year: "numeric", timeZone: "UTC" });
  return fmt.formatRange(new Date(`${start}T00:00:00Z`), new Date(`${end}T00:00:00Z`));
}

// Today in Pakistan (UTC+5) as YYYY-MM-DD. An event stays "upcoming" until the end of its last day.
export function todayIso() {
  return new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10);
}

// Where an event's arrow button goes. Detail pages are not designed yet, so it stays "#".
// When the event detail page exists, change only this line to: `/${locale}/events/${event.slug}`
export function eventHref(locale, event) {
  return "#";
}

// Turns a list of raw events ({ date, image, heroImage?, title:{en,ar}, location:{en,ar} })
// into the shape the page components use. Empty Arabic text falls back to English.
export function buildEvents(list, locale) {
  const lang = locale === "ar" ? "ar" : "en";
  return list
    .map((e, index) => ({
      id: e.id,
      slug: e.slug,
      image: e.image,
      heroImage: e.heroImage || e.image,
      title: e.title?.[lang] || e.title?.en || "",
      location: e.location?.[lang] || e.location?.en || "",
      dateIso: e.date,
      endIso: e.endDate && e.endDate > e.date ? e.endDate : e.date,
      dateShort: formatEventRange(e.date, e.endDate, locale, "short"),
      dateLong: formatEventRange(e.date, e.endDate, locale, "long"),
      order: e.sortOrder ?? index,
    }))
    .sort((a, b) => a.dateIso.localeCompare(b.dateIso) || a.order - b.order);
}

// Starter events only (no database). Kept so older imports keep working.
export function getEvents(locale) {
  return buildEvents(DEFAULT_EVENTS, locale);
}

// Splits events into the banner event, the upcoming ones (soonest first) and the finished ones (latest first).
// The banner is the next event to happen; when nothing is coming up it is the most recent finished event.
// With `heroOn` false (banner hidden in the admin) the banner event goes back into its list.
export function splitEvents(events, today = todayIso(), heroOn = true) {
  const upcoming = events.filter((e) => e.endIso >= today).sort((a, b) => a.dateIso.localeCompare(b.dateIso) || a.order - b.order);
  const past = events.filter((e) => e.endIso < today).sort((a, b) => b.endIso.localeCompare(a.endIso) || b.order - a.order);
  const hero = upcoming[0] || past[0] || null;
  if (!hero || !heroOn) return { hero, upcoming, past, showHero: false };
  return {
    hero,
    upcoming: upcoming.filter((e) => e !== hero),
    past: past.filter((e) => e !== hero),
    showHero: true,
  };
}
