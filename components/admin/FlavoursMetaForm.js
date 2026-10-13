"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveFlavoursMeta, resetFlavoursMeta } from "@/app/admin/(panel)/flavours/actions";

const FIELD =
  "h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const LABEL = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

export default function FlavoursMetaForm({ initial, groups }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);
  const [meta, setMeta] = useState(initial);

  const setCard = (group, index, patch) =>
    setMeta((m) => ({ ...m, [group]: m[group].map((c, i) => (i === index ? { ...c, ...patch } : c)) }));

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveFlavoursMeta(meta);
      if (!res.ok) return setMessage({ type: "error", text: res.error });
      setMessage({ type: "ok", text: "Saved. The website is updating." });
      router.refresh();
    });
  }

  function reset() {
    if (!window.confirm("Reset every card to: available in both formats, no link?")) return;
    startTransition(async () => {
      const res = await resetFlavoursMeta();
      if (!res.ok) return setMessage({ type: "error", text: res.error });
      setMessage({ type: "ok", text: "Reset to the defaults." });
      router.refresh();
      setTimeout(() => window.location.reload(), 300);
    });
  }

  return (
    <div className="mt-6 space-y-8">
      {groups.map((group) => (
        <section key={group.key}>
          <h2 className="mb-3 text-lg font-semibold text-brand-navy">{group.title}</h2>
          <ul className="space-y-3">
            {group.items.map((item, i) => {
              const c = meta[group.key][i];
              const hidden = !c.liquid && !c.powder;
              return (
                <li key={i} className="rounded-xl border border-black/5 bg-white p-4 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                    <div className="flex items-center gap-3 md:block">
                      <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-black/5 md:h-24 md:w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <p className="text-sm font-semibold text-brand-navy md:mt-2">{item.title}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className={LABEL}>Available formats</p>
                        <div className="flex flex-wrap gap-4">
                          <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <input type="checkbox" className="h-4 w-4 accent-[#e8731a]" checked={c.liquid} onChange={(e) => setCard(group.key, i, { liquid: e.target.checked })} />
                            {group.liquid}
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <input type="checkbox" className="h-4 w-4 accent-[#e8731a]" checked={c.powder} onChange={(e) => setCard(group.key, i, { powder: e.target.checked })} />
                            {group.powder}
                          </label>
                        </div>
                        {hidden ? <p className="mt-1.5 text-xs text-amber-700">Neither format is ticked, so this card is hidden on the website.</p> : null}
                      </div>
                      <div>
                        <label className={LABEL}>Link when the card is clicked</label>
                        <input
                          value={c.href}
                          onChange={(e) => setCard(group.key, i, { href: e.target.value })}
                          placeholder="Leave empty for no link"
                          className={FIELD}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <p className="text-xs text-ink/50">
        Links: use /{"{locale}"}/contact style for pages on this site ({"{locale}"} becomes en or ar), or a full https:// link for other sites. Empty means the card is not clickable.
      </p>

      <div className="sticky bottom-0 -mx-4 border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <button type="button" disabled={pending} onClick={save} className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60">
            {pending ? "Saving..." : "Save changes"}
          </button>
          <button type="button" disabled={pending} onClick={reset} className="rounded-lg border border-black/10 px-5 py-2.5 text-sm font-medium transition hover:bg-black/5 disabled:opacity-60">
            Reset to defaults
          </button>
          {message ? <p role="status" className={`text-sm ${message.type === "error" ? "text-red-600" : "text-emerald-700"}`}>{message.text}</p> : null}
        </div>
      </div>
    </div>
  );
}
