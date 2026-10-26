"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { createSession, destroySession, getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { isLockedOut, logLogin } from "@/lib/loginLog";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(prevState, formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const fail = async (reason = "wrong password") => {
    await logLogin({ email, ok: false, reason });
    await wait(700); // slows down password guessing
    return { error: "Incorrect email or password." };
  };

  if (!email || !password) return { error: "Incorrect email or password." };

  // Too many recent failures for this email or address: stop guessing for a while.
  if (await isLockedOut(email)) {
    await logLogin({ email, ok: false, reason: "locked out" });
    await wait(700);
    return { error: "Too many failed attempts. Please wait 15 minutes and try again." };
  }

  const db = getDb();
  if (!db) return { error: "Database is not configured." };

  let user;
  try {
    const rows = await db
      .select()
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.email, email))
      .limit(1);
    user = rows[0];
  } catch {
    return { error: "Could not reach the database. Try again." };
  }

  if (!user) return fail("unknown email");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return fail("wrong password");

  await logLogin({ email, ok: true });
  await createSession(user);
  await logActivity({ id: user.id, name: user.name, email: user.email }, "Signed in", "", "login");
  redirect("/admin");
}

export async function logout() {
  const session = await getSession();
  if (session) await logActivity(session, "Signed out", "", "login");
  await destroySession();
  redirect("/admin/login");
}
