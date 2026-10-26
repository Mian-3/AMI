import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { buildReport } from "@/lib/report";
import { makeDocx, makePdf } from "@/lib/reportFiles";
import { addDays, isDateStr, pkToday } from "@/lib/reportDates";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

// Owner only: /api/admin/report?from=2026-10-17&to=2026-10-23&format=pdf|docx
export async function GET(request) {
  const session = await getSession();
  if (!session?.isOwner) return NextResponse.json({ error: "Only the owner can download reports." }, { status: 403 });

  const url = new URL(request.url);
  const today = pkToday();
  let from = url.searchParams.get("from");
  let to = url.searchParams.get("to") || from;
  if (!isDateStr(from)) from = today;
  if (!isDateStr(to)) to = from;
  if (to < from) [from, to] = [to, from];
  if (to > addDays(from, 92)) to = addDays(from, 92); // at most about 3 months per file

  const format = url.searchParams.get("format") === "docx" ? "docx" : "pdf";
  const report = await buildReport(from, to);
  const body = format === "docx" ? await makeDocx(report) : await makePdf(report);
  const name = `AMI-report-${from}${to === from ? "" : "_to_" + to}.${format}`;
  await logActivity(session, "Downloaded a report", report.label, "reports");

  return new NextResponse(body, {
    headers: {
      "Content-Type": format === "docx" ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : "application/pdf",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
    },
  });
}
