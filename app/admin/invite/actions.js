"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { createSession } from "@/lib/auth";
import { cleanSections } from "@/lib/teamShared";
import { hashToken } from "@/lib/team";

export async function acceptInvite(prevState, formData) {
  const token = String(formData.get("token") || "");
  const name = String(formData.get("name") || "").trim().slice(0, 120);
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (password.length < 10) return { error: "Password must be at least 10 characters." };
  if (password !== confirm) return { error: "The two passwords do not match." };

  const db = getDb();
  if (!db) return { error: "Database is not configured." };

  const key = `invite:${hashToken(token)}`;
  let user;
  try {
    const rows = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, key)).limit(1);
    const invite = rows[0]?.value;
    if (!invite || new Date(invite.expiresAt).getTime() < Date.now()) {
      return { error: "This invitation is invalid or has expired. Ask the owner for a new one." };
    }

    const exists = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.email, invite.email)).limit(1);
    if (exists[0]) return { error: "This email already has an account. Try signing in." };

    const passwordHash = await bcrypt.hash(password, 12);
    const inserted = await db
      .insert(schema.adminUsers)
      .values({ email: invite.email, name: name || invite.name || "", passwordHash, role: "editor" })
      .returning();
    user = inserted[0];

    await db
      .insert(schema.siteContent)
      .values({ key: `team:${user.id}`, value: { sections: cleanSections(invite.sections), disabled: false }, updatedAt: new Date() });
    await db.delete(schema.siteContent).where(eq(schema.siteContent.key, key));
  } catch (error) {
    console.error("[invite] accept failed", error);
    return { error: "Could not complete the invitation. Try again." };
  }

  await createSession(user);
  redirect("/admin");
}
