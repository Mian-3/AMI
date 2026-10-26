// Server only. The sections and item lists the admin can arrange, with labels and thumbnails.
import { getDictionary } from "@/lib/getDictionary";
import { getMedia } from "@/lib/media";
import { getSavedStats } from "@/lib/homeStatsServer";
import { defaultCards, toCards } from "@/lib/homeStats";
import { LAYOUT_PAGES } from "@/lib/sectionRegistry";
import { ITEM_LISTS } from "@/lib/itemLayout";

const INDUSTRY_KEYS = [
  "confectionery", "baking", "beverages", "pharmaceutical", "frozenFood", "savory", "cupCake",
  "soap", "detergents", "cosmetics", "paints", "babySkinCare", "homeCare", "leatherCarCare",
];

async function listItems(listId) {
  const dict = await getDictionary("en");
  switch (listId) {
    case "home.stats": {
      const saved = await getSavedStats();
      const cards = saved ? toCards(saved, "en") : defaultCards(dict.stats);
      return cards.map((c) => ({ label: `${c.value}  ${c.label}` }));
    }
    case "home.clients": {
      const { clients } = await getMedia();
      return clients.map((c) => ({ label: c.name || "Logo", thumb: c.src }));
    }
    case "home.certifications": {
      const { certifications } = await getMedia();
      return certifications.map((c) => ({ label: c.alt || "Badge", thumb: c.image }));
    }
    case "home.industries":
      return INDUSTRY_KEYS.map((k) => ({ label: dict.industries?.items?.[k] || k }));
    case "flavours.food":
      return (dict.flavoursPage?.food?.items || []).map((c) => ({ label: c.title || "Card" }));
    case "flavours.fragrance":
      return (dict.flavoursPage?.fragrance?.items || []).map((c) => ({ label: c.title || "Card" }));
    default:
      return [];
  }
}

// [{ id, label, lists: [{ listId, label, items: [{ i, label, thumb }] }] }] for one page.
export async function getArrangeData(pageId) {
  const page = LAYOUT_PAGES.find((p) => p.id === pageId);
  if (!page) return null;
  const sections = [];
  for (const [key, label] of page.sections) {
    const sectionId = `${page.id}.${key}`;
    const lists = [];
    for (const [listId, meta] of Object.entries(ITEM_LISTS)) {
      if (meta.section !== sectionId) continue;
      const items = (await listItems(listId)).map((it, i) => ({ i, ...it }));
      lists.push({ listId, label: meta.label, items });
    }
    sections.push({ id: sectionId, label, lists });
  }
  return { page, sections };
}
