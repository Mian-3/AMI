// Server only. The sections and item lists the admin can arrange, with labels and thumbnails.
import { getDictionary } from "@/lib/getDictionary";
import { getMedia } from "@/lib/media";
import { getSavedStats } from "@/lib/homeStatsServer";
import { defaultCards, toCards } from "@/lib/homeStats";
import { LAYOUT_PAGES } from "@/lib/sectionRegistry";
import { ITEM_LISTS } from "@/lib/itemLayout";
import { getLatestPosts } from "@/lib/insightsDb";

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
    case "home.expertise":
      return ["flavours", "fragrances"].map((k) => ({ label: dict.expertise?.items?.[k]?.title || k }));
    case "home.process":
      return ["rd", "application", "production", "qc"].map((k) => ({ label: dict.process?.steps?.[k]?.title || k }));
    case "process.steps": {
      const steps = dict.processPage?.steps || [];
      return steps.map((st, i) => ({ label: st.title ? `Step ${i + 1}: ${st.title}` : `Step ${i + 1} (empty spare, add a title to use it)`, thumb: st.image || undefined }));
    }
    case "home.insights": {
      const posts = await getLatestPosts("en", 4);
      return posts.map((p) => ({ label: p.title, thumb: p.image }));
    }
    case "about.team":
      return (dict.about?.team || []).map((m) => ({ label: m.name || "Member", thumb: m.image }));
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
      const base = meta.parts ? meta.parts.map((label) => ({ label })) : await listItems(listId);
      const items = base.map((it, i) => ({ i, ...it }));
      lists.push({ listId, label: meta.label, fixed: Boolean(meta.parts), items });
    }
    sections.push({ id: sectionId, label, lists });
  }
  return { page, sections };
}
