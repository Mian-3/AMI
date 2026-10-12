"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

const INPUT =
  "h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";

// Upload a large file (PDF, video) straight to storage, or paste an existing link.
export default function FileField({ label, value, onChange, accept, hint }) {
  const inputRef = useRef(null);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  async function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setError("");
    setProgress(0);
    try {
      const blob = await upload(`uploads/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blob-upload",
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      onChange(blob.url);
    } catch (e) {
      setError(e.message || "Upload failed.");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div>
      {label ? <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-ink/60">{label}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <input value={value || ""} onChange={(e) => onChange(e.target.value)} className={`${INPUT} min-w-0 flex-1`} aria-label={label} />
        <input ref={inputRef} type="file" accept={accept} onChange={handleFile} className="hidden" />
        <button
          type="button"
          disabled={progress !== null}
          onClick={() => inputRef.current?.click()}
          className="h-10 rounded-lg border border-black/10 px-4 text-sm font-medium transition hover:bg-black/5 disabled:opacity-60"
        >
          {progress !== null ? `Uploading ${progress}%` : "Upload file"}
        </button>
        {value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-orange hover:underline">
            Open
          </a>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-xs text-ink/50">{hint}</p> : null}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
