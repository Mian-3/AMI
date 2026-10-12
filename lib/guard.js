import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

// Use in a section layout. Sends signed out users to login and
// users without access back to the dashboard.
export async function requireSection(key) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!session.sections.includes(key)) redirect("/admin?denied=1");
  return session;
}

export async function requireOwner() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (!session.isOwner) redirect("/admin?denied=1");
  return session;
}
