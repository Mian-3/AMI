import { getDictionary } from "@/lib/getDictionary";
import { getSavedStats } from "@/lib/homeStatsServer";
import { defaultItems } from "@/lib/homeStats";
import { getOverrides } from "@/lib/siteContent";
import HomeForm from "@/components/admin/HomeForm";

export const dynamic = "force-dynamic";

export default async function HomeAdminPage() {
  const [en, ar] = await Promise.all([getDictionary("en"), getDictionary("ar")]);
  const saved = await getSavedStats();
  const overrides = await getOverrides();

  const pick = (i) => ({ eyebrow: i.eyebrow, heading: i.heading, paragraph1: i.paragraph1, paragraph2: i.paragraph2 });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-brand-navy">Intro and Stats</h1>
      <p className="mt-1 text-sm text-ink/60">The introduction text and the statistics cards under it.</p>
      <HomeForm
        intro={{ en: pick(en.intro), ar: pick(ar.intro) }}
        introEdited={Boolean(overrides.intro)}
        stats={saved || defaultItems(en.stats, ar.stats)}
        statsEdited={Boolean(saved)}
      />
    </div>
  );
}