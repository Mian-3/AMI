"use client";

import { useRef, useState } from "react";

export default function ImageField({ label, value, onChange, hint }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.url) throw new Error(json.error || "Upload failed.");
      onChange(json.url);
    } catch (e) {
      setError(e.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {label ? <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink/60">{label}</p> : null}
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-dashed border-black/15 bg-white p-3">
        <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/5 text-xs text-ink/40">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            "No image"
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="rounded-lg border border-black/10 px-3 py-1.5 text-sm transition hover:bg-black/5 disabled:opacity-60"
            >
              {busy ? "Uploading..." : value ? "Replace image" : "Upload image"}
            </button>
            {value ? (
              <button type="button" onClick={() => onChange("")} className="rounded-lg px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50">
                Remove
              </button>
            ) : null}
          </div>
          <p className="mt-1.5 text-xs text-ink/50">{hint || "JPG, PNG, WebP or AVIF, up to 6 MB."}</p>
          {error ? <p role="alert" className="mt-1 text-xs text-red-600">{error}</p> : null}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleFile} className="hidden" />
    </div>
  );
}
