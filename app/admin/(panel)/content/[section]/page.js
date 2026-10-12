import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary as getBaseDictionary } from "@/lib/baseDictionary";
import { SECTION_MAP, editableShape, deepMerge, getOverrides } from "@/lib/siteContent";
import ContentForm from "@/components/admin/ContentForm";

export const dynamic = "force-dynamic";

export default async function ContentSectionPage({ params }) {
  const { section } = await params;
  const meta = SECTION_MAP[section];
  if (!meta) notFound();

  const overrides = await getOverrides();
  const defaults = {};
  const current = {};
  for (const lang of ["en", "ar"]) {
    const base = editableShape(section, (await getBaseDictionary(lang))[section]);
    defaults[lang] = base;
    current[lang] = deepMerge(base, overrides[section]?.[lang]);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm text-ink/50">
        <Link href="/admin/content" className="hover:text-brand-orange">Site content</Link> / {meta.group}
      </p>
      <h1 className="mt-1 text-2xl font-bold text-brand-navy">{meta.label}</h1>
      <ContentForm section={section} defaults={defaults} initial={current} hasOverrides={Boolean(overrides[section])} />
    </div>
  );
}
