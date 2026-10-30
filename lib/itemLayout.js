// Which cards, logos and tabs are hidden, deleted or reordered. Safe for server and client code.
// Items are identified by "<listId>.<original index>", so editing text never loses a setting.
export const ITEM_KEY = "layout:items";

// Process page: up to 8 steps, 4 parts each (index = step * 4 + part).
const STEP_PARTS = ["Sub heading", "Our focus list", "Outcome line", "Image or video box"];
const PROCESS_PART_LABELS = Array.from({ length: 8 }, (_, i) => STEP_PARTS.map((p) => `Step ${i + 1}: ${p}`)).flat();

// Lists the admin can arrange. `max` guards the index range.
export const ITEM_LISTS = {
  "home.stats": { section: "home.stats", label: "Statistic cards" },
  "home.clients": { section: "home.clients", label: "Client logos" },
  "home.industries": { section: "home.industries", label: "Industry tabs" },
  "home.certifications": { section: "home.certifications", label: "Certification badges" },
  "flavours.food": { section: "flavours.food", label: "Flavour tabs" },
  "flavours.fragrance": { section: "flavours.fragrance", label: "Fragrance tabs" },
  "home.expertise": { section: "home.expertise", label: "Expertise cards" },
  "home.expertiseBg": { section: "home.expertise", label: "Parts", parts: ["Section background"] },
  "home.process": { section: "home.process", label: "Process steps" },
  "home.processBg": { section: "home.process", label: "Parts", parts: ["Background image"] },
  "home.insights": { section: "home.insights", label: "Article cards" },
  "about.hero": { section: "about.hero", label: "Parts", parts: ["Heading and text", "Banner image"] },
  "about.journey": { section: "about.journey", label: "Parts", parts: ["Heading and text", "Certificate cards", "Buttons"] },
  "about.meaning": { section: "about.meaning", label: "Parts", parts: ["Heading and text", "A and M boxes"] },
  "about.leadership": { section: "about.leadership", label: "Parts", parts: ["Heading and text", "Team cards"] },
  "about.team": { section: "about.leadership", label: "Team members" },
  "process.steps": { section: "process.steps", label: "Steps (order, hide, delete)" },
  "process.parts": { section: "process.steps", label: "Parts of each step", parts: PROCESS_PART_LABELS },
  "downloads.hero": { section: "downloads.hero", label: "Parts", parts: ["Heading and text", "Banner image"] },
};

// true when a fixed part of a section (see ITEM_LISTS parts) should be on the page.
export function partShown(state, listId, index) {
  const id = `${listId}.${index}`;
  return !(state?.hidden || []).includes(id) && !(state?.deleted || []).includes(id);
}

export const EMPTY_ITEMS = { hidden: [], deleted: [], order: {} };

export function cleanItems(v) {
  const x = v && typeof v === "object" ? v : {};
  const id = (s) => typeof s === "string" && /^[a-z]+\.[A-Za-z]+\.\d{1,3}$/.test(s) && s.replace(/\.\d+$/, "") in ITEM_LISTS;
  const order = {};
  for (const [k, arr] of Object.entries(x.order && typeof x.order === "object" ? x.order : {})) {
    if (k in ITEM_LISTS && Array.isArray(arr)) order[k] = [...new Set(arr.filter((n) => Number.isInteger(n) && n >= 0 && n < 200))];
  }
  return {
    hidden: Array.isArray(x.hidden) ? x.hidden.filter(id) : [],
    deleted: Array.isArray(x.deleted) ? x.deleted.filter(id) : [],
    order,
  };
}

// The visible items of a list in their saved order, each with its original index `i`.
export function arrange(state, listId, arr) {
  const s = state || EMPTY_ITEMS;
  const list = Array.isArray(arr) ? arr : [];
  const off = new Set([...(s.hidden || []), ...(s.deleted || [])]);
  const saved = (s.order?.[listId] || []).filter((i) => i < list.length);
  const rest = list.map((_, i) => i).filter((i) => !saved.includes(i));
  return [...saved, ...rest].filter((i) => !off.has(`${listId}.${i}`)).map((i) => ({ item: list[i], i }));
}
