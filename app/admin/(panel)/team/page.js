import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";
import { SECTIONS } from "@/lib/teamShared";
import TeamPanel from "@/components/admin/TeamPanel";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const session = await getSession();
  const db = getDb();
  let users = [];
  let teamRows = [];
  let inviteRows = [];
  if (db) {
    users = await db.select().from(schema.adminUsers);
    const all = await db.select().from(schema.siteContent);
    teamRows = all.filter((r) => r.key.startsWith("team:"));
    inviteRows = all.filter((r) => r.key.startsWith("invite:"));
  }

  const teamById = Object.fromEntries(teamRows.map((r) => [Number(r.key.slice(5)), r.value]));
  const members = users
    .filter((u) => u.role !== "admin")
    .map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      sections: teamById[u.id]?.sections || [],
      disabled: Boolean(teamById[u.id]?.disabled),
    }));
  const owners = users.filter((u) => u.role === "admin").map((u) => ({ id: u.id, email: u.email, name: u.name }));
  const now = Date.now();
  const invites = inviteRows
    .map((r) => ({
      key: r.key,
      email: r.value.email,
      name: r.value.name,
      sections: r.value.sections || [],
      expiresAt: r.value.expiresAt,
      expired: new Date(r.value.expiresAt).getTime() < now,
    }))
    .sort((a, b) => String(a.email).localeCompare(String(b.email)));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-brand-navy">Team and access</h1>
      <p className="mt-1 text-sm text-ink/60">
        Invite people by email and choose exactly which sections they can edit. Only the owner sees this page.
      </p>
      <TeamPanel sections={SECTIONS} owners={owners} members={members} invites={invites} currentId={session.id} />
    </div>
  );
}
