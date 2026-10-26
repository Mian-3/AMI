// Server only. Collects what happened on the website admin between two Pakistan dates:
// enquiries received, sign-in attempts, and who changed what.

import { and, desc, gte, like, lt } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getLoginsBetween } from "@/lib/loginLog";
import { dayRangeMs, rangeLabel } from "@/lib/reportDates";

const pad = (ms) => String(ms).padStart(13, "0");

export async function buildReport(fromStr, toStr) {
  const [fromMs, toMs] = dayRangeMs(fromStr, toStr);
  const db = getDb();
  const report = { from: fromStr, to: toStr, label: rangeLabel(fromStr, toStr), enquiries: [], logins: [], activity: [], truncated: false };
  if (!db) return report;

  const enquiries = await db
    .select()
    .from(schema.enquiries)
    .where(and(gte(schema.enquiries.createdAt, new Date(fromMs)), lt(schema.enquiries.createdAt, new Date(toMs))))
    .orderBy(desc(schema.enquiries.createdAt))
    .limit(500);
  report.enquiries = enquiries.map((e) => ({
    at: e.createdAt.toISOString(),
    name: e.name,
    company: e.company,
    email: e.email,
    phone: e.phone,
    topic: e.topic,
    status: e.status,
    message: e.message,
  }));

  report.logins = await getLoginsBetween(fromMs, toMs, 1500);

  const acts = await db
    .select()
    .from(schema.siteContent)
    .where(and(like(schema.siteContent.key, "activity:%"), gte(schema.siteContent.key, `activity:${pad(fromMs)}`), lt(schema.siteContent.key, `activity:${pad(toMs)}`)))
    .orderBy(desc(schema.siteContent.key))
    .limit(2500);
  // Plain sign in / sign out entries are already covered by the sign-in section.
  report.activity = acts.map((r) => ({ id: r.key, ...r.value })).filter((a) => a.area !== "login");

  report.truncated = report.enquiries.length >= 500 || report.logins.length >= 1500 || acts.length >= 2500;
  return report;
}

export function summarize(report) {
  const ok = report.logins.filter((l) => l.ok).length;
  return {
    enquiries: report.enquiries.length,
    signIns: ok,
    failed: report.logins.length - ok,
    changes: report.activity.length,
  };
}
