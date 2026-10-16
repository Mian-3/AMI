"use client";

import { useState, useTransition } from "react";
import FileField from "@/components/admin/FileField";
import ImageField from "@/components/admin/ImageField";
import { saveDownloads } from "@/app/admin/(panel)/downloads/actions";

const FIELD =
  "h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const AREA =
  "min-h-[84px] w-full rounded-lg border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const LABEL = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

const blank = () => ({
  id: `doc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
  published: true,
  file: "",
  icon: "",
  title: { en: "", ar: "" },
  desc: { en: "", ar: "" },
});

const normalise = (it) => ({
  id: it.id,
  published: it.published !== false,
  file: it.file || "",
  icon: it.icon || "",
  title: { en: it.title?.en || "", ar: it.title?.ar || "" },
  desc: { en: it.desc?.en || "", ar: it.desc?.ar || "" },
});

export default function DownloadsForm({ initial }) {
  const [items, setItems] = useState(() => (initial || []).map(normalise));
  const [locale, setLocale] = useState("en");
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);

  const patch = (i, fn) => setItems((list) => list.map((it, n) => (n === i ? fn(it) : it)));
  const setText = (i, group, value) => patch(i, (it) => ({ ...it, [group]: { ...it[group], [locale]: value } }));
  const move = (i, dir) =>
    setItems((list) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const remove = (i) => {
    if (window.confirm("Remove this block? It disappears from the website after you save.")) setItems((list) => list.filter((_, n) => n !== i));
  };

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveDownloads(items);
      setMessage(res.ok ? { type: "ok", text: "Saved. The Downloads page is updating." } : { type: "error", text: res.error });
    });
  }

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className="mt-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {[{ id: "en", label: "English" }, { id: "ar", label: "العربية" }].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setLocale(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${locale === tab.id ? "bg-brand-navy text-white" : "text-ink/70 hover:bg-black/5"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setItems((l) => [...l, blank()])} className="rounded-lg bg-brand-orange px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
          + Add new document
        </button>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/15 bg-white p-8 text-center text-sm text-ink/60">
          No documents yet. Click "Add new document" to create the first block.
        </p>
      ) : null}

      {items.map((it, i) => (
        <section key={it.id} className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-xs font-semibold text-white">{i + 1}</span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${it.published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {it.published ? "Shown on website" : "Hidden"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up" className="h-9 w-9 rounded-lg border border-black/10 text-sm transition hover:bg-black/5 disabled:opacity-40">&uarr;</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down" className="h-9 w-9 rounded-lg border border-black/10 text-sm transition hover:bg-black/5 disabled:opacity-40">&darr;</button>
              <button type="button" onClick={() => remove(i)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50">Delete</button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className={LABEL}>Title {locale === "en" ? "*" : ""}</label>
              <input dir={dir} value={it.title[locale]} onChange={(e) => setText(i, "title", e.target.value)} className={FIELD} />
            </div>
            <div>
              <label className={LABEL}>Short description</label>
              <textarea dir={dir} value={it.desc[locale]} onChange={(e) => setText(i, "desc", e.target.value)} className={AREA} />
              {locale === "ar" ? <p className="mt-1 text-xs text-ink/50">If left empty, the English text is shown on the Arabic page.</p> : null}
            </div>
            <FileField
              label="PDF file"
              value={it.file}
              onChange={(url) => patch(i, (x) => ({ ...x, file: url }))}
              accept="application/pdf,.pdf"
              hint="Upload a PDF or paste a link. It opens in a new tab when a visitor clicks the block."
            />
            <ImageField
              label="Icon (optional)"
              value={it.icon}
              onChange={(url) => patch(i, (x) => ({ ...x, icon: url }))}
              hint="Small picture shown on the left of the block. Square PNG with a transparent background works best. If empty, the default icon is used."
            />
            <label className="flex items-center gap-2 text-sm text-ink/80">
              <input type="checkbox" checked={it.published} onChange={(e) => patch(i, (x) => ({ ...x, published: e.target.checked }))} className="h-4 w-4 accent-[#f58b32]" />
              Show on website
            </label>
          </div>
        </section>
      ))}

      <div className="sticky bottom-0 -mx-4 border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <button type="button" disabled={pending} onClick={save} className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60">
            {pending ? "Saving..." : "Save changes"}
          </button>
          {message ? <p role="status" className={`text-sm ${message.type === "error" ? "text-red-600" : "text-emerald-700"}`}>{message.text}</p> : null}
        </div>
      </div>
    </div>
  );
}
