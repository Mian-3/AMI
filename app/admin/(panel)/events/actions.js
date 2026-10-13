"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { DEFAULT_EVENTS } from "@/lib/eventsData";
import { EVENTS_META_KEY } from "@/lib/eventsServer";
import { slugify, validateEvent } from "@/lib/eventsValidate";

function refreshSite() {
  revalidatePath("/admin/events");
  revalidatePath("/admin");
  revalidatePath("/", "layout");
}

async function markManaged(db) {
  await db
    .insert(schema.siteContent)
    .values({ key: EVENTS_META_KEY, value: { managed: true }, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.siteContent.key, set: { value: { managed: true }, updatedAt: new Date() } });
}

function isDuplicate(error) {
  const code = error?.code ?? error?.cause?.code;
  return code === "23505" || /duplicate key|unique/i.test(String(error?.cause?.message ?? error?.message ?? ""));
}

export async function saveEvent(input) {
  const session = await getSession("events");
  if (!session) return { ok: false, error: "You are signed out. Please log in again." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };

  const checked = validateEvent(input);
  if (!checked.ok) return checked;
  const { status, date, image, data } = checked.value;
  const eventDate = new Date(`${date}T00:00:00Z`);
  const { events } = schema;

  try {
    // First time the owner touches events: take over from the starter events.
    const existingRows = await db.select({ id: events.id }).from(events).limit(1);
    if (existingRows.length === 0) await markManaged(db);

    if (input.id) {
      const id = Number(input.id);
      const found = await db.select({ id: events.id }).from(events).where(eq(events.id, id)).limit(1);
      if (!found[0]) return { ok: false, error: "Event not found." };
      await db.update(events).set({ status, eventDate, imageUrl: image, data, updatedAt: new Date() }).where(eq(events.id, id));
      refreshSite();
      await logActivity(session, status === "published" ? "Saved event (published)" : "Saved event (draft)", data.en.title, "events");
      return { ok: true, id };
    }

    const base = slugify(data.en.title) || "event";
    const slug = `${base}-${Math.random().toString(36).slice(2, 6)}`;
    const [row] = await db
      .insert(events)
      .values({ slug, status, eventDate, imageUrl: image, data })
      .returning({ id: events.id });
    refreshSite();
    await logActivity(session, status === "published" ? "Created event (published)" : "Created event (draft)", data.en.title, "events");
    return { ok: true, id: row.id };
  } catch (error) {
    if (isDuplicate(error)) return { ok: false, error: "Please try saving again." };
    console.error("[saveEvent]", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

export async function deleteEvent(formData) {
  const session = await getSession("events");
  if (!session) redirect("/admin/login");
  const db = getDb();
  const id = Number(formData.get("id"));
  if (db && Number.isInteger(id)) {
    const rows = await db.select().from(schema.events).where(eq(schema.events.id, id)).limit(1);
    await markManaged(db);
    await db.delete(schema.events).where(eq(schema.events.id, id));
    refreshSite();
    await logActivity(session, "Deleted event", rows[0]?.data?.en?.title || "", "events");
  }
  redirect("/admin/events");
}

// One time helper: copies the starter events into the database so they can be edited or deleted.
export async function importDefaultEvents() {
  const session = await getSession("events");
  if (!session) redirect("/admin/login");
  const db = getDb();
  if (!db) redirect("/admin/events");

  for (const e of DEFAULT_EVENTS) {
    try {
      await db
        .insert(schema.events)
        .values({
          slug: e.slug,
          status: "published",
          eventDate: new Date(`${e.date}T00:00:00Z`),
          imageUrl: e.image,
          sortOrder: e.id,
          data: { en: { title: e.title.en, location: e.location.en }, ar: { title: e.title.ar, location: e.location.ar }, heroImage: e.heroImage || "" },
        })
        .onConflictDoNothing();
    } catch (error) {
      console.error("[importDefaultEvents]", e.slug, error);
    }
  }
  await markManaged(db);
  refreshSite();
  await logActivity(session, "Imported starter events", "", "events");
  redirect("/admin/events");
}
