import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { STATS_KEY, sanitizeStats, toCards, defaultCards } from "@/lib/homeStats";

// Server only. The cards saved in the admin, or null when nothing is saved or the database is down.
export const getSavedStats = cache(async () => {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, STATS_KEY)).limit(1);
    return rows[0] ? sanitizeStats(rows[0].value?.items) : null;
  } catch (error) {
    console.error("[homeStats] could not read cards", error);
    return null;
  }
});

// Cards for the public site in the visitor's language.
export async function getHomeStats(locale, dict) {
  const saved = await getSavedStats();
  return saved ? toCards(saved, locale) : defaultCards(dict?.stats);
}
