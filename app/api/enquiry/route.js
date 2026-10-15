import { NextResponse } from "next/server";
import { and, eq, gt, sql } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getDictionary } from "@/lib/getDictionary";
import { sendEnquiryNotification } from "@/lib/enquiryMailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function list(value, max, count) {
  return Array.isArray(value) ? value.map((v) => clean(v, max)).filter(Boolean).slice(0, count) : [];
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this field. Pretend success so bots move on.
  if (clean(body?.website, 200)) return NextResponse.json({ ok: true });

  const d = {
    name: clean(body?.name, 120),
    company: clean(body?.company, 160),
    email: clean(body?.email, 160).toLowerCase(),
    phone: clean(body?.phone, 40),
    location: clean(body?.location, 160),
    industry: clean(body?.industry, 120),
    interest: clean(body?.interest, 80),
    form: clean(body?.form, 80),
    requests: list(body?.requests, 80, 6),
    sampleProfile: clean(body?.sampleProfile, 300),
    sampleVolume: clean(body?.sampleVolume, 80),
    sampleApplication: clean(body?.sampleApplication, 300),
    sampleAddress: clean(body?.sampleAddress, 600),
    message: clean(body?.message, 2000),
    source: clean(body?.source, 80),
    contactTime: clean(body?.contactTime, 120),
    contactMethod: clean(body?.contactMethod, 60),
    wantsSample: body?.wantsSample === true,
    consent: body?.consent === true,
  };

  if (!d.name || !d.company || !d.phone || !EMAIL_RE.test(d.email) || !d.industry || !d.interest || d.requests.length === 0 || !d.contactMethod || !d.consent) {
    return NextResponse.json({ ok: false, error: "Please fill in all required fields." }, { status: 400 });
  }

  const db = getDb();
  if (!db) {
    console.error("[enquiry] database is not configured");
    return NextResponse.json({ ok: false, error: "Service unavailable." }, { status: 503 });
  }

  const dash = (v) => v || "-";
  const lines = [
    "ENQUIRY FORM (Request a Sample)",
    "",
    `Industry: ${d.industry}`,
    `Interested in: ${dash(d.interest)}`,
    `Form needed: ${dash(d.form)}`,
    `Requesting: ${d.requests.join(", ")}`,
    `Location: ${dash(d.location)}`,
  ];
  if (d.wantsSample) {
    lines.push("", "SAMPLE DETAILS", `Profile: ${dash(d.sampleProfile)}`, `Monthly volume: ${dash(d.sampleVolume)}`, `Application: ${dash(d.sampleApplication)}`, `Shipping address: ${dash(d.sampleAddress)}`);
  }
  lines.push("", "OTHER", `Message: ${dash(d.message)}`, `Heard about us via: ${dash(d.source)}`, `Preferred contact: ${d.contactMethod}`, `Best time to contact: ${dash(d.contactTime)}`);
  const message = lines.join("\n");
  const topic = ("Enquiry: " + d.requests.join(", ")).slice(0, 60);

  try {
    // Simple flood protection: at most 3 enquiries per email address per hour.
    const since = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await db
      .select({ n: sql`count(*)::int` })
      .from(schema.enquiries)
      .where(and(eq(schema.enquiries.email, d.email), gt(schema.enquiries.createdAt, since)));
    if ((recent[0]?.n ?? 0) >= 3) {
      return NextResponse.json({ ok: false, error: "Too many enquiries. Please try again later." }, { status: 429 });
    }
    await db.insert(schema.enquiries).values({ name: d.name, company: d.company, email: d.email, phone: d.phone, topic, message });
  } catch (error) {
    console.error("[enquiry] could not save", error);
    return NextResponse.json({ ok: false, error: "Could not save your enquiry." }, { status: 500 });
  }

  // Email goes to the address set in the admin. A mail problem never fails the request.
  let notifyTo = "";
  try {
    const dict = await getDictionary("en");
    notifyTo = dict?.enquiryForm?.contact?.notifyEmail || "";
  } catch {}
  await sendEnquiryNotification({
    to: notifyTo,
    replyTo: d.email,
    subject: `New enquiry from ${d.company}`,
    text: [`Name: ${d.name}`, `Company: ${d.company}`, `Email: ${d.email}`, `Phone: ${d.phone}`, "", message].join("\n"),
  });

  return NextResponse.json({ ok: true });
}
