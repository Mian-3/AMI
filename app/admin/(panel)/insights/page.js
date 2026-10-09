import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb, schema } from "@/db";
import { deletePost, importStarterPosts } from "./actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" });
}

export default async function InsightsAdminPage() {
  const db = getDb();
  let posts = [];
  let failed = false;
  if (db) {
    try {
      posts = await db.select().from(schema.posts).orderBy(desc(schema.posts.updatedAt));
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
          <h1 className="text-2xl font-bold text-brand-navy">Insights</h1>
          <p className="mt-1 text-sm text-ink/60">Articles shown on the Insights page and the home page.</p>
        </div>
        <Link href="/admin/insights/new" className="rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
          New article
        </Link>
      </div>

      {!failed && !posts.some((post) => post.slug === "insight-1") ? (
        <form action={importStarterPosts} className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-brand-orange/30 bg-brand-orange/5 px-4 py-3">
          <p className="min-w-0 flex-1 text-sm text-ink/70">
            The 12 articles currently on the website are not in the dashboard yet. Import them once to edit or delete them here.
          </p>
          <button type="submit" className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
            Import existing articles
          </button>
        </form>
      ) : null}

      {failed ? (
        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">The database could not be reached. Check DATABASE_URL.</p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
        {posts.length === 0 && !failed ? (
          <p className="p-8 text-center text-sm text-ink/60">No articles yet. Click "New article" to add the first one.</p>
        ) : (
          <ul className="divide-y divide-black/5">
            {posts.map((post) => (
              <li key={post.id} className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-brand-navy">{post.data?.en?.title || "(no title)"}</p>
                  <p className="mt-0.5 truncate text-xs text-ink/50">/{post.slug} · Updated {formatDate(post.updatedAt)}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    post.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {post.status === "published" ? "Published" : "Draft"}
                </span>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/insights/${post.id}`} className="rounded-lg border border-black/10 px-3 py-1.5 text-sm transition hover:bg-black/5">
                    Edit
                  </Link>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <DeleteButton />
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
