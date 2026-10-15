"use client";

import { useState } from "react";

export default function CopyLoginLink({ url }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch {}
  }
  return (
    <button type="button" onClick={copy} className="h-11 w-full rounded-lg border border-black/10 bg-white text-sm font-medium text-brand-navy transition hover:bg-black/[0.03]">
      {done ? "Copied" : "Copy login link"}
    </button>
  );
}
