"use server";

import { revalidatePath } from "next/cache";
import { and, eq, like } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { cleanSections } from "@/lib/teamShared";
import { EMAIL_RE, INVITE_DAYS, hashToken, newToken, siteOrigin } from "@/lib/team";
import { sendInviteEmail } from "@/lib/mailer";

async function owner() {
  const session = await getSession();
  return session?.isOwner ? session : null;
}

async function putKey(db, key, value) {
  await db
    .insert(schema.siteContent)
    .values({ key, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.siteContent.key, set: { value, updatedAt: new Date() } });
}

export async function inviteMember(input) {
  const session = await owner();
  if (!session) return { ok: false, error: "Only the owner can invite people." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };

  const email = String(input?.email || "").trim().toLowerCase();
  const name = String(input?.name || "").trim().slice(0, 120);
  const sections = cleanSections(input?.sections);
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (sections.length === 0) return { ok: false, error: "Tick at least one section." };

  try {
    const existing = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, email)).limit(1);
    if (existing[0]) return { ok: false, error: "This email already has an account." };

    // One open invite per email: remove older ones.
    const open = await db.select().from(schema.siteContent).where(like(schema.siteContent.key, "invite:%"));
    for (const row of open) {
      if (row.value?.email === email) await db.delete(schema.siteContent).where(eq(schema.siteContent.key, row.key));
    }

    const token = newToken();
    const expiresAt = new Date(Date.now() + INVITE_DAYS * 86400000).toISOString();
    await putKey(db, `invite:${hashToken(token)}`, { email, name, sections, expiresAt, invitedBy: session.email });

    const link = `${await siteOrigin()}/admin/invite/${token}`;
    const mail = await sendInviteEmail({ to: email, name, link, sections, invitedBy: session.name || session.email });
    revalidatePath("/admin/team");
    return { ok: true, link, emailed: mail.sent, days: INVITE_DAYS };
  } catch (error) {
    console.error("[team] invite failed", error);
    return { ok: false, error: "Could not create the invite. Try again." };
  }
}

export async function revokeInvite(formData) {
  const session = await owner();
  if (!session) return;
  const db = getDb();
  const key = String(formData.get("key") || "");
  if (!db || !key.startsWith("invite:")) return;
  await db.delete(schema.siteContent).where(eq(schema.siteContent.key, key));
  revalidatePath("/admin/team");
}

export async function updateMember(userId, input) {
  const session = await owner();
  if (!session) return { ok: false, error: "Only the owner can change access." };
  const db = getDb();
  if (!db) return { ok: false, error: "Database is not configured." };
  const id = Number(userId);
  const sections = cleanSections(input?.sections);
  if (sections.length === 0) return { ok: false, error: "Tick at least one section, or disable the person instead." };

  const rows = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, id)).limit(1);
  const user = rows[0];
  if (!user || user.role === "admin") return { ok: false, error: "Member not found." };

  const current = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, `team:${id}`)).limit(1);
  const disabled = Boolean(current[0]?.value?.disabled);
  await putKey(db, `team:${id}`, { sections, disabled });
  revalidatePath("/admin/team");
  return { ok: true };
}

export async function setMemberDisabled(formData) {
  const session = await owner();
  if (!session) return;
  const db = getDb();
  const id = Number(formData.get("id"));
  const disabled = formData.get("disabled") === "1";
  if (!db || !id) return;
  const rows = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, id)).limit(1);
  if (!rows[0] || rows[0].role === "admin") return;
  const current = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, `team:${id}`)).limit(1);
  await putKey(db, `team:${id}`, { sections: cleanSections(current[0]?.value?.sections), disabled });
  revalidatePath("/admin/team");
}

export async function removeMember(formData) {
  const session = await owner();
  if (!session) return;
  const db = getDb();
  const id = Number(formData.get("id"));
  if (!db || !id) return;
  const rows = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.id, id)).limit(1);
  if (!rows[0] || rows[0].role === "admin") return;
  await db.delete(schema.siteContent).where(eq(schema.siteContent.key, `team:${id}`));
  await db.delete(schema.adminUsers).where(and(eq(schema.adminUsers.id, id), eq(schema.adminUsers.role, "editor")));
  revalidatePath("/admin/team");
}
