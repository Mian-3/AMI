// Server only. Activity log and presence, stored in the existing site_content table
// (keys "activity:..." and "presence:<userId>"), so no database change is needed.

import { desc, eq, inArray, like } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { isOnline } from "@/lib/activityShared";

const KEEP = 400; // newest entries kept

// Records one action. Never throws: a logging problem must not break a save.
export async function logActivity(user, action, detail = "", area = "") {
  try {
    const db = getDb();
    if (!db || !user) return;
    const at = Date.now();
    const key = `activity:${String(at).padStart(13, "0")}-${Math.random().toString(36).slice(2, 7)}`;
    const value = {
      at: new Date(at).toISOString(),
      userId: user.id,
      name: user.name || "",
      email: user.email || "",
      area: String(area).slice(0, 60),
      action: String(action).slice(0, 80),
      detail: String(detail).slice(0, 200),
    };
    await db.insert(schema.siteContent).values({ key, value, updatedAt: new Date() });

    // Now and then, drop the oldest entries so the table stays small.
    if (Math.random() < 0.05) {
      const old = await db
        .select({ key: schema.siteContent.key })
        .from(schema.siteContent)
        .where(like(schema.siteContent.key, "activity:%"))
        .orderBy(desc(schema.siteContent.key))
        .offset(KEEP)
        .limit(200);
      if (old.length) await db.delete(schema.siteContent).where(inArray(schema.siteContent.key, old.map((r) => r.key)));
    }
  } catch (error) {
    console.error("[activity] could not log", error);
  }
}

export async function getRecentActivity(limit = 100) {
  const db = getDb();
  if (!db) return [];
  try {
    const rows = await db
      .select()
      .from(schema.siteContent)
      .where(like(schema.siteContent.key, "activity:%"))
      .orderBy(desc(schema.siteContent.key))
      .limit(limit);
    return rows.map((r) => ({ id: r.key, ...r.value }));
  } catch (error) {
    console.error("[activity] could not read", error);
    return [];
  }
}

export async function touchPresence(user, path) {
  const db = getDb();
  if (!db || !user) return;
  const value = { at: new Date().toISOString(), path: String(path || "").slice(0, 200) };
  await db
    .insert(schema.siteContent)
    .values({ key: `presence:${user.id}`, value, updatedAt: new Date() })
    .onConflictDoUpdate({ target: schema.siteContent.key, set: { value, updatedAt: new Date() } });
}

// Everyone with an admin account, with whether they are online right now.
export async function getTeamStatus() {
  const db = getDb();
  if (!db) return [];
  try {
    const users = await db.select().from(schema.adminUsers);
    const rows = await db.select().from(schema.siteContent).where(like(schema.siteContent.key, "presence:%"));
    const byId = Object.fromEntries(rows.map((r) => [Number(r.key.slice(9)), r.value]));
    const now = Date.now();
    return users
      .map((u) => {
        const p = byId[u.id];
        return {
          id: u.id,
          name: u.name || u.email,
          email: u.email,
          isOwner: u.role === "admin",
          lastSeen: p?.at || null,
          path: p?.path || "",
          online: isOnline(p?.at, now),
        };
      })
      .sort((a, b) => Number(b.online) - Number(a.online) || String(b.lastSeen || "").localeCompare(String(a.lastSeen || "")));
  } catch (error) {
    console.error("[activity] could not read presence", error);
    return [];
  }
}
