"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { META_KEY, sanitizeFlavoursMeta } from "@/lib/flavoursData";
import { logActivity } from "@/lib/activity";

function refreshSite() {
  revalidatePath("/", "layout");
}

export async function saveFlavoursMeta(input) {
  const session = await getSession("content");
  if (!session) return { ok: false, error: "You are signed out or do not have access." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };

  const value = sanitizeFlavoursMeta(input);
  try {
    await db
      .insert(schema.siteContent)
      .values({ key: META_KEY, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: schema.siteContent.key, set: { value, updatedAt: new Date() } });
    refreshSite();
    await logActivity(session, "Saved Flavours page cards", "", "content");
    return { ok: true };
  } catch (error) {
    console.error("[saveFlavoursMeta]", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

export async function resetFlavoursMeta() {
  const session = await getSession("content");
  if (!session) return { ok: false, error: "You are signed out or do not have access." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };
  try {
    await db.delete(schema.siteContent).where(eq(schema.siteContent.key, META_KEY));
    refreshSite();
    await logActivity(session, "Reset Flavours page cards to default", "", "content");
    return { ok: true };
  } catch (error) {
    console.error("[resetFlavoursMeta]", error);
    return { ok: false, error: "Could not reset. Please try again." };
  }
}
