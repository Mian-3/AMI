import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" });
}

export default async function EnquiriesPage({ searchParams }) {
  const { filter } = await searchParams;
  const onlyNew = filter === "new";

  const db = getDb();
  let rows = [];
  let failed = false;
  if (db) {
    try {
      const q = db.select().from(schema.enquiries);
      rows = await (onlyNew ? q.where(eq(schema.enquiries.status, "new")) : q).orderBy(desc(schema.enquiries.createdAt)).limit(200);
    } catch {
      failed = true;
    }
  } else {
    failed = true;
  }

  const tab = (active) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${active ? "bg-brand-navy text-white" : "text-ink/70 hover:bg-black/5"}`;

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-brand-navy">Enquiries</h1>
      <p className="mt-1 text-sm text-ink/60">Messages sent from the Contact page form.</p>

      <div className="mt-5 flex gap-2">
        <Link href="/admin/enquiries" className={tab(!onlyNew)}>All</Link>
        <Link href="/admin/enquiries?filter=new" className={tab(onlyNew)}>New only</Link>
      </div>

      {failed ? (
        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">The database could not be reached. Check DATABASE_URL.</p>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
        {rows.length === 0 && !failed ? (
          <p className="p-8 text-center text-sm text-ink/60">{onlyNew ? "No new enquiries." : "No enquiries yet."}</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {rows.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/enquiries/${r.id}`} className="flex flex-wrap items-center gap-3 px-4 py-4 transition hover:bg-black/[0.02] sm:px-5">
                  <div className="min-w-0 flex-1">
                    <p className={`truncate ${r.status === "new" ? "font-semibold text-brand-navy" : "font-medium text-ink/80"}`}>
                      {r.company}
                      {r.name ? <span className="font-normal text-ink/50"> · {r.name}</span> : null}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-ink/60">{r.message}</p>
                    <p className="mt-0.5 text-xs text-ink/40">{formatDate(r.createdAt)}{r.topic ? ` · ${r.topic}` : ""}</p>
                  </div>
                  {r.status === "new" ? (
                    <span className="rounded-full bg-brand-orange/10 px-2.5 py-1 text-xs font-medium text-brand-orange">New</span>
                  ) : (
                    <span className="text-xs text-ink/40">Read</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
