"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageField from "@/components/admin/ImageField";
import { saveSection, resetSection } from "@/app/admin/(panel)/content/actions";

const FIELD =
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const LABEL = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

function nice(key) {
  const spaced = String(key).replace(/([A-Z])/g, " $1").replace(/(\d+)/g, " $1").replace(/_/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function setIn(obj, path, value) {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[head] = setIn(obj?.[head], rest, value);
  return copy;
}

function getIn(obj, path) {
  return path.reduce((acc, k) => (acc == null ? undefined : acc[k]), obj);
}

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

export default function ContentForm({ section, defaults, initial, hasOverrides }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);
  const [values, setValues] = useState(initial);

  const update = (lang, path, value) => setValues((v) => ({ ...v, [lang]: setIn(v[lang], path, value) }));
  const updateBoth = (path, value) => setValues((v) => ({ en: setIn(v.en, path, value), ar: setIn(v.ar, path, value) }));

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveSection(section, values);
      if (!res.ok) return setMessage({ type: "error", text: res.error });
      setMessage({ type: "ok", text: "Saved. The website is updating." });
      router.refresh();
    });
  }

  function reset() {
    if (!window.confirm("Reset this section to the original text? Your changes in it will be removed.")) return;
    setMessage(null);
    startTransition(async () => {
      const res = await resetSection(section);
      if (!res.ok) return setMessage({ type: "error", text: res.error });
      setValues(defaults);
      setMessage({ type: "ok", text: "Reset to the original text." });
      router.refresh();
    });
  }

  // Draws every field found in the default text, in the same order as the site.
  function renderNode(node, path, depth) {
    const key = path[path.length - 1];

    if (typeof node === "string") {
      if (/image$/i.test(String(key))) {
        const current = getIn(values.en, path) || "";
        return (
          <div key={path.join(".")} className="py-3">
            <ImageField label={nice(key)} value={current} onChange={(url) => updateBoth(path, url)} hint="Used on both English and Arabic pages." />
          </div>
        );
      }
      const long = node.length > 60 || node.includes("\n");
      const Tag = long ? "textarea" : "input";
      return (
        <div key={path.join(".")} className="py-3">
          <label className={LABEL}>{nice(key)}</label>
          <div className="grid gap-3 md:grid-cols-2">
            {["en", "ar"].map((lang) => (
              <Tag
                key={lang}
                dir={lang === "ar" ? "rtl" : "ltr"}
                lang={lang}
                {...(long ? { rows: Math.min(6, Math.ceil(node.length / 55)) } : {})}
                value={getIn(values[lang], path) ?? ""}
                onChange={(e) => update(lang, path, e.target.value)}
                className={`${FIELD} ${long ? "" : "h-10"}`}
                aria-label={`${nice(key)} (${lang === "en" ? "English" : "Arabic"})`}
              />
            ))}
          </div>
        </div>
      );
    }

    if (Array.isArray(node)) {
      if (node.every((x) => typeof x === "string")) {
        return (
          <div key={path.join(".")} className="py-3">
            <label className={LABEL}>{nice(key)} (one per line)</label>
            <div className="grid gap-3 md:grid-cols-2">
              {["en", "ar"].map((lang) => (
                <textarea
                  key={lang}
                  dir={lang === "ar" ? "rtl" : "ltr"}
                  lang={lang}
                  rows={Math.max(3, (getIn(values[lang], path) || []).length + 1)}
                  value={(getIn(values[lang], path) || []).join("\n")}
                  onChange={(e) => update(lang, path, e.target.value.split("\n"))}
                  className={FIELD}
                  aria-label={`${nice(key)} (${lang === "en" ? "English" : "Arabic"})`}
                />
              ))}
            </div>
          </div>
        );
      }
      return (
        <div key={path.join(".")} className="py-3">
          <p className="text-sm font-semibold text-brand-navy">{nice(key)}</p>
          <div className="mt-2 space-y-3">
            {node.map((item, i) => (
              <div key={i} className="rounded-lg border border-black/10 bg-[#fafafa] px-4 py-1">
                <p className="pt-3 text-xs font-semibold uppercase tracking-wide text-brand-orange">Item {i + 1}</p>
                {renderNode(item, [...path, i], depth + 1)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (isObject(node)) {
      // The top level has no extra box. Nested groups get a heading and a divider.
      return (
        <div key={path.join(".") || "root"} className={depth === 0 ? "" : "py-3"}>
          {path.length > 0 && typeof key === "string" ? (
            <p className="mt-2 border-b border-black/5 pb-1 text-sm font-semibold text-brand-navy">{nice(key)}</p>
          ) : null}
          <div className={path.length > 0 && typeof key === "string" ? "ps-0" : ""}>
            {Object.entries(node).map(([k, v]) => renderNode(v, [...path, k], depth + 1))}
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <div className="mt-6 space-y-6">
      <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
        <div className="mb-2 hidden grid-cols-2 gap-3 border-b border-black/5 pb-3 md:grid">
          <p className="text-sm font-semibold text-brand-navy">English</p>
          <p className="text-sm font-semibold text-brand-navy" dir="rtl">العربية</p>
        </div>
        <div className="divide-y divide-black/5">{renderNode(defaults.en, [], 0)}</div>
      </section>

      <div className="sticky bottom-0 -mx-4 border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          <button type="button" disabled={pending} onClick={save} className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60">
            {pending ? "Saving..." : "Save changes"}
          </button>
          {hasOverrides ? (
            <button type="button" disabled={pending} onClick={reset} className="rounded-lg border border-black/10 px-5 py-2.5 text-sm font-medium transition hover:bg-black/5 disabled:opacity-60">
              Reset to original
            </button>
          ) : null}
          {message ? (
            <p role="status" className={`text-sm ${message.type === "error" ? "text-red-600" : "text-emerald-700"}`}>{message.text}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
