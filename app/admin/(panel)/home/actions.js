"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { STATS_KEY, sanitizeStats } from "@/lib/homeStats";

function refreshSite() {
  revalidatePath("/", "layout");
}

export async function saveHomeStats(items) {
  const session = await getSession("content");
  if (!session) return { ok: false, error: "You are signed out or do not have access." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };

  const clean = sanitizeStats(items);
  if (!clean) return { ok: false, error: "Add at least one card with a name." };

  try {
    const value = { items: clean };
    await db
      .insert(schema.siteContent)
      .values({ key: STATS_KEY, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: schema.siteContent.key, set: { value, updatedAt: new Date() } });
    refreshSite();
    await logActivity(session, "Edited Home statistics", `${clean.length} cards`, "content");
    return { ok: true, items: clean };
  } catch (error) {
    console.error("[saveHomeStats]", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

export async function resetHomeStats() {
  const session = await getSession("content");
  if (!session) return { ok: false, error: "You are signed out or do not have access." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };
  try {
    await db.delete(schema.siteContent).where(eq(schema.siteContent.key, STATS_KEY));
    refreshSite();
    await logActivity(session, "Reset Home statistics to default", "", "content");
    return { ok: true };
  } catch (error) {
    console.error("[resetHomeStats]", error);
    return { ok: false, error: "Could not reset. Please try again." };
  }
}
