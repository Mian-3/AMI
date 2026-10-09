"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageField from "@/components/admin/ImageField";
import BlockEditor from "@/components/admin/BlockEditor";
import { savePost } from "@/app/admin/(panel)/insights/actions";

const FIELD =
  "h-11 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const AREA =
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const LABEL = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

const EMPTY_LOCALE = { title: "", excerpt: "", readTime: "", tags: "", body: [] };

const CATEGORIES = [
  { key: "fragrances", label: "Fragrances" },
  { key: "flavours", label: "Flavours" },
  { key: "rd", label: "R&D" },
  { key: "process", label: "Process" },
];

function loadLocale(src) {
  const base = { ...EMPTY_LOCALE, ...(src || {}) };
  base.tags = Array.isArray(base.tags) ? base.tags.join(", ") : base.tags || "";
  return base;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export default function PostForm({ post }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);
  const [locale, setLocale] = useState("en");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [form, setForm] = useState({
    slug: post?.slug || "",
    status: post?.status || "draft",
    imageUrl: post?.imageUrl || "",
    category: CATEGORIES.some((c) => c.key === post?.data?.en?.category) ? post.data.en.category : "",
    data: {
      en: loadLocale(post?.data?.en),
      ar: loadLocale(post?.data?.ar),
    },
  });

  const setLocaleField = (loc, key, value) =>
    setForm((f) => {
      const next = { ...f, data: { ...f.data, [loc]: { ...f.data[loc], [key]: value } } };
      if (loc === "en" && key === "title" && !slugTouched) next.slug = slugify(value);
      return next;
    });

  function submit(status) {
    setMessage(null);
    startTransition(async () => {
      const res = await savePost({
        id: post?.id ?? null,
        slug: form.slug,
        status,
        imageUrl: form.imageUrl,
        category: form.category,
        data: form.data,
      });
      if (!res.ok) {
        setMessage({ type: "error", text: res.error });
        return;
      }
      if (!post?.id) {
        router.replace(`/admin/insights/${res.id}`);
        return;
      }
      setForm((f) => ({ ...f, status }));
      setMessage({ type: "ok", text: status === "published" ? "Published." : "Saved as draft." });
      router.refresh();
    });
  }

  const current = form.data[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className="mt-6 space-y-6">
      {/* Shared settings */}
      <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-brand-navy">Settings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={LABEL} htmlFor="slug">Slug (web address)</label>
            <input
              id="slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
              }}
              placeholder="my-first-article"
              className={FIELD}
            />
            <p className="mt-1 text-xs text-ink/50">Appears in the link: /insights/{form.slug || "my-first-article"}</p>
          </div>
          <div>
            <label className={LABEL}>Status</label>
            <p className="flex h-11 items-center">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  form.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {form.status === "published" ? "Published" : "Draft"}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-4">
          <label className={LABEL} htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} className={FIELD}>
            <option value="">Choose a category</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
          <p className="mt-1 text-xs text-ink/50">Used for the filter buttons on the Insights page.</p>
        </div>
        <div className="mt-4">
          <ImageField label="Cover image" value={form.imageUrl} onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))} hint="Shown on the article card and at the top of the article. Landscape, at least 1600 px wide." />
        </div>
      </section>

      {/* Language tabs */}
      <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="mb-5 flex gap-2 border-b border-black/5 pb-3">
          {[
            { id: "en", label: "English" },
            { id: "ar", label: "العربية" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setLocale(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                locale === tab.id ? "bg-brand-navy text-white" : "text-ink/70 hover:bg-black/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className={LABEL}>Title {locale === "en" ? "*" : ""}</label>
            <input dir={dir} value={current.title} onChange={(e) => setLocaleField(locale, "title", e.target.value)} className={FIELD} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Tags (separate with commas)</label>
              <input dir={dir} value={current.tags} onChange={(e) => setLocaleField(locale, "tags", e.target.value)} placeholder={locale === "en" ? "Flavours, Innovation" : "النكهات، الابتكار"} className={FIELD} />
            </div>
            <div>
              <label className={LABEL}>Read time</label>
              <input dir={dir} value={current.readTime} onChange={(e) => setLocaleField(locale, "readTime", e.target.value)} placeholder={locale === "en" ? "5 min read" : "٥ دقائق للقراءة"} className={FIELD} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Short summary (shown on cards)</label>
            <textarea dir={dir} rows={3} value={current.excerpt} onChange={(e) => setLocaleField(locale, "excerpt", e.target.value)} className={AREA} />
          </div>
          <div>
            <label className={LABEL}>Article content</label>
            <BlockEditor dir={dir} value={current.body} onChange={(body) => setLocaleField(locale, "body", body)} />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="sticky bottom-0 -mx-4 border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <button type="button" disabled={pending} onClick={() => submit("published")} className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60">
            {pending ? "Saving..." : form.status === "published" ? "Update published article" : "Publish"}
          </button>
          <button type="button" disabled={pending} onClick={() => submit("draft")} className="rounded-lg border border-black/10 px-5 py-2.5 text-sm font-medium transition hover:bg-black/5 disabled:opacity-60">
            {form.status === "published" ? "Unpublish (save as draft)" : "Save draft"}
          </button>
          {message ? (
            <p role="status" className={`text-sm ${message.type === "error" ? "text-red-600" : "text-emerald-700"}`}>{message.text}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
