import { getDictionary } from "@/lib/getDictionary";
import { getFlavoursMeta } from "@/lib/flavoursMeta";
import FlavoursMetaForm from "@/components/admin/FlavoursMetaForm";

export const dynamic = "force-dynamic";

export default async function FlavoursAdminPage() {
  const dict = await getDictionary("en");
  const meta = await getFlavoursMeta();
  const t = dict.flavoursPage;

  const groups = [
    { key: "food", title: t.food.heading, liquid: t.food.liquid, powder: t.food.powder, items: t.food.items.map((i) => ({ title: i.title, image: i.image })) },
    { key: "fragrance", title: t.fragrance.heading, liquid: t.fragrance.liquid, powder: t.fragrance.powder, items: t.fragrance.items.map((i) => ({ title: i.title, image: i.image })) },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-brand-navy">Products and logos</h1>
      <p className="mt-1 text-sm text-ink/60">
        Choose which formats each category is available in (this drives the Liquid and Dry Powder buttons) and where each card links to.
      </p>
      <FlavoursMetaForm initial={meta} groups={groups} />
    </div>
  );
}
