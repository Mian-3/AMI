// Server only. Reads the saved item layout. Without a database nothing is hidden.
import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { ITEM_KEY, EMPTY_ITEMS, cleanItems } from "@/lib/itemLayout";

export const getItemLayout = cache(async () => {
  const db = getDb();
  if (!db) return EMPTY_ITEMS;
  try {
    const [row] = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, ITEM_KEY)).limit(1);
    return cleanItems(row?.value);
  } catch (error) {
    console.error("[itemLayout] could not read", error);
    return EMPTY_ITEMS;
  }
});
