import { NextResponse } from "next/server";

const MAX = { name: 120, company: 160, email: 160, phone: 40, topic: 60, message: 4000 };

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot: real visitors never fill this field
  if (body.website) return NextResponse.json({ ok: true });

  const data = {
    name: clean(body.name, MAX.name),
    company: clean(body.company, MAX.company),
    email: clean(body.email, MAX.email),
    phone: clean(body.phone, MAX.phone),
    topic: clean(body.topic, MAX.topic),
    message: clean(body.message, MAX.message),
  };

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  if (!data.name || !data.company || !emailOk || !data.phone || !data.message) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  }

  // TODO: deliver the enquiry (email provider or admin database).
  // For now it is logged on the server so nothing is lost during testing.
  console.log("[contact enquiry]", data);

  return NextResponse.json({ ok: true });
}
