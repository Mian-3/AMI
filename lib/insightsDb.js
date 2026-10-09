// Reads published Insights articles from the database for the public site.
// If the database is not configured or cannot be reached, the old file based
// articles are used instead, so the public site never breaks.

import { desc, eq, and } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getPosts as getStaticPosts } from "@/lib/insightsData";
import { getArticle as getStaticArticle } from "@/lib/insightsArticles";

export const CATEGORY_KEYS = ["fragrances", "flavours", "rd", "process"];

function formatDate(value, locale) {
  if (!value) return "";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Karachi",
  }).format(new Date(value));
}

function pick(row, locale) {
  const en = row.data?.en || {};
  const loc = row.data?.[locale] || {};
  return {
    title: loc.title || en.title || "",
    excerpt: loc.excerpt || en.excerpt || "",
    readTime: loc.readTime || en.readTime || "",
    tags: Array.isArray(loc.tags) && loc.tags.length ? loc.tags : [],
    body: Array.isArray(loc.body) && loc.body.length ? loc.body : Array.isArray(en.body) ? en.body : [],
    category: CATEGORY_KEYS.includes(en.category) ? en.category : CATEGORY_KEYS.includes(loc.category) ? loc.category : "flavours",
  };
}

function toCard(row, locale) {
  const p = pick(row, locale);
  return {
    id: `db-${row.id}`,
    slug: row.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    readTime: p.readTime,
    date: formatDate(row.publishedAt ?? row.updatedAt, locale),
    image: row.imageUrl,
  };
}

// Returns an array of rows, or null when the database is unavailable.
async function fetchPublished() {
  const db = getDb();
  if (!db) return null;
  try {
    return await db
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.status, "published"))
      .orderBy(desc(schema.posts.publishedAt));
  } catch (error) {
    console.error("[insightsDb] could not read posts", error);
    return null;
  }
}

export async function getAllPosts(locale) {
  const rows = await fetchPublished();
  if (rows === null) return getStaticPosts(locale);
  return rows.filter((r) => r.imageUrl).map((r) => toCard(r, locale));
}

export async function getLatestPosts(locale, count = 3) {
  const all = await getAllPosts(locale);
  return all.slice(0, count);
}

// Everything the article page needs. Returns null when the article does not exist.
export async function getPostBySlug(slug, locale) {
  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(schema.posts)
        .where(and(eq(schema.posts.slug, slug), eq(schema.posts.status, "published")))
        .limit(1);
      const row = rows[0];
      if (!row) return null;
      const p = pick(row, locale);
      return { ...toCard(row, locale), tags: p.tags, body: p.body };
    } catch (error) {
      console.error("[insightsDb] could not read post", error);
    }
  }
  // Database unavailable: fall back to the file based article.
  const card = getStaticPosts(locale).find((x) => x.slug === slug);
  if (!card) return null;
  const article = getStaticArticle(slug, locale);
  return { ...card, image: article.heroImage || card.image, tags: article.tags, body: article.body };
}
