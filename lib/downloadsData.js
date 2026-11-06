// Server only. The Downloads page list is defined in this file (see DEFAULT_DOWNLOADS below).
// The admin Downloads editor no longer changes the public page.

import { cache } from "react";

export const DOWNLOADS_KEY = "downloads:items";
export const DEFAULT_ICON = "/images/downloads/doc-icon.png";

// The Downloads page list is kept here in the code, not in the admin.
// To add a document: put the PDF in public/documents/downloads/ and add one more block below.
export const DEFAULT_DOWNLOADS = [
  {
    id: "flavours-product-list",
    published: true,
    file: "/documents/downloads/flavours-product-list-2026.pdf",
    title: { en: "Flavours Product List", ar: "قائمة منتجات النكهات" },
    desc: { en: "Browse our flavour range with product form and solubility details.", ar: "تصفح مجموعة النكهات لدينا مع تفاصيل شكل المنتج وقابلية الذوبان." },
  },
  {
    id: "fragrances-product-list",
    published: true,
    file: "/documents/downloads/fragrances-product-list-2026.pdf",
    title: { en: "Fragrances Product List", ar: "قائمة منتجات العطور" },
    desc: { en: "Review our fragrance range with product form and solubility details.", ar: "راجع مجموعة العطور لدينا مع تفاصيل شكل المنتج وقابلية الذوبان." },
  },
  {
    id: "corporate-brochure",
    published: true,
    file: "/documents/downloads/corporate-brochure-2026.pdf",
    title: { en: "Corporate Brochure", ar: "الكتيّب التعريفي للشركة" },
    desc: { en: "Learn about A.M International, our capabilities and our commitment to quality.", ar: "تعرّف على A.M International وقدراتنا والتزامنا بالجودة." },
  },
  {
    id: "company-brochure",
    published: true,
    file: "/documents/downloads/company-brochure-2026.pdf",
    title: { en: "Company Introduction booklet", ar: "كتيّب الشركة" },
    desc: { en: "Our latest company brochure with our story, products and services.", ar: "أحدث كتيّب للشركة يتضمن قصتنا ومنتجاتنا وخدماتنا." },
  },
  {
    id: "company-introduction-booklet",
    published: true,
    file: "/documents/downloads/company-introduction-booklet.pdf",
    title: { en: "The World of Business", ar: "كتيّب التعريف بالشركة" },
    desc: { en: "A complete introduction to A.M International, our business and what we do.", ar: "تعريف شامل بشركة A.M International وأعمالنا وما نقدمه." },
  },
];

// All items (drafts included) for the admin editor.
export const getAllDownloads = cache(async () => {
  return DEFAULT_DOWNLOADS;
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
