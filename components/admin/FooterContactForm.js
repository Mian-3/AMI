"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveFooterContact, resetFooterContact } from "@/app/admin/(panel)/footer/actions";
import { MAX_ITEMS } from "@/lib/footerContact";

const FIELD =
  "h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const BTN = "rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-brand-orange hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-40";
const PRIMARY = "rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60";

function Chevron({ dir }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "up" ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
    </svg>
  );
}

function List({ title, hint, items, setItems, type, placeholder, addLabel }) {
  const set = (id, value) => setItems((l) => l.map((x) => (x.id === id ? { ...x, value } : x)));
  const remove = (id) => setItems((l) => l.filter((x) => x.id !== id));
  const move = (id, d) =>
    setItems((l) => {
      const i = l.findIndex((x) => x.id === id);
      const j = i + d;
      if (i < 0 || j < 0 || j >= l.length) return l;
      const copy = [...l];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  return (
    <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-brand-navy">{title}</h2>
      <p className="mt-1 text-sm text-ink/60">{hint}</p>
      <ul className="mt-4 space-y-2.5">
        {items.map((it, i) => (
          <li key={it.id} className="flex items-center gap-2">
            <input
              type={type}
              dir="ltr"
              value={it.value}
              onChange={(e) => set(it.id, e.target.value)}
              placeholder={placeholder}
              maxLength={80}
              className={FIELD}
              aria-label={`${title} ${i + 1}`}
            />
            <button type="button" onClick={() => move(it.id, -1)} disabled={i === 0} aria-label="Move up" className={BTN}>
              <Chevron dir="up" />
            </button>
            <button type="button" onClick={() => move(it.id, 1)} disabled={i === items.length - 1} aria-label="Move down" className={BTN}>
              <Chevron dir="down" />
            </button>
            <button type="button" onClick={() => remove(it.id)} className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
              Remove
            </button>
          </li>
        ))}
        {items.length === 0 ? <li className="text-sm text-ink/50">Nothing added. This will not be shown in the footer.</li> : null}
      </ul>
      <button type="button" onClick={() => setItems((l) => (l.length >= MAX_ITEMS ? l : [...l, { id: `n${Date.now()}${l.length}`, value: "" }]))} disabled={items.length >= MAX_ITEMS} className={`${BTN} mt-4`}>
        + {addLabel}
      </button>
      <span className="ms-3 text-xs text-ink/50">
        {items.length} of {MAX_ITEMS}
      </span>
    </section>
  );
}

export default function FooterContactForm({ initial, edited, address }) {
  const router = useRouter();
  const counter = useRef(0);
  const wrap = (list) => list.map((value) => ({ id: `i${++counter.current}`, value }));
  const [phones, setPhones] = useState(() => wrap(initial.phones));
  const [emails, setEmails] = useState(() => wrap(initial.emails));
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveFooterContact({ phones: phones.map((p) => p.value), emails: emails.map((e) => e.value) });
      if (!res.ok) return setMessage({ type: "error", text: res.error });
      setPhones(wrap(res.value.phones));
      setEmails(wrap(res.value.emails));
      setMessage({ type: "ok", text: "Saved. The website is updating. Empty or invalid lines were removed." });
      router.refresh();
    });
  }

  function reset() {
    if (!window.confirm("Go back to the single phone number and email from the site text?")) return;
    startTransition(async () => {
      const res = await resetFooterContact();
      if (!res.ok) return setMessage({ type: "error", text: res.error });
      window.location.reload();
    });
  }

  const shownPhones = phones.map((p) => p.value.trim()).filter(Boolean);
  const shownEmails = emails.map((e) => e.value.trim()).filter(Boolean);

  return (
    <div className="mt-6 space-y-6">
      <List title="Phone numbers" hint="Each number becomes a tap-to-call link. Use the international format, for example +92 42 354 595 24." items={phones} setItems={setPhones} type="tel" placeholder="+92 300 1234567" addLabel="Add phone number" />
      <List title="Emails" hint="Each email becomes a tap-to-write link." items={emails} setItems={setEmails} type="email" placeholder="sales@example.com" addLabel="Add email" />

      <section className="rounded-xl border border-black/5 bg-[#f4f0e7] p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-navy">Footer preview</p>
        <p className="mt-3 text-xs font-semibold uppercase text-brand-navy">Contact</p>
        <ul className="mt-2 space-y-1.5 text-[13px] text-[#5f6663]">
          <li>{address}</li>
          {shownEmails.map((e, i) => (
            <li key={"e" + i}>{e}</li>
          ))}
          {shownPhones.map((p, i) => (
            <li key={"p" + i}>{p}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} disabled={pending} className={PRIMARY}>
          {pending ? "Saving..." : "Save footer contacts"}
        </button>
        {edited ? (
          <button type="button" onClick={reset} disabled={pending} className={BTN}>
            Reset to original
          </button>
        ) : null}
      </div>
      {message ? (
        <p role="status" className={`rounded-lg px-4 py-2.5 text-sm ${message.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </p>
      ) : null}
    </div>
  );
}
