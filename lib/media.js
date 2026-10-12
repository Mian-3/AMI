import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { MEDIA_DEFAULTS, mergeMedia } from "@/lib/mediaShared";

export { MEDIA_DEFAULTS };

// Server only. Returns the saved media settings merged over the defaults,
// or just the defaults when the database is unavailable.
export const getMedia = cache(async () => {
  const db = getDb();
  if (!db) return MEDIA_DEFAULTS;
  try {
    const rows = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, "media")).limit(1);
    return mergeMedia(rows[0]?.value);
  } catch (error) {
    console.error("[media] could not read media settings", error);
    return MEDIA_DEFAULTS;
  }
});
