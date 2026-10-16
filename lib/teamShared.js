// Shared (client and server safe) constants for the team and access system.

export const SECTIONS = [
  { key: "insights", label: "Insights", hint: "Articles and blog posts" },
  { key: "content", label: "Site content", hint: "Text on every page, English and Arabic" },
  { key: "media", label: "Media and links", hint: "Catalogue, hero, logos, social and footer links" },
  { key: "enquiries", label: "Enquiries", hint: "Messages from the contact form" },
  { key: "events", label: "Events", hint: "Events calendar" },
  { key: "downloads", label: "Downloads", hint: "PDF documents on the Downloads page" },
];

export const SECTION_KEYS = SECTIONS.map((s) => s.key);

export const PRESETS = [
  { key: "full", label: "Full access (all sections)", sections: SECTION_KEYS },
  { key: "content", label: "Content editor (Insights, Site content, Media, Downloads)", sections: ["insights", "content", "media", "downloads"] },
  { key: "marketing", label: "Marketing (Insights, Events)", sections: ["insights", "events"] },
  { key: "sales", label: "Sales (Enquiries only)", sections: ["enquiries"] },
  { key: "custom", label: "Custom (tick sections below)", sections: [] },
];

export function cleanSections(input) {
  const list = Array.isArray(input) ? input : [];
  return SECTION_KEYS.filter((k) => list.includes(k));
}
