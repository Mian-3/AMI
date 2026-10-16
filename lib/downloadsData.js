// Server only. The Downloads list lives in the existing site_content table under one key,
// so no database change is needed. Until the first save in Admin > Downloads, the starter
// documents below are shown, so the page is never empty by accident.

import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export const DOWNLOADS_KEY = "downloads:items";
const SAMPLE = "/documents/downloads/sample-document.pdf";
export const DEFAULT_ICON = "/images/downloads/doc-icon.png";

export const DEFAULT_DOWNLOADS = [
  {
    id: "flavours-price-list",
    published: true,
    file: SAMPLE,
    title: { en: "Flavours Price List", ar: "قائمة أسعار النكهات" },
    desc: { en: "Explore available flavour products and their listed pricing.", ar: "استكشف منتجات النكهات المتاحة وأسعارها المعلنة." },
  },
  {
    id: "technical-resources",
    published: true,
    file: SAMPLE,
    title: { en: "Technical Resources", ar: "الموارد الفنية" },
    desc: { en: "Access available technical documents relevant to your product.", ar: "اطّلع على المستندات الفنية المتاحة المتعلقة بمنتجك." },
  },
  {
    id: "fragrances-price-list",
    published: true,
    file: SAMPLE,
    title: { en: "Fragrances Price List", ar: "قائمة أسعار العطور" },
    desc: { en: "Review available fragrance products and their listed pricing.", ar: "راجع منتجات العطور المتاحة وأسعارها المعلنة." },
  },
  {
    id: "product-catalogues",
    published: true,
    file: SAMPLE,
    title: { en: "Product Catalogues", ar: "كتالوجات المنتجات" },
    desc: { en: "Discover available product ranges and relevant product information.", ar: "اكتشف نطاقات المنتجات المتاحة والمعلومات ذات الصلة." },
  },
];

// All items (drafts included) for the admin editor.
export const getAllDownloads = cache(async () => {
  const db = getDb();
  if (!db) return DEFAULT_DOWNLOADS;
  try {
    const rows = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, DOWNLOADS_KEY)).limit(1);
    const items = rows[0]?.value?.items;
    return Array.isArray(items) ? items : DEFAULT_DOWNLOADS;
  } catch (error) {
    console.error("[downloads] could not read items", error);
    return DEFAULT_DOWNLOADS;
  }
});

// Published items with text for one language (falls back to English).
export async function getLiveDownloads(locale) {
  const lang = locale === "ar" ? "ar" : "en";
  const items = await getAllDownloads();
  return items
    .filter((i) => i.published && i.file)
    .map((i) => ({
      id: i.id,
      file: i.file,
      icon: i.icon || DEFAULT_ICON,
      title: i.title?.[lang] || i.title?.en || "",
      desc: i.desc?.[lang] || i.desc?.en || "",
    }))
    .filter((i) => i.title);
}
