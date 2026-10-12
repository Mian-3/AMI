"use client";

import { useRef, useState } from "react";

const MAX_SIDE = 2200; // longest side in pixels, plenty for full width hero images
const QUALITY = 0.82; // WebP quality: visually the same as the original for photos and logos

function formatSize(bytes) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

// Shrinks the image in the browser before upload: resized if very large, converted to WebP
// (keeps transparency). If anything fails, or the result is not smaller, the original is used.
async function optimise(file) {
  if (!/^image\/(jpeg|png|webp|avif)$/.test(file.type)) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
    // Some browsers cannot encode WebP and silently return PNG, so check the type.
    if (!blob || blob.type !== "image/webp") return file;
    if (blob.size >= file.size && scale === 1) return file;
    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${base}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

export default function ImageField({ label, value, onChange, hint }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function handleFile(event) {
    const original = event.target.files?.[0];
    event.target.value = "";
    if (!original) return;

    setError("");
    setNote("");
    setBusy(true);
    try {
      const file = await optimise(original);
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.url) throw new Error(json.error || "Upload failed.");
      onChange(json.url);
      if (file !== original) setNote(`Optimised: ${formatSize(original.size)} to ${formatSize(file.size)}`);
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
              {busy ? "Optimising and uploading..." : value ? "Replace image" : "Upload image"}
            </button>
            {value ? (
              <button type="button" onClick={() => onChange("")} className="rounded-lg px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50">
                Remove
              </button>
            ) : null}
          </div>
          <p className="mt-1.5 text-xs text-ink/50">{hint || "JPG, PNG, WebP or AVIF. Images are optimised automatically."}</p>
          {note ? <p role="status" className="mt-1 text-xs text-emerald-700">{note}</p> : null}
          {error ? <p role="alert" className="mt-1 text-xs text-red-600">{error}</p> : null}
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={handleFile} className="hidden" />
    </div>
  );
}
