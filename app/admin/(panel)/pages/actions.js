"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { ITEM_KEY, ITEM_LISTS, cleanItems } from "@/lib/itemLayout";
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

// ---------- items (cards, logos, tabs) ----------

async function readItems(db) {
  const [row] = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, ITEM_KEY)).limit(1);
  return cleanItems(row?.value);
}

async function writeItems(db, value) {
  await db
    .insert(schema.siteContent)
    .values({ key: ITEM_KEY, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.siteContent.key, set: { value, updatedAt: new Date() } });
  revalidatePath("/", "layout");
}

// state: "shown" | "hidden" | "deleted" for one item, e.g. ("home.clients", 3, "hidden").
export async function setItemState(listId, index, state) {
  const session = await getSession("content");
  if (!session) return { ok: false, error: "You are signed out. Please log in again." };
  if (!(listId in ITEM_LISTS) || !Number.isInteger(index) || index < 0 || index > 199 || !["shown", "hidden", "deleted"].includes(state)) return { ok: false, error: "Unknown item." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };
  try {
    const cur = await readItems(db);
    const id = `${listId}.${index}`;
    const value = { ...cur, hidden: cur.hidden.filter((x) => x !== id), deleted: cur.deleted.filter((x) => x !== id) };
    if (state === "hidden") value.hidden.push(id);
    if (state === "deleted") value.deleted.push(id);
    await writeItems(db, value);
    await logActivity(session, { shown: "Showed item", hidden: "Hid item", deleted: "Deleted item" }[state], `${ITEM_LISTS[listId].label} #${index + 1}`, "content");
    return { ok: true };
  } catch (error) {
    console.error("[setItemState]", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

// order: original indexes in the new order, e.g. [2, 0, 1, 3].
export async function setItemOrder(listId, order) {
  const session = await getSession("content");
  if (!session) return { ok: false, error: "You are signed out. Please log in again." };
  if (!(listId in ITEM_LISTS) || !Array.isArray(order) || order.length > 200) return { ok: false, error: "Unknown list." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };
  try {
    const cur = await readItems(db);
    const value = cleanItems({ ...cur, order: { ...cur.order, [listId]: order } });
    await writeItems(db, value);
    await logActivity(session, "Reordered items", ITEM_LISTS[listId].label, "content");
    return { ok: true };
  } catch (error) {
    console.error("[setItemOrder]", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}
