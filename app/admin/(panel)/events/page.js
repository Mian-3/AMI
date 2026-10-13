import Link from "next/link";
import { asc } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { deleteEvent, importDefaultEvents } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-GB", { dateStyle: "medium", timeZone: "UTC" });
}

export default async function EventsAdminPage() {
  const db = getDb();
  let rows = [];
  let failed = false;
  if (db) {
    try {
      rows = await db.select().from(schema.events).orderBy(asc(schema.events.eventDate), asc(schema.events.sortOrder));
    } catch {
      failed = true;
    }
  } else {
    failed = true;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy">Events</h1>
          <p className="mt-1 text-sm text-ink/60">
            Cards on the Events page. The event with the earliest date is shown in the big banner at the top.
          </p>
        </div>
        <Link href="/admin/events/new" className="rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
          New event
        </Link>
      </div>

      {failed ? (
        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">The database could not be reached. Check DATABASE_URL.</p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
        {rows.length === 0 && !failed ? (
          <div className="p-8 text-center">
            <p className="text-sm text-ink/60">
              The website is showing the 5 starter events. Import them here to edit or delete them, or click "New event" to start fresh.
            </p>
            <form action={importDefaultEvents} className="mt-4">
              <button type="submit" className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-black/5">
                Import existing events
              </button>
            </form>
          </div>
        ) : (
          <ul className="divide-y divide-black/5">
            {rows.map((row) => (
              <li key={row.id} className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {row.imageUrl ? <img src={row.imageUrl} alt="" className="h-12 w-20 rounded-md object-cover" /> : <div className="h-12 w-20 rounded-md bg-black/5" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-brand-navy">{row.data?.en?.title || "(no title)"}</p>
                  <p className="mt-0.5 truncate text-xs text-ink/50">
                    {formatDate(row.eventDate)} · {row.data?.en?.location || "-"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    row.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {row.status === "published" ? "Published" : "Draft"}
                </span>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/events/${row.id}`} className="rounded-lg border border-black/10 px-3 py-1.5 text-sm transition hover:bg-black/5">
                    Edit
                  </Link>
                  <form action={deleteEvent}>
                    <input type="hidden" name="id" value={row.id} />
                    <DeleteButton what="event" />
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
