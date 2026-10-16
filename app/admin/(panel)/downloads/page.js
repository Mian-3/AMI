import Link from "next/link";
import { getAllDownloads } from "@/lib/downloadsData";
import DownloadsForm from "@/components/admin/DownloadsForm";

export const dynamic = "force-dynamic";

export default async function DownloadsAdminPage() {
  const items = await getAllDownloads();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-brand-navy">Downloads</h1>
      <p className="mt-1 text-sm text-ink/60">
        Each block below is one row on the Downloads page. Add a new block, upload its PDF, and it opens in a new tab when a visitor clicks it.
        The page heading, banner image and button text are in{" "}
        <Link href="/admin/content/downloadsPage" className="text-brand-orange hover:underline">Site content &rarr; Downloads page</Link>.
      </p>
      <DownloadsForm initial={items} />
    </div>
  );
}
