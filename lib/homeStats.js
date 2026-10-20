// Home page "Statistics" cards. Safe to import from server and client code.
// The cards are stored in the admin (Home page > Statistics). Until something is saved, the default cards below are used.

export const STATS_KEY = "homeStats";
export const MAX_STATS = 12;

export const ICON_IDS = ["established", "products", "clients", "globe", "team", "area", "award", "flask", "factory", "truck", "star", "shield", "leaf", "clock"];

// `key` points at the label in the dictionary (dict.stats[key]).
export const DEFAULT_STATS = [
  { icon: "established", value: "2004", key: "established" },
  { icon: "products", value: "2500+", key: "products" },
  { icon: "clients", value: "3500+", key: "clients" },
  { icon: "globe", value: "6", key: "countriesInOperations" },
  { icon: "team", value: "100+", key: "teamMembers" },
  { icon: "area", value: "100,000+", key: "coveredArea" },
];

// Default cards in the shape the admin form uses.
export function defaultItems(statsEn = {}, statsAr = {}) {
  return DEFAULT_STATS.map((d) => ({
    icon: d.icon,
    value: d.value,
    labelEn: statsEn[d.key] || d.key,
    labelAr: statsAr[d.key] || statsEn[d.key] || d.key,
  }));
}

// Cleans whatever was sent. Returns null when no usable card is left.
export function sanitizeStats(input) {
  const src = Array.isArray(input) ? input : [];
  const out = [];
  for (const raw of src) {
    if (!raw || typeof raw !== "object") continue;
    const labelEn = typeof raw.labelEn === "string" ? raw.labelEn.trim().slice(0, 60) : "";
    const labelAr = typeof raw.labelAr === "string" ? raw.labelAr.trim().slice(0, 60) : "";
    if (!labelEn && !labelAr) continue;
    const value = typeof raw.value === "string" || typeof raw.value === "number" ? String(raw.value).trim().slice(0, 14) : "";
    out.push({
      icon: ICON_IDS.includes(raw.icon) ? raw.icon : "star",
      value: value || "0",
      labelEn: labelEn || labelAr,
      labelAr: labelAr || labelEn,
    });
    if (out.length >= MAX_STATS) break;
  }
  return out.length ? out : null;
}

export function toCards(items, locale) {
  const ar = locale === "ar";
  return items.map((i) => ({ icon: i.icon, value: i.value, label: ar ? i.labelAr : i.labelEn }));
}

// Cards built from the dictionary text (used until the admin saves its own).
export function defaultCards(dictStats = {}) {
  return DEFAULT_STATS.map((d) => ({ icon: d.icon, value: d.value, label: dictStats[d.key] || d.key }));
}
