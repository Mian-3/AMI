import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { touchPresence } from "@/lib/activity";

// Called every minute or so by the open admin page, so the owner can see who is online.
export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  let path = "";
  try {
    path = (await request.json())?.path || "";
  } catch {}
  try {
    await touchPresence(session, path);
  } catch (error) {
    console.error("[ping]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
