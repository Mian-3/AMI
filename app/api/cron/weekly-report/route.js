import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { buildReport, summarize } from "@/lib/report";
import { makeDocx, makePdf } from "@/lib/reportFiles";
import { sendReportEmail } from "@/lib/mailer";
import { addDays, pkToday } from "@/lib/reportDates";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Called by Vercel Cron (see vercel.json) every Friday night, Pakistan time.
// Vercel sends "Authorization: Bearer <CRON_SECRET>"; without the secret nothing runs.
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // The last 7 days, ending today (Pakistan date).
  const to = pkToday();
  const from = addDays(to, -6);
  const report = await buildReport(from, to);

  // Recipients: REPORT_TO (comma separated) or, if empty, every owner account.
  let recipients = String(process.env.REPORT_TO || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!recipients.length) {
    const db = getDb();
    if (db) {
      const owners = await db.select().from(schema.adminUsers).where(eq(schema.adminUsers.role, "admin"));
      recipients = owners.map((o) => o.email);
    }
  }

  const [pdf, docx] = await Promise.all([makePdf(report, "Weekly website report"), makeDocx(report, "Weekly website report")]);
  const stamp = `${from}_to_${to}`;
  const mail = await sendReportEmail({
    to: recipients,
    label: report.label,
    summary: summarize(report),
    attachments: [
      { filename: `AMI-weekly-report-${stamp}.pdf`, content: pdf, contentType: "application/pdf" },
      { filename: `AMI-weekly-report-${stamp}.docx`, content: docx, contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
    ],
  });
  return NextResponse.json({ ok: mail.sent, range: stamp, recipients: recipients.length, reason: mail.reason || null });
}
