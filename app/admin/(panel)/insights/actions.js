"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { validatePost } from "@/lib/insightsValidate";
import { getPosts as getStaticPosts } from "@/lib/insightsData";
import { getArticle as getStaticArticle } from "@/lib/insightsArticles";

function isDuplicate(error) {
  const code = error?.code ?? error?.cause?.code;
  const message = String(error?.cause?.message ?? error?.message ?? "");
  return code === "23505" || /duplicate key|unique/i.test(message);
}

// Refresh every public page that shows articles so changes appear immediately.
function refreshSite(...slugs) {
  revalidatePath("/admin/insights");
  for (const locale of ["en", "ar"]) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/insights`);
    for (const slug of slugs.filter(Boolean)) revalidatePath(`/${locale}/insights/${slug}`);
  }
}

export async function savePost(input) {
  // Server actions are public endpoints, so always check the session here.
  const session = await getSession();
  if (!session) return { ok: false, error: "You are signed out. Please log in again." };

  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };

  const checked = validatePost(input);
  if (!checked.ok) return checked;
  const { slug, status, imageUrl, data } = checked.value;
  const { posts } = schema;

  try {
    if (input.id) {
      const id = Number(input.id);
      const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
      const existing = rows[0];
      if (!existing) return { ok: false, error: "Article not found." };

      const publishedAt = status === "published" ? existing.publishedAt ?? new Date() : existing.publishedAt;
      await db
        .update(posts)
        .set({ slug, status, imageUrl, data, publishedAt, updatedAt: new Date() })
        .where(eq(posts.id, id));
      refreshSite(slug, existing.slug);
      return { ok: true, id };
    }

    const [row] = await db
      .insert(posts)
      .values({ slug, status, imageUrl, data, publishedAt: status === "published" ? new Date() : null })
      .returning({ id: posts.id });
    refreshSite(slug);
    return { ok: true, id: row.id };
  } catch (error) {
    if (isDuplicate(error)) return { ok: false, error: "That slug is already used by another article." };
    console.error("[savePost]", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

export async function deletePost(formData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const db = getDb();
  const id = Number(formData.get("id"));
  if (db && Number.isInteger(id)) {
    const rows = await db.select({ slug: schema.posts.slug }).from(schema.posts).where(eq(schema.posts.id, id)).limit(1);
    await db.delete(schema.posts).where(eq(schema.posts.id, id));
    refreshSite(rows[0]?.slug);
  }
  redirect("/admin/insights");
}

// One time helper: copies the existing starter articles into the database so they
// can be edited or deleted from the dashboard. Safe to run twice (existing slugs are skipped).
export async function importStarterPosts() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const db = getDb();
  if (!db) redirect("/admin/insights");

  const enPosts = getStaticPosts("en");
  const arPosts = getStaticPosts("ar");

  for (let i = 0; i < enPosts.length; i++) {
    const en = enPosts[i];
    const ar = arPosts[i];
    const enArticle = getStaticArticle(en.slug, "en");
    const arArticle = getStaticArticle(en.slug, "ar");

    const checked = validatePost({
      slug: en.slug,
      status: "published",
      imageUrl: enArticle.heroImage || en.image,
      category: en.category,
      data: {
        en: { title: en.title, excerpt: en.excerpt, readTime: en.readTime, tags: enArticle.tags, body: enArticle.body },
        ar: { title: ar.title, excerpt: ar.excerpt, readTime: ar.readTime, tags: arArticle.tags, body: arArticle.body },
      },
    });
    if (!checked.ok) {
      console.error("[importStarterPosts] skipped", en.slug, checked.error);
      continue;
    }
    const { slug, status, imageUrl, data } = checked.value;
    // Newest first, in the same order as the old list.
    const publishedAt = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    try {
      await db.insert(schema.posts).values({ slug, status, imageUrl, data, publishedAt }).onConflictDoNothing();
    } catch (error) {
      console.error("[importStarterPosts]", en.slug, error);
    }
  }

  refreshSite();
  redirect("/admin/insights");
}
