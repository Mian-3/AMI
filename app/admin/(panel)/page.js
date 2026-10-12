import { count, eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { getSession } from "@/lib/auth";

async function getStats() {
  const db = getDb();
  if (!db) return null;
  try {
    const [posts] = await db.select({ n: count() }).from(schema.posts);
    const [events] = await db.select({ n: count() }).from(schema.events);
    const [enquiries] = await db.select({ n: count() }).from(schema.enquiries).where(eq(schema.enquiries.status, "new"));
    return { posts: posts.n, events: events.n, enquiries: enquiries.n };
  } catch {
    return null;
  }
}

export default async function DashboardPage({ searchParams }) {
  const { denied } = await searchParams;
  const session = await getSession();
  const stats = await getStats();

  const allowed = session?.sections || [];
  const cards = [
    { label: "Insights articles", value: stats?.posts, section: "insights" },
    { label: "Events", value: stats?.events, section: "events" },
    { label: "New enquiries", value: stats?.enquiries, section: "enquiries" },
  ].filter((c) => allowed.includes(c.section));

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-brand-navy">Welcome{session?.name ? `, ${session.name}` : ""}</h1>
      <p className="mt-1 text-sm text-ink/60">Here is an overview of the website content.</p>

      {denied ? (
        <p role="alert" className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          You do not have access to that section. Ask the owner if you need it.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
            <p className="text-sm text-ink/60">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-brand-navy">{card.value ?? "-"}</p>
          </div>
        ))}
      </div>

      {!stats ? (
        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          The database could not be reached, so the numbers are hidden. Check DATABASE_URL.
        </p>
      ) : null}
    </div>
  );
}
