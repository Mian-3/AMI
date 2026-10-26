"use client";

import { useState, useTransition } from "react";
import { setSectionState } from "@/app/admin/(panel)/pages/actions";

// Show / hide / delete controls for the sections of one page.
export default function SectionLayout({ page, initial, compact = false, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [state, setState] = useState(initial); // { "home.hero": "hidden" | "deleted" }
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const idOf = (k) => `${page.id}.${k}`;
  const st = (k) => state[idOf(k)] || "shown";
  const deletedCount = page.sections.filter(([k]) => st(k) === "deleted").length;
  const hiddenCount = page.sections.filter(([k]) => st(k) === "hidden").length;

  function change(k, next) {
    if (next === "deleted" && !window.confirm("Delete this section from the website? The sections below will move up. You can restore it later from the Deleted list.")) return;
    setError("");
    start(async () => {
      const res = await setSectionState(idOf(k), next);
      if (!res.ok) return setError(res.error);
      setState((s) => {
        const copy = { ...s };
        if (next === "shown") delete copy[idOf(k)];
        else copy[idOf(k)] = next;
        return copy;
      });
    });
  }

  const btn = "rounded-md border px-2.5 py-1 text-[12px] font-medium transition disabled:opacity-50";
  const live = page.sections.filter(([k]) => st(k) !== "deleted");
  const gone = page.sections.filter(([k]) => st(k) === "deleted");

  return (
    <div className={`${compact ? "mt-6 hidden lg:block" : "mt-4"} border-t border-black/5 pt-3`}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between text-left text-[12px] font-semibold text-brand-navy">
        <span>
          Show, hide or delete sections
          {hiddenCount + deletedCount ? <span className="ml-2 font-normal text-ink/50">{hiddenCount ? `${hiddenCount} hidden` : ""}{hiddenCount && deletedCount ? ", " : ""}{deletedCount ? `${deletedCount} deleted` : ""}</span> : null}
        </span>
        <span aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {open ? (
        <div className="mt-3 space-y-1.5">
          {live.map(([k, label]) => {
            const hidden = st(k) === "hidden";
            return (
              <div key={k} className={`flex gap-2 rounded-lg bg-black/[0.025] px-3 py-2 ${compact ? "flex-col" : "items-center justify-between"}`}>
                <span className={`text-[13px] ${hidden ? "text-ink/40 line-through" : "text-ink"}`}>{label}{hidden ? <em className="ml-2 text-[11px] not-italic no-underline text-ink/45">hidden</em> : null}</span>
                <span className="flex shrink-0 gap-1.5">
                  <button type="button" disabled={pending} onClick={() => change(k, hidden ? "shown" : "hidden")} className={`${btn} border-black/10 text-ink hover:bg-white`}>
                    {hidden ? "Show" : "Hide"}
                  </button>
                  <button type="button" disabled={pending} onClick={() => change(k, "deleted")} className={`${btn} border-red-200 text-red-600 hover:bg-red-50`}>
                    Delete
                  </button>
                </span>
              </div>
            );
          })}
          {gone.length ? (
            <div className="pt-2">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">Deleted</p>
              {gone.map(([k, label]) => (
                <div key={k} className={`flex gap-2 rounded-lg border border-dashed border-black/10 px-3 py-2 ${compact ? "flex-col" : "items-center justify-between"}`}>
                  <span className="text-[13px] text-ink/50">{label}</span>
                  <button type="button" disabled={pending} onClick={() => change(k, "shown")} className={`${btn} border-black/10 text-ink hover:bg-black/[0.03]`}>
                    Restore
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          {error ? <p role="alert" className="text-[12px] text-red-600">{error}</p> : null}
          <p className="text-[11px] leading-4 text-ink/45">Hidden or deleted sections leave the website within seconds and the sections below move up. Your text and images are kept.</p>
        </div>
      ) : null}
    </div>
  );
}
