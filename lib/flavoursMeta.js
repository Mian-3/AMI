import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { META_KEY, FLAVOURS_META_DEFAULTS, sanitizeFlavoursMeta } from "@/lib/flavoursData";

// Server only. Saved card settings, or the defaults when nothing is saved or the database is down.
export const getFlavoursMeta = cache(async () => {
  const db = getDb();
  if (!db) return FLAVOURS_META_DEFAULTS;
  try {
    const rows = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, META_KEY)).limit(1);
    return rows[0] ? sanitizeFlavoursMeta(rows[0].value) : FLAVOURS_META_DEFAULTS;
  } catch (error) {
    console.error("[flavoursMeta] could not read settings", error);
    return FLAVOURS_META_DEFAULTS;
  }
});
