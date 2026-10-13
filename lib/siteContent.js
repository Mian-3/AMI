// Site text overrides.
// The dictionary files stay the default. The admin only stores what it changed,
// and getDictionary() merges those changes on top. If the database is empty or
// unreachable, the site shows the default text, so it never breaks.

import { cache } from "react";
import { getDb, schema } from "@/db";

// Which dictionary sections can be edited, grouped by page. `omit` hides keys that are managed elsewhere.
export const GROUPS = [
  {
    id: "home",
    label: "Home page",
    sections: [
      { key: "hero", label: "Hero" },
      { key: "intro", label: "Introduction" },
      { key: "stats", label: "Statistics" },
      { key: "clients", label: "Clients" },
      { key: "expertise", label: "Expertise" },
      { key: "process", label: "Process" },
      { key: "industries", label: "Industries" },
      { key: "events", label: "Events section" },
      { key: "insights", label: "Insights section", omit: ["items"] },
      { key: "certifications", label: "Certifications" },
    ],
  },
  { id: "flavours", label: "Flavours & Fragrances page", sections: [{ key: "flavoursPage", label: "Flavours & Fragrances" }] },
  { id: "about", label: "About page", sections: [{ key: "about", label: "About us" }] },
  { id: "contact", label: "Contact page", sections: [{ key: "contactPage", label: "Contact page" }] },
  {
    id: "insights",
    label: "Insights pages",
    sections: [
      { key: "insightsPage", label: "Insights listing" },
      { key: "insightArticle", label: "Article page" },
    ],
  },
  {
    id: "global",
    label: "Header, footer and shared",
    sections: [
      { key: "nav", label: "Navigation menu" },
      { key: "buttons", label: "Buttons" },
      { key: "footer", label: "Footer" },
      { key: "whatsapp", label: "WhatsApp button" },
      { key: "eventsPage", label: "Events page" },
    ],
  },
];

export const SECTION_MAP = Object.fromEntries(GROUPS.flatMap((g) => g.sections.map((s) => [s.key, { ...s, group: g.label }])));

export function isObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

// The part of a section the admin is allowed to edit.
export function editableShape(sectionKey, base) {
  const omit = SECTION_MAP[sectionKey]?.omit || [];
  if (!isObject(base)) return base;
  return Object.fromEntries(Object.entries(base).filter(([k]) => !omit.includes(k)));
}

// Objects merge key by key. Arrays and strings are replaced.
export function deepMerge(base, override) {
  if (override === undefined) return base;
  if (isObject(base) && isObject(override)) {
    const out = { ...base };
    for (const key of Object.keys(override)) out[key] = deepMerge(base[key], override[key]);
    return out;
  }
  return override;
}

// Smallest override that turns `base` into `current`. Returns undefined when nothing changed.
export function diffShape(base, current) {
  if (isObject(base) && isObject(current)) {
    const out = {};
    for (const key of Object.keys(base)) {
      const d = diffShape(base[key], current[key]);
      if (d !== undefined) out[key] = d;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return JSON.stringify(base) === JSON.stringify(current) ? undefined : current;
}

const IMAGE_KEY = /image$/i;

function safeUrl(value) {
  return typeof value === "string" && (value.startsWith("https://") || value.startsWith("/")) ? value.slice(0, 600) : null;
}

// Rebuilds `value` so it has exactly the same shape as `base`. Anything unexpected is dropped.
// A text field that is cleared falls back to its default so the site can never go blank.
export function sanitizeToShape(base, value, key = "") {
  if (typeof base === "string") {
    if (typeof value !== "string") return base;
    const v = value.trim().slice(0, 2000);
    if (!v) return base;
    if (IMAGE_KEY.test(key)) return safeUrl(v) ?? base;
    return v;
  }
  if (Array.isArray(base)) {
    const src = Array.isArray(value) ? value : [];
    if (base.every((b) => typeof b === "string")) {
      const items = src.filter((x) => typeof x === "string").map((x) => x.trim().slice(0, 500)).filter(Boolean).slice(0, 30);
      return items.length ? items : base;
    }
    // Lists of objects keep their count (they are tied to the page layout).
    return base.map((b, i) => sanitizeToShape(b, src[i], key));
  }
  if (isObject(base)) {
    const src = isObject(value) ? value : {};
    return Object.fromEntries(Object.keys(base).map((k) => [k, sanitizeToShape(base[k], src[k], k)]));
  }
  return base;
}

// { sectionKey: { en: {...}, ar: {...} } }, or {} when the database is unavailable.
export const getOverrides = cache(async () => {
  const db = getDb();
  if (!db) return {};
  try {
    const rows = await db.select().from(schema.siteContent);
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch (error) {
    console.error("[siteContent] could not read overrides", error);
    return {};
  }
});
