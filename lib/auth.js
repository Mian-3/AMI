import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { SECTION_KEYS, cleanSections } from "@/lib/teamShared";

const COOKIE = "am_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET is missing or shorter than 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(user) {
  const token = await new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

// Returns the logged in admin user, or null.
//
//   getSession()                 any signed in user
//   getSession("insights")       user must be allowed into that section
//   getSession(["a", "b"])       user must be allowed into at least one of them
//
// The owner (role "admin") can open everything plus the Team page.
// Invited members (role "editor") only get the sections ticked for them, and can be
// disabled at any time. Both are re-checked in the database on every call, so
// disabling or removing someone logs them out immediately.
export async function getSession(need) {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    const db = getDb();
    if (!db) return null;

    const rows = await db
      .select()
      .from(schema.adminUsers)
      .where(eq(schema.adminUsers.id, Number(payload.sub)))
      .limit(1);
    const user = rows[0];
    if (!user) return null;

    const isOwner = user.role === "admin";
    let sections = SECTION_KEYS;
    if (!isOwner) {
      const teamRows = await db
        .select()
        .from(schema.siteContent)
        .where(eq(schema.siteContent.key, `team:${user.id}`))
        .limit(1);
      const team = teamRows[0]?.value;
      if (!team || team.disabled) return null;
      sections = cleanSections(team.sections);
    }

    const needed = need ? (Array.isArray(need) ? need : [need]) : null;
    if (needed && !needed.some((k) => sections.includes(k))) return null;

    return { id: user.id, email: user.email, name: user.name, role: user.role, isOwner, sections };
  } catch {
    return null;
  }
}
