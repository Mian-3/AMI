"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { LAYOUT_KEY, LAYOUT_PAGES, ALL_SECTION_IDS } from "@/lib/sectionRegistry";

const LABELS = Object.fromEntries(LAYOUT_PAGES.flatMap((p) => p.sections.map(([k, l]) => [`${p.id}.${k}`, `${p.label}: ${l}`])));

// state: "shown" | "hidden" | "deleted". Hidden and deleted sections leave the website at once and the
// sections below move up. Nothing is erased, so a section can always be brought back.
export async function setSectionState(id, state) {
  const session = await getSession("content");
  if (!session) return { ok: false, error: "You are signed out. Please log in again." };
  if (!ALL_SECTION_IDS.includes(id) || !["shown", "hidden", "deleted"].includes(state)) return { ok: false, error: "Unknown section." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };

  try {
    const [row] = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, LAYOUT_KEY)).limit(1);
    const cur = row?.value || {};
    const strip = (a) => (Array.isArray(a) ? a.filter((x) => x !== id && ALL_SECTION_IDS.includes(x)) : []);
    const value = { hidden: strip(cur.hidden), deleted: strip(cur.deleted) };
    if (state === "hidden") value.hidden.push(id);
    if (state === "deleted") value.deleted.push(id);
    await db
      .insert(schema.siteContent)
      .values({ key: LAYOUT_KEY, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: schema.siteContent.key, set: { value, updatedAt: new Date() } });
    revalidatePath("/", "layout");
    const verb = { shown: "Showed section", hidden: "Hid section", deleted: "Deleted section" }[state];
    await logActivity(session, verb, LABELS[id] || id, "content");
    return { ok: true, state };
  } catch (error) {
    console.error("[setSectionState]", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}
