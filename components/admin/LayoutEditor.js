"use client";

import { useRef, useState, useTransition } from "react";
import { setSectionState, setItemState, setItemOrder } from "@/app/admin/(panel)/pages/actions";

const I = {
  eye: <><path d="M1.5 10S4.7 4.5 10 4.5 18.5 10 18.5 10 15.3 15.5 10 15.5 1.5 10 1.5 10Z" /><circle cx="10" cy="10" r="2.4" /></>,
  eyeOff: <><path d="M2.5 2.5l15 15M8.2 4.7A8 8 0 0 1 10 4.5c5.3 0 8.5 5.5 8.5 5.5a14 14 0 0 1-2.6 3.2M5.6 6.1A14 14 0 0 0 1.5 10s3.2 5.5 8.5 5.5a8 8 0 0 0 3.3-.7" /><path d="M8.4 8.4a2.4 2.4 0 0 0 3.2 3.2" /></>,
  trash: <path d="M4 5.5h12M8 5.5V4h4v1.5M5.5 5.5l.7 10.5h7.6l.7-10.5M8.5 8.5v5M11.5 8.5v5" />,
  up: <path d="M5 12l5-5 5 5" />,
  down: <path d="M5 8l5 5 5-5" />,
  restore: <path d="M4 10a6 6 0 1 0 2-4.5M4 3.5v3h3" />,
};
const Icon = ({ n }) => (
  <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{I[n]}</svg>
);
const Grip = () => (
  <svg viewBox="0 0 12 18" width="12" height="18" fill="currentColor" aria-hidden="true">
    {[3, 9, 15].flatMap((y) => [3, 9].map((x) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.3" />))}
  </svg>
);

const iconBtn = "flex h-8 w-8 items-center justify-center rounded-md text-ink/60 transition hover:bg-black/[0.06] hover:text-brand-navy disabled:opacity-30";

function ItemList({ list, onError }) {
  const [items, setItems] = useState(list.items);
  const [pending, start] = useTransition();
  const dragFrom = useRef(null);
  const live = items.filter((x) => x.state !== "deleted");
  const gone = items.filter((x) => x.state === "deleted");

  const persistOrder = (next) =>
    start(async () => {
      const r = await setItemOrder(list.listId, next.map((x) => x.i));
      if (!r.ok) onError(r.error);
    });

  function move(from, to) {
    if (to < 0 || to >= live.length || from === to) return;
    const l = [...live];
    const [m] = l.splice(from, 1);
    l.splice(to, 0, m);
    const next = [...l, ...gone];
    setItems(next);
    return next;
  }

  function setState(i, state) {
    if (state === "deleted" && !window.confirm("Delete this from the website? You can restore it from the Deleted list.")) return;
    onError("");
    const prev = items;
    setItems((s) => s.map((x) => (x.i === i ? { ...x, state } : x)));
    start(async () => {
      const r = await setItemState(list.listId, i, state);
      if (!r.ok) {
        setItems(prev);
        onError(r.error);
      }
    });
  }

  return (
    <div className="mt-2">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">{list.label} <span className="font-normal normal-case tracking-normal">({live.filter((x) => x.state !== "hidden").length} visible of {items.length})</span></p>
      <ul className="space-y-1.5">
        {live.map((x, pos) => {
          const hidden = x.state === "hidden";
          return (
            <li
              key={x.i}
              draggable
              onDragStart={() => (dragFrom.current = pos)}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragFrom.current !== null && dragFrom.current !== pos) {
                  move(dragFrom.current, pos);
                  dragFrom.current = pos;
                }
              }}
              onDragEnd={() => {
                dragFrom.current = null;
                persistOrder(items);
              }}
              className={`flex items-center gap-2 rounded-lg border bg-white px-2 py-1.5 transition ${hidden ? "border-black/5 opacity-55" : "border-black/10"}`}
            >
              <span className="cursor-grab touch-none px-1 text-ink/30 active:cursor-grabbing" title="Drag to reorder"><Grip /></span>
              {x.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={x.thumb} alt="" className="h-8 w-12 shrink-0 rounded bg-black/[0.04] object-contain" loading="lazy" />
              ) : null}
              <span className={`min-w-0 flex-1 truncate text-[13px] ${hidden ? "text-ink/50 line-through" : "text-ink"}`}>{x.label}</span>
              <span className="flex shrink-0 items-center">
                <button type="button" disabled={pos === 0} onClick={() => persistOrder(move(pos, pos - 1) || items)} className={iconBtn} aria-label="Move up"><Icon n="up" /></button>
                <button type="button" disabled={pos === live.length - 1} onClick={() => persistOrder(move(pos, pos + 1) || items)} className={iconBtn} aria-label="Move down"><Icon n="down" /></button>
                <button type="button" disabled={pending} onClick={() => setState(x.i, hidden ? "shown" : "hidden")} className={iconBtn} aria-label={hidden ? "Show" : "Hide"} title={hidden ? "Show on website" : "Hide from website"}><Icon n={hidden ? "eyeOff" : "eye"} /></button>
                <button type="button" disabled={pending} onClick={() => setState(x.i, "deleted")} className={`${iconBtn} hover:!bg-red-50 hover:!text-red-600`} aria-label="Delete" title="Delete"><Icon n="trash" /></button>
              </span>
            </li>
          );
        })}
      </ul>
      {gone.length ? (
        <div className="mt-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/40">Deleted</p>
          <ul className="space-y-1">
            {gone.map((x) => (
              <li key={x.i} className="flex items-center gap-2 rounded-lg border border-dashed border-black/10 px-3 py-1.5">
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink/45">{x.label}</span>
                <button type="button" disabled={pending} onClick={() => setState(x.i, "shown")} className="flex items-center gap-1.5 rounded-md border border-black/10 px-2.5 py-1 text-[12px] font-medium text-ink hover:bg-black/[0.03]">
                  <Icon n="restore" /> Restore
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function SectionBlock({ section, onError }) {
  const [state, setState] = useState(section.state);
  const [pending, start] = useTransition();
  const hidden = state === "hidden";
  const deleted = state === "deleted";

  function change(next) {
    if (next === "deleted" && !window.confirm("Delete this section from the website? The sections below will move up. You can restore it later.")) return;
    onError("");
    const prev = state;
    setState(next);
    start(async () => {
      const r = await setSectionState(section.id, next);
      if (!r.ok) {
        setState(prev);
        onError(r.error);
      }
    });
  }

  return (
    <section className={`rounded-xl border bg-white shadow-sm ${deleted ? "border-dashed border-black/15" : "border-black/5"}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <span className={`h-2 w-2 shrink-0 rounded-full ${deleted ? "bg-red-400" : hidden ? "bg-amber-400" : "bg-emerald-500"}`} aria-hidden="true" />
        <h2 className={`min-w-0 flex-1 truncate text-[14px] font-semibold ${deleted || hidden ? "text-ink/45" : "text-brand-navy"} ${hidden ? "line-through" : ""}`}>{section.label}</h2>
        <span className="text-[11px] text-ink/45">{deleted ? "Deleted" : hidden ? "Hidden" : "Visible"}</span>
        {deleted ? (
          <button type="button" disabled={pending} onClick={() => change("shown")} className="flex items-center gap-1.5 rounded-md border border-black/10 px-2.5 py-1 text-[12px] font-medium text-ink hover:bg-black/[0.03]"><Icon n="restore" /> Restore</button>
        ) : (
          <span className="flex items-center">
            <button type="button" disabled={pending} onClick={() => change(hidden ? "shown" : "hidden")} className={iconBtn} aria-label={hidden ? "Show section" : "Hide section"} title={hidden ? "Show section" : "Hide section"}><Icon n={hidden ? "eyeOff" : "eye"} /></button>
            <button type="button" disabled={pending} onClick={() => change("deleted")} className={`${iconBtn} hover:!bg-red-50 hover:!text-red-600`} aria-label="Delete section" title="Delete section"><Icon n="trash" /></button>
          </span>
        )}
      </div>
      {!deleted && section.lists.length ? (
        <div className="border-t border-black/5 bg-black/[0.015] px-4 pb-4 pt-2">
          {section.lists.map((l) => (
            <ItemList key={l.listId} list={l} onError={onError} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default function LayoutEditor({ sections }) {
  const [error, setError] = useState("");
  return (
    <div className="space-y-3">
      {error ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</p> : null}
      {sections.map((s) => (
        <SectionBlock key={s.id} section={s} onError={setError} />
      ))}
    </div>
  );
}
