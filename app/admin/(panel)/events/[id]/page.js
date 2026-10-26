import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import EventForm from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();
  const db = getDb();
  if (!db) notFound();

  const rows = await db.select().from(schema.events).where(eq(schema.events.id, numericId)).limit(1);
  const row = rows[0];
  if (!row) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/events" className="text-sm text-ink/60 hover:text-brand-orange">&larr; All events</Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-navy">Edit event</h1>
      <EventForm
        event={{
          id: row.id,
          status: row.status,
          date: row.eventDate ? new Date(row.eventDate).toISOString().slice(0, 10) : "",
          imageUrl: row.imageUrl,
          heroImage: row.data?.heroImage || "",
          endDate: row.data?.endDate || "",
          data: row.data,
        }}
      />
    </div>
  );
}
