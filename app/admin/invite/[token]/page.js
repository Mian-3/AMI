import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { SECTIONS } from "@/lib/teamShared";
import { hashToken } from "@/lib/team";
import AcceptInviteForm from "@/components/admin/AcceptInviteForm";

export const dynamic = "force-dynamic";

export default async function InvitePage({ params }) {
  const { token } = await params;
  const db = getDb();
  let invite = null;
  if (db) {
    try {
      const rows = await db.select().from(schema.siteContent).where(eq(schema.siteContent.key, `invite:${hashToken(token)}`)).limit(1);
      invite = rows[0]?.value || null;
    } catch {}
  }
  const valid = invite && new Date(invite.expiresAt).getTime() > Date.now();
  const labels = valid ? invite.sections.map((k) => SECTIONS.find((s) => s.key === k)?.label || k) : [];

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[26rem] rounded-2xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(10,37,64,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange">A.M International</p>
        {valid ? (
          <>
            <h1 className="mt-2 text-2xl font-bold text-brand-navy">Accept your invitation</h1>
            <p className="mt-1 text-sm text-ink/60">
              You are joining as <strong>{invite.email}</strong>. You will have access to: {labels.join(", ")}.
            </p>
            <AcceptInviteForm token={token} defaultName={invite.name || ""} />
          </>
        ) : (
          <>
            <h1 className="mt-2 text-2xl font-bold text-brand-navy">Invitation not valid</h1>
            <p className="mt-2 text-sm text-ink/60">This link is invalid, already used or expired. Ask the owner to send a new invitation.</p>
          </>
        )}
      </div>
    </main>
  );
}
