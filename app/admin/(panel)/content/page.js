import Link from "next/link";
import { GROUPS, getOverrides } from "@/lib/siteContent";

export const dynamic = "force-dynamic";

export default async function ContentIndexPage() {
  const overrides = await getOverrides();

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-brand-navy">Site content</h1>
      <p className="mt-1 text-sm text-ink/60">
        Edit the text on every page, in English and Arabic. Changes appear on the live website within seconds.
      </p>

      <div className="mt-6 space-y-6">
        {GROUPS.map((group) => (
          <section key={group.id}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">{group.label}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {group.sections.map((section) => {
                const changed = Boolean(overrides[section.key]);
                return (
                  <li key={section.key}>
                    <Link
                      href={`/admin/content/${section.key}`}
                      className="flex items-center justify-between rounded-xl border border-black/5 bg-white px-4 py-3.5 shadow-sm transition hover:border-brand-orange/40 hover:shadow-md"
                    >
                      <span className="font-medium text-brand-navy">{section.label}</span>
                      {changed ? (
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Edited</span>
                      ) : (
                        <span className="text-xs text-ink/40">Default</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
