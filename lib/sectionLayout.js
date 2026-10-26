// Server only. Which sections are hidden or deleted. Stored in site_content under one key,
// so no database change is needed. If the database is unreachable every section shows.
import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { LAYOUT_KEY, ALL_SECTION_IDS } from "@/lib/sectionRegistry";

export const getLayout = cache(async () => {
  const db = getDb();
  if (!db) return { hidden: [], deleted: [] };
  try {
    const [row] = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, LAYOUT_KEY)).limit(1);
    const v = row?.value || {};
    const ok = (a) => (Array.isArray(a) ? a.filter((id) => ALL_SECTION_IDS.includes(id)) : []);
    return { hidden: ok(v.hidden), deleted: ok(v.deleted) };
  } catch (error) {
    console.error("[sectionLayout] could not read", error);
    return { hidden: [], deleted: [] };
  }
});

// true when the section should be on the page.
export function shown(layout, id) {
  return !layout.hidden.includes(id) && !layout.deleted.includes(id);
}
