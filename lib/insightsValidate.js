// Validation and cleaning for Insights articles saved from the admin.
// Never trust the browser: every field is trimmed, typed and length limited here.

const LOCALES = ["en", "ar"];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const CATEGORY_KEYS = ["fragrances", "flavours", "rd", "process"];

function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function url(value) {
  const v = text(value, 600);
  if (!v) return "";
  return v.startsWith("https://") || v.startsWith("/") ? v : "";
}

function cleanTags(value) {
  const list = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[,،]/) : [];
  return list.map((t) => text(t, 40)).filter(Boolean).slice(0, 8);
}

function cleanItems(items) {
  const out = [];
  for (const item of (Array.isArray(items) ? items : []).slice(0, 30)) {
    if (typeof item === "string") {
      if (text(item, 500)) out.push({ title: "", text: text(item, 500) });
      continue;
    }
    if (!item || typeof item !== "object") continue;
    const title = text(item.title, 120);
    const body = text(item.text, 500);
    if (title || body) out.push({ title, text: body });
  }
  return out;
}

export function cleanBlocks(blocks) {
  if (!Array.isArray(blocks)) return [];
  const out = [];
  for (const b of blocks.slice(0, 80)) {
    if (!b || typeof b !== "object") continue;
    switch (b.type) {
      case "h":
        if (text(b.text, 200)) out.push({ type: "h", text: text(b.text, 200) });
        break;
      case "p":
        if (text(b.text, 4000)) out.push({ type: "p", text: text(b.text, 4000) });
        break;
      case "list": {
        const items = cleanItems(b.items);
        if (items.length) out.push({ type: "list", intro: text(b.intro, 300), items });
        break;
      }
      case "callout":
        if (text(b.text, 1500) || text(b.title, 200)) {
          out.push({ type: "callout", title: text(b.title, 200), text: text(b.text, 1500) });
        }
        break;
      case "quote":
        if (text(b.text, 1000)) out.push({ type: "quote", text: text(b.text, 1000), author: text(b.author, 200) });
        break;
      case "image":
        if (url(b.src)) out.push({ type: "image", src: url(b.src), caption: text(b.caption, 300) });
        break;
      default:
        break;
    }
  }
  return out;
}

export function validatePost(input) {
  if (!input || typeof input !== "object") return { ok: false, error: "Invalid request." };

  const status = input.status === "published" ? "published" : "draft";
  const slug = text(input.slug, 120).toLowerCase();
  if (!SLUG_RE.test(slug)) {
    return { ok: false, error: "Slug can only use lowercase letters, numbers and hyphens (for example: my-first-article)." };
  }

  const category = CATEGORY_KEYS.includes(input.category) ? input.category : "";
  const imageUrl = url(input.imageUrl);

  const data = {};
  for (const locale of LOCALES) {
    const src = input.data?.[locale] || {};
    data[locale] = {
      title: text(src.title, 200),
      category,
      excerpt: text(src.excerpt, 400),
      readTime: text(src.readTime, 40),
      tags: cleanTags(src.tags),
      body: cleanBlocks(src.body),
    };
  }

  if (!data.en.title) return { ok: false, error: "The English title is required." };
  if (status === "published") {
    if (!data.ar.title) return { ok: false, error: "Add the Arabic title before publishing, or save as draft." };
    if (!category) return { ok: false, error: "Choose a category before publishing." };
    if (!imageUrl) return { ok: false, error: "Add a cover image before publishing." };
  }

  return { ok: true, value: { slug, status, imageUrl, data } };
}
