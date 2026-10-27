"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageField from "@/components/admin/ImageField";
import { saveEvent } from "@/app/admin/(panel)/events/actions";

const FIELD =
  "h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const LABEL = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

export default function EventForm({ event }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);
  const [locale, setLocale] = useState("en");
  const [form, setForm] = useState({
    status: event?.status || "draft",
    date: event?.date || "",
    endDate: event?.endDate || "",
    imageUrl: event?.imageUrl || "",
    heroImage: event?.heroImage || "",
    data: {
      en: { title: "", location: "", ...(event?.data?.en || {}) },
      ar: { title: "", location: "", ...(event?.data?.ar || {}) },
    },
  });

  const setText = (loc, key, value) =>
    setForm((f) => ({ ...f, data: { ...f.data, [loc]: { ...f.data[loc], [key]: value } } }));

  function submit(status) {
    setMessage(null);
    startTransition(async () => {
      const res = await saveEvent({
        id: event?.id ?? null,
        status,
        date: form.date,
        endDate: form.endDate,
        imageUrl: form.imageUrl,
        heroImage: form.heroImage,
        data: form.data,
      });
      if (!res.ok) return setMessage({ type: "error", text: res.error });
      if (!event?.id) return router.replace(`/admin/events/${res.id}`);
      setForm((f) => ({ ...f, status }));
      setMessage({ type: "ok", text: status === "published" ? "Published. The website is updating." : "Saved as draft." });
      router.refresh();
    });
  }

  const current = form.data[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className="mt-6 space-y-6">
      <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-brand-navy">Event details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="date">Start date *</label>
            <input id="date" type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className={FIELD} />
            <p className="mt-1 text-xs text-ink/50">The next event to happen becomes the big banner. Upcoming events are listed by start date.</p>
          </div>
          <div>
            <label className={LABEL} htmlFor="endDate">End date (optional)</label>
            <input id="endDate" type="date" min={form.date || undefined} value={form.endDate} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} className={FIELD} />
            <p className="mt-1 text-xs text-ink/50">Leave empty for a one day event. After this day the event moves to Previous Events by itself.</p>
          </div>
          <div>
            <label className={LABEL}>Status</label>
            <p className="flex h-11 items-center">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${form.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                {form.status === "published" ? "Published" : "Draft (hidden on the website)"}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <ImageField label="Card image *" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} hint="Landscape, at least 1200 px wide." />
        </div>
      </section>

      <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="mb-5 flex gap-2 border-b border-black/5 pb-3">
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
        <div className="space-y-4">
          <div>
            <label className={LABEL}>Title {locale === "en" ? "*" : ""}</label>
            <input dir={dir} value={current.title} onChange={(e) => setText(locale, "title", e.target.value)} className={FIELD} />
          </div>
          <div>
            <label className={LABEL}>Location {locale === "en" ? "*" : ""}</label>
            <input dir={dir} value={current.location} onChange={(e) => setText(locale, "location", e.target.value)} className={FIELD} />
          </div>
          {locale === "ar" ? <p className="text-xs text-ink/50">If left empty, the English text is shown on the Arabic page.</p> : null}
        </div>
      </section>

      <div className="sticky bottom-0 -mx-4 border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <button type="button" disabled={pending} onClick={() => submit("published")} className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60">
            {pending ? "Saving..." : form.status === "published" ? "Update published event" : "Publish"}
          </button>
          <button type="button" disabled={pending} onClick={() => submit("draft")} className="rounded-lg border border-black/10 px-5 py-2.5 text-sm font-medium transition hover:bg-black/5 disabled:opacity-60">
            {form.status === "published" ? "Unpublish (save as draft)" : "Save draft"}
          </button>
          {message ? <p role="status" className={`text-sm ${message.type === "error" ? "text-red-600" : "text-emerald-700"}`}>{message.text}</p> : null}
        </div>
      </div>
    </div>
  );
}
