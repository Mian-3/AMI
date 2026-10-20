import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { deleteEnquiry } from "../actions";
import DeleteButton from "@/components/admin/DeleteButton";
import MarkRead from "@/components/admin/MarkRead";

export const dynamic = "force-dynamic";

function formatDate(value) {
  return new Date(value).toLocaleString("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Karachi" });
}

function Row({ label, children }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[140px_1fr]">
      <dt className="text-xs font-medium uppercase tracking-wide text-ink/50">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-ink">{children}</dd>
    </div>
  );
}

export default async function EnquiryPage({ params }) {
  const { id } = await params;
  const num = Number(id);
  const db = getDb();
  if (!db || !Number.isInteger(num)) notFound();

  const rows = await db.select().from(schema.enquiries).where(eq(schema.enquiries.id, num)).limit(1);
  const r = rows[0];
  if (!r) notFound();

  const subject = encodeURIComponent(`Re: your enquiry to A.M International`);

  return (
    <div className="mx-auto max-w-3xl">
      <MarkRead id={r.id} status={r.status} />
      <p className="text-sm text-ink/50">
        <Link href="/admin/enquiries" className="hover:text-brand-orange">Enquiries</Link> / {r.company}
      </p>
      <h1 className="mt-1 text-2xl font-bold text-brand-navy">{r.company}</h1>
      <p className="mt-1 text-sm text-ink/50">{formatDate(r.createdAt)}</p>

      <dl className="mt-6 divide-y divide-black/5 rounded-xl border border-black/5 bg-white px-5 shadow-sm">
        <Row label="Name">{r.name || "-"}</Row>
        <Row label="Company">{r.company}</Row>
        <Row label="Email">
          <a href={`mailto:${r.email}?subject=${subject}`} className="text-brand-orange hover:underline">{r.email}</a>
        </Row>
        <Row label="Phone">
          <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="text-brand-orange hover:underline">{r.phone}</a>
        </Row>
        <Row label="Topic">{r.topic || "-"}</Row>
        <Row label="Message"><p className="whitespace-pre-wrap leading-relaxed">{r.message}</p></Row>
      </dl>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href={`mailto:${r.email}?subject=${subject}`} className="rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
          Reply by email
        </a>
        <form action={deleteEnquiry}>
          <input type="hidden" name="id" value={r.id} />
          <DeleteButton label="Delete" message="Delete this enquiry permanently? This cannot be undone." />
        </form>
      </div>
    </div>
  );
}
