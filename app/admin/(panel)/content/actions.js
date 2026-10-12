"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { getDictionary as getBaseDictionary } from "@/lib/baseDictionary";
import { SECTION_MAP, editableShape, diffShape, sanitizeToShape } from "@/lib/siteContent";

function refreshSite() {
  // Every public page can show dictionary text, so refresh them all.
  revalidatePath("/", "layout");
}

export async function saveSection(sectionKey, input) {
  const session = await getSession();
  if (!session) return { ok: false, error: "You are signed out. Please log in again." };
  if (!SECTION_MAP[sectionKey]) return { ok: false, error: "Unknown section." };

  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };

  const value = {};
  for (const lang of ["en", "ar"]) {
    const base = editableShape(sectionKey, (await getBaseDictionary(lang))[sectionKey]);
    const clean = sanitizeToShape(base, input?.[lang]);
    const diff = diffShape(base, clean);
    if (diff !== undefined) value[lang] = diff;
  }

  try {
    if (Object.keys(value).length === 0) {
      await db.delete(schema.siteContent).where(eq(schema.siteContent.key, sectionKey));
    } else {
      await db
        .insert(schema.siteContent)
        .values({ key: sectionKey, value, updatedAt: new Date() })
        .onConflictDoUpdate({ target: schema.siteContent.key, set: { value, updatedAt: new Date() } });
    }
    refreshSite();
    return { ok: true };
  } catch (error) {
    console.error("[saveSection]", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

export async function resetSection(sectionKey) {
  const session = await getSession();
  if (!session) return { ok: false, error: "You are signed out. Please log in again." };
  if (!SECTION_MAP[sectionKey]) return { ok: false, error: "Unknown section." };

  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };

  try {
    await db.delete(schema.siteContent).where(eq(schema.siteContent.key, sectionKey));
    refreshSite();
    return { ok: true };
  } catch (error) {
    console.error("[resetSection]", error);
    return { ok: false, error: "Could not reset. Please try again." };
  }
}
