import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb, schema } from "@/db";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditInsightPage({ params }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId)) notFound();

  const db = getDb();
  if (!db) notFound();

  const rows = await db.select().from(schema.posts).where(eq(schema.posts.id, numericId)).limit(1);
  const post = rows[0];
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/insights" className="text-sm text-ink/60 hover:text-brand-orange">&larr; All articles</Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-navy">Edit article</h1>
      <PostForm
        post={{ id: post.id, slug: post.slug, status: post.status, imageUrl: post.imageUrl, data: post.data }}
      />
    </div>
  );
}
