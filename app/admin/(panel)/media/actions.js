"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { sanitizeMedia } from "@/lib/mediaShared";
import { logActivity } from "@/lib/activity";

export async function saveMedia(input) {
  const session = await getSession("media");
  if (!session) return { ok: false, error: "You are signed out. Please log in again." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };

  const value = sanitizeMedia(input);
  try {
    await db
      .insert(schema.siteContent)
      .values({ key: "media", value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: schema.siteContent.key, set: { value, updatedAt: new Date() } });
    revalidatePath("/", "layout");
    await logActivity(session, "Saved images and links", "", "media");
    return { ok: true };
  } catch (error) {
    console.error("[saveMedia]", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

export async function resetMedia() {
  const session = await getSession("media");
  if (!session) return { ok: false, error: "You are signed out. Please log in again." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };
  try {
    await db.delete(schema.siteContent).where(eq(schema.siteContent.key, "media"));
    revalidatePath("/", "layout");
    await logActivity(session, "Reset images and links to default", "", "media");
    return { ok: true };
  } catch (error) {
    console.error("[resetMedia]", error);
    return { ok: false, error: "Could not reset. Please try again." };
  }
}
