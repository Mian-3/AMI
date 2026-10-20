"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { FOOTER_KEY, sanitizeFooterContact } from "@/lib/footerContact";

function refreshSite() {
  revalidatePath("/", "layout");
}

export async function saveFooterContact(input) {
  const session = await getSession("content");
  if (!session) return { ok: false, error: "You are signed out or do not have access." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };

  const value = sanitizeFooterContact(input);
  if (!value.phones.length && !value.emails.length) return { ok: false, error: "Add at least one valid phone number or email." };

  try {
    await db
      .insert(schema.siteContent)
      .values({ key: FOOTER_KEY, value, updatedAt: new Date() })
      .onConflictDoUpdate({ target: schema.siteContent.key, set: { value, updatedAt: new Date() } });
    refreshSite();
    await logActivity(session, "Edited footer contacts", `${value.phones.length} phones, ${value.emails.length} emails`, "content");
    return { ok: true, value };
  } catch (error) {
    console.error("[saveFooterContact]", error);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

export async function resetFooterContact() {
  const session = await getSession("content");
  if (!session) return { ok: false, error: "You are signed out or do not have access." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };
  try {
    await db.delete(schema.siteContent).where(eq(schema.siteContent.key, FOOTER_KEY));
    refreshSite();
    await logActivity(session, "Reset footer contacts to default", "", "content");
    return { ok: true };
  } catch (error) {
    console.error("[resetFooterContact]", error);
    return { ok: false, error: "Could not reset. Please try again." };
  }
}
