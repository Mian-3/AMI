import { NextResponse } from "next/server";
import { and, eq, gt, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { sendEnquiryEmail } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field. Pretend success so bots move on.
  if (clean(body?.website, 200)) return NextResponse.json({ ok: true });

  const enquiry = {
    name: clean(body?.name, 120),
    company: clean(body?.company, 160),
    email: clean(body?.email, 160).toLowerCase(),
    phone: clean(body?.phone, 40),
    topic: clean(body?.topic, 60),
    message: clean(body?.message, 4000),
  };

  if (!enquiry.company || !enquiry.phone || !enquiry.message || !EMAIL_RE.test(enquiry.email)) {
    return NextResponse.json({ ok: false, error: "Please fill in all required fields." }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    console.error("[contact] database is not configured");
    return NextResponse.json({ ok: false, error: "Service unavailable." }, { status: 503 });
  }

  try {
    // Simple flood protection: at most 3 enquiries per email address per hour.
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await db
      .select({ n: sql`count(*)::int` })
      .from(schema.enquiries)
      .where(and(eq(schema.enquiries.email, enquiry.email), gt(schema.enquiries.createdAt, since)));
    if ((recent[0]?.n ?? 0) >= 3) {
      return NextResponse.json({ ok: false, error: "Too many enquiries. Please try again later." }, { status: 429 });
    }

    await db.insert(schema.enquiries).values(enquiry);
  } catch (error) {
    console.error("[contact] could not save enquiry", error);
    return NextResponse.json({ ok: false, error: "Could not save your enquiry." }, { status: 500 });
  }

  // Email is a bonus: the enquiry is already safely saved.
  await sendEnquiryEmail(enquiry);
  return NextResponse.json({ ok: true });
}
