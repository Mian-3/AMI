"use server";

import { revalidatePath } from "next/cache";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { DOWNLOADS_KEY } from "@/lib/downloadsData";

const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const safeUrl = (v) => {
  const u = clean(v, 600);
  return u.startsWith("https://") || (u.startsWith("/") && !u.startsWith("//")) ? u : "";
};

export async function saveDownloads(input) {
  const session = await getSession("downloads");
  if (!session) return { ok: false, error: "You are signed out. Please log in again." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };

  const list = Array.isArray(input) ? input.slice(0, 60) : [];
  const items = [];
  for (let i = 0; i < list.length; i++) {
    const it = list[i] || {};
    const title = { en: clean(it.title?.en, 160), ar: clean(it.title?.ar, 160) };
    const desc = { en: clean(it.desc?.en, 400), ar: clean(it.desc?.ar, 400) };
    const file = safeUrl(it.file);
    const icon = safeUrl(it.icon);
    const published = Boolean(it.published);
    if (!title.en) return { ok: false, error: `Block ${i + 1}: English title is required.` };
    if (published && !file) return { ok: false, error: `Block ${i + 1}: upload a PDF, or untick "Show on website".` };
    const id = clean(it.id, 40).replace(/[^a-z0-9-_]/gi, "") || `doc-${Date.now().toString(36)}-${i}`;
    items.push({ id, published, file, icon, title, desc });
  }

  try {
    const value = { items };
    await db
      .insert(schema.siteContent)
      .values({ key: DOWNLOADS_KEY, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: schema.siteContent.key, set: { value, updatedAt: new Date() } });
    revalidatePath("/admin/downloads");
    revalidatePath("/", "layout");
    await logActivity(session, "Edited downloads", `${items.length} document${items.length === 1 ? "" : "s"}`, "downloads");
    return { ok: true };
  } catch (error) {
    console.error("[saveDownloads]", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}
