import Link from "next/link";
import PostForm from "@/components/admin/PostForm";

export default function NewInsightPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/insights" className="text-sm text-ink/60 hover:text-brand-orange">&larr; All articles</Link>
      <h1 className="mt-2 text-2xl font-bold text-brand-navy">New article</h1>
      <PostForm post={null} />
    </div>
  );
}
