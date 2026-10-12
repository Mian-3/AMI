"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";

export async function setEnquiryStatus(id, status) {
  const session = await getSession("enquiries");
  if (!session) return { ok: false };
  const db = getDb();
  const num = Number(id);
  if (!db || !Number.isInteger(num) || !["new", "read"].includes(status)) return { ok: false };
  await db.update(schema.enquiries).set({ status }).where(eq(schema.enquiries.id, num));
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteEnquiry(formData) {
  const session = await getSession("enquiries");
  if (!session) redirect("/admin/login");
  const db = getDb();
  const id = Number(formData.get("id"));
  if (db && Number.isInteger(id)) await db.delete(schema.enquiries).where(eq(schema.enquiries.id, id));
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  redirect("/admin/enquiries");
}
