// Server only. Sign-in attempts, stored in the existing site_content table (keys "login:<time>-<random>"),
// so no database change is needed. Used for the lockout, the weekly report and the Reports page.

import { and, desc, gte, like, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb, schema } from "@/db";

const WINDOW_MS = 15 * 60 * 1000; // lockout window
const MAX_FAILS_PER_EMAIL = 5;
const MAX_FAILS_PER_IP = 15;
const KEEP_DAYS = 180;
const pad = (ms) => String(ms).padStart(13, "0");

export async function clientIp() {
  try {
    const h = await headers();
    return (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  } catch {
    return "unknown";
  }
}

// reason: "" for success, otherwise "wrong password", "unknown email", "locked" ...
export async function logLogin({ email, ok, reason = "" }) {
  try {
    const db = getDb();
    if (!db) return;
    const at = Date.now();
    const value = {
      at: new Date(at).toISOString(),
      email: String(email || "").slice(0, 160),
      ok: Boolean(ok),
      reason: String(reason).slice(0, 60),
      ip: (await clientIp()).slice(0, 64),
    };
    await db.insert(schema.siteContent).values({
      key: `login:${pad(at)}-${Math.random().toString(36).slice(2, 7)}`,
      value,
      updatedAt: new Date(),
    });
    // Now and then, forget entries older than KEEP_DAYS.
    if (Math.random() < 0.03) {
      await db.delete(schema.siteContent).where(and(like(schema.siteContent.key, "login:%"), lt(schema.siteContent.key, `login:${pad(at - KEEP_DAYS * 86400000)}`)));
    }
  } catch (error) {
    console.error("[login log] could not write", error);
  }
}

// True when this email (or this address) has too many recent failed attempts.
export async function isLockedOut(email) {
  try {
    const db = getDb();
    if (!db) return false;
    const since = Date.now() - WINDOW_MS;
    const rows = await db
      .select()
      .from(schema.siteContent)
      .where(and(like(schema.siteContent.key, "login:%"), gte(schema.siteContent.key, `login:${pad(since)}`)))
      .orderBy(desc(schema.siteContent.key))
      .limit(300);
    const ip = await clientIp();
    const mail = String(email || "").toLowerCase();
    let byEmail = 0;
    let byIp = 0;
    let emailDone = false;
    for (const r of rows) {
      const v = r.value || {};
      if (v.email?.toLowerCase() === mail && !emailDone) {
        if (v.ok) emailDone = true; // a successful sign in clears earlier failures
        else byEmail++;
      }
      if (!v.ok && v.ip === ip) byIp++;
    }
    return byEmail >= MAX_FAILS_PER_EMAIL || byIp >= MAX_FAILS_PER_IP;
  } catch {
    return false; // never lock the owner out because of a logging problem
  }
}

export async function getLoginsBetween(fromMs, toMs, limit = 1000) {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select()
    .from(schema.siteContent)
    .where(and(like(schema.siteContent.key, "login:%"), gte(schema.siteContent.key, `login:${pad(fromMs)}`), lt(schema.siteContent.key, `login:${pad(toMs)}`)))
    .orderBy(desc(schema.siteContent.key))
    .limit(limit);
  return rows.map((r) => ({ id: r.key, ...r.value }));
}
