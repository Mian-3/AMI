import { cache } from "react";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { FOOTER_KEY, sanitizeFooterContact } from "@/lib/footerContact";

// Server only. Saved footer contacts, or null when nothing is saved or the database is down.
export const getSavedFooterContact = cache(async () => {
  const db = getDb();
  if (!db) return null;
  try {
    const rows = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, FOOTER_KEY)).limit(1);
    return rows[0] ? sanitizeFooterContact(rows[0].value) : null;
  } catch (error) {
    console.error("[footerContact] could not read contacts", error);
    return null;
  }
});

// What the footer shows: saved lists, or the single phone and email from the site text.
export async function getFooterContact(dict) {
  const saved = await getSavedFooterContact();
  if (saved) return saved;
  return {
    phones: dict?.footer?.phone ? [dict.footer.phone] : [],
    emails: dict?.footer?.email ? [dict.footer.email] : [],
  };
}
