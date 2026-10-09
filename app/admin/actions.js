"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { createSession, destroySession } from "@/lib/auth";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(prevState, formData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const fail = async () => {
    await wait(700); // slows down password guessing
    return { error: "Incorrect email or password." };
  };

  if (!email || !password) return fail();

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

  if (!user) return fail();
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return fail();

  await createSession(user);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
