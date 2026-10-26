// Which cards, logos and tabs are hidden, deleted or reordered. Safe for server and client code.
// Items are identified by "<listId>.<original index>", so editing text never loses a setting.
export const ITEM_KEY = "layout:items";

// Lists the admin can arrange. `max` guards the index range.
export const ITEM_LISTS = {
  "home.stats": { section: "home.stats", label: "Statistic cards" },
  "home.clients": { section: "home.clients", label: "Client logos" },
  "home.industries": { section: "home.industries", label: "Industry tabs" },
  "home.certifications": { section: "home.certifications", label: "Certification badges" },
  "flavours.food": { section: "flavours.food", label: "Flavour tabs" },
  "flavours.fragrance": { section: "flavours.fragrance", label: "Fragrance tabs" },
};

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
