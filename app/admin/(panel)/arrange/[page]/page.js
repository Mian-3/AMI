import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getArrangeData } from "@/lib/itemLists";
import { getLayout } from "@/lib/sectionLayout";
import { getItemLayout } from "@/lib/itemLayoutServer";
import LayoutEditor from "@/components/admin/LayoutEditor";

export const dynamic = "force-dynamic";

export default async function ArrangePage({ params }) {
  const { page: pageId } = await params;
  const session = await getSession("content");
  if (!session) notFound();
  const data = await getArrangeData(pageId);
  if (!data) notFound();

  const L = await getLayout();
  const IL = await getItemLayout();
  const sections = data.sections.map((s) => ({
    id: s.id,
    label: s.label,
    state: L.deleted.includes(s.id) ? "deleted" : L.hidden.includes(s.id) ? "hidden" : "shown",
    lists: s.lists.map((l) => {
      const stateOf = (i) => (IL.deleted.includes(`${l.listId}.${i}`) ? "deleted" : IL.hidden.includes(`${l.listId}.${i}`) ? "hidden" : "shown");
      const saved = (IL.order[l.listId] || []).filter((i) => i < l.items.length);
      const rest = l.items.map((x) => x.i).filter((i) => !saved.includes(i));
      const items = [...saved, ...rest].map((i) => ({ ...l.items[i], state: stateOf(i) }));
      return { listId: l.listId, label: l.label, items };
    }),
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-ink/50">
        <Link href="/admin/content" className="hover:text-brand-orange">Pages</Link> / {data.page.label}
      </p>
      <h1 className="mt-1 text-2xl font-bold text-brand-navy">Layout and visibility</h1>
      <p className="mb-5 mt-1 text-sm text-ink/60">
        Show or hide sections, and the cards, logos and tabs inside them. Drag the handle (or use the arrows) to reorder. Delete removes it from the website, and it can always be restored. Changes appear within seconds.
      </p>
      <LayoutEditor sections={sections} />
    </div>
  );
}
