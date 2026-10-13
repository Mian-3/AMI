// Server only. Reads events from the database.
// Until the owner imports or saves an event in Admin > Events, the starter events are shown,
// so the page is never empty by accident. After that the database is the single source.

import { cache } from "react";
import { asc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { DEFAULT_EVENTS, buildEvents } from "@/lib/eventsData";

export const EVENTS_META_KEY = "eventsMeta";

export function rowToRaw(row) {
  return {
    id: row.id,
    slug: row.slug,
    date: row.eventDate ? new Date(row.eventDate).toISOString().slice(0, 10) : "2026-01-01",
    image: row.imageUrl,
    heroImage: row.data?.heroImage || "",
    title: { en: row.data?.en?.title || "", ar: row.data?.ar?.title || "" },
    location: { en: row.data?.en?.location || "", ar: row.data?.ar?.location || "" },
    sortOrder: row.sortOrder,
    status: row.status,
  };
}

const loadRaw = cache(async () => {
  const db = getDb();
  if (!db) return DEFAULT_EVENTS;
  try {
    const rows = await db.select().from(schema.events).orderBy(asc(schema.events.eventDate), asc(schema.events.sortOrder));
    const meta = await db.select({ key: schema.siteContent.key }).from(schema.siteContent).where(eq(schema.siteContent.key, EVENTS_META_KEY)).limit(1);
    const managed = rows.length > 0 || meta.length > 0;
    if (!managed) return DEFAULT_EVENTS;
    return rows.filter((r) => r.status === "published" && r.imageUrl).map(rowToRaw);
  } catch (error) {
    console.error("[events] could not read events", error);
    return DEFAULT_EVENTS;
  }
});

export async function getLiveEvents(locale) {
  return buildEvents(await loadRaw(), locale);
}
