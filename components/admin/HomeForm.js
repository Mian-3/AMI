"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import StatIcon, { ICON_LABELS } from "@/components/StatIcons";
import { saveSection, resetSection } from "@/app/admin/(panel)/content/actions";
import { saveHomeStats, resetHomeStats } from "@/app/admin/(panel)/home/actions";
import { ICON_IDS, MAX_STATS } from "@/lib/homeStats";

const FIELD =
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const LABEL = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";
const BTN = "rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-medium text-ink transition hover:border-brand-orange hover:text-brand-orange disabled:cursor-not-allowed disabled:opacity-40";
const PRIMARY = "rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60";

const INTRO_FIELDS = [
  { key: "eyebrow", label: "Small heading", rows: 1 },
  { key: "heading", label: "Main heading", rows: 3 },
  { key: "paragraph1", label: "Paragraph 1", rows: 3 },
  { key: "paragraph2", label: "Paragraph 2", rows: 3 },
];

function Message({ message }) {
  if (!message) return null;
  return (
    <p role="status" className={`mt-3 rounded-lg px-4 py-2.5 text-sm ${message.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
      {message.text}
    </p>
  );
}

function Arrow({ dir }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "up" ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6"} />
    </svg>
  );
}

export default function HomeForm({ intro, introEdited, stats, statsEdited }) {
  const router = useRouter();

  /* ---------------- Introduction ---------------- */
  const [introPending, startIntro] = useTransition();
  const [introMsg, setIntroMsg] = useState(null);
  const [introValues, setIntroValues] = useState(intro);
  const setIntro = (lang, key, v) => setIntroValues((s) => ({ ...s, [lang]: { ...s[lang], [key]: v } }));

  function saveIntro() {
    setIntroMsg(null);
    startIntro(async () => {
      const res = await saveSection("intro", introValues);
      if (!res.ok) return setIntroMsg({ type: "error", text: res.error });
      setIntroMsg({ type: "ok", text: "Saved. The website is updating." });
      router.refresh();
    });
  }

  function resetIntro() {
    if (!window.confirm("Reset the introduction text (English and Arabic) to the original?")) return;
    startIntro(async () => {
      const res = await resetSection("intro");
      if (!res.ok) return setIntroMsg({ type: "error", text: res.error });
      window.location.reload();
    });
  }

  /* ---------------- Statistics ---------------- */
  const nextId = useRef(0);
  const withIds = (list) => list.map((c) => ({ ...c, id: ++nextId.current }));
  const [cards, setCards] = useState(() => withIds(stats));
  const [statsPending, startStats] = useTransition();
  const [statsMsg, setStatsMsg] = useState(null);

  const patch = (id, p) => setCards((l) => l.map((c) => (c.id === id ? { ...c, ...p } : c)));
  const remove = (id) => setCards((l) => l.filter((c) => c.id !== id));
  const move = (id, d) =>
    setCards((l) => {
      const i = l.findIndex((c) => c.id === id);
      const j = i + d;
      if (i < 0 || j < 0 || j >= l.length) return l;
      const copy = [...l];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  const add = () => setCards((l) => (l.length >= MAX_STATS ? l : [...l, { id: ++nextId.current, icon: "star", value: "0", labelEn: "", labelAr: "" }]));

  function saveStats() {
    setStatsMsg(null);
    if (cards.length === 0) return setStatsMsg({ type: "error", text: "Add at least one card." });
    if (cards.some((c) => !c.labelEn.trim() && !c.labelAr.trim())) return setStatsMsg({ type: "error", text: "Every card needs a name (English or Arabic)." });
    startStats(async () => {
      const res = await saveHomeStats(cards.map(({ icon, value, labelEn, labelAr }) => ({ icon, value, labelEn, labelAr })));
      if (!res.ok) return setStatsMsg({ type: "error", text: res.error });
      setCards(withIds(res.items));
      setStatsMsg({ type: "ok", text: "Saved. The website is updating." });
      router.refresh();
    });
  }

  function resetStats() {
    if (!window.confirm("Reset the statistics to the original six cards?")) return;
    startStats(async () => {
      const res = await resetHomeStats();
      if (!res.ok) return setStatsMsg({ type: "error", text: res.error });
      window.location.reload();
    });
  }

  return (
    <div className="mt-6 space-y-8">
      {/* ---------- Introduction ---------- */}
      <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-navy">Introduction</h2>
        <p className="mt-1 text-sm text-ink/60">The heading and text under the Home hero. English on the left, Arabic on the right.</p>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {["en", "ar"].map((lang) => (
            <div key={lang} className="space-y-4">
              <p className="text-sm font-semibold text-brand-navy">{lang === "en" ? "English" : "Arabic"}</p>
              {INTRO_FIELDS.map((f) => (
                <div key={f.key}>
                  <label className={LABEL}>{f.label}</label>
                  <textarea
                    rows={f.rows}
                    dir={lang === "ar" ? "rtl" : "ltr"}
                    value={introValues[lang][f.key] || ""}
                    onChange={(e) => setIntro(lang, f.key, e.target.value)}
                    className={FIELD}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={saveIntro} disabled={introPending} className={PRIMARY}>
            {introPending ? "Saving..." : "Save introduction"}
          </button>
          {introEdited ? (
            <button type="button" onClick={resetIntro} disabled={introPending} className={BTN}>
              Reset to original
            </button>
          ) : null}
        </div>
        <Message message={introMsg} />
      </section>

      {/* ---------- Statistics ---------- */}
      <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-navy">Statistics cards</h2>
        <p className="mt-1 text-sm text-ink/60">
          The orange cards under the introduction. Change the number, the name and the icon, reorder them with the arrows, or add and remove cards (up to {MAX_STATS}). Numbers
          that start with digits count up when they appear, for example 2500+ or 100,000+.
        </p>

        <ul className="mt-5 space-y-3">
          {cards.map((c, i) => (
            <li key={c.id} className="rounded-xl border border-black/10 bg-[#fafaf8] p-4">
              <div className="grid gap-4 lg:grid-cols-[150px_1fr_auto]">
                {/* Preview */}
                <div className="flex h-[120px] flex-col justify-between rounded-2xl bg-brand-orange p-3 text-white shadow-[0_6px_16px_rgba(242,143,59,0.25)]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/25">
                    <StatIcon id={c.icon} size={17} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xl font-semibold leading-none">{c.value || "0"}</p>
                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug">{c.labelEn || c.labelAr || "Name"}</p>
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-[140px_1fr_1fr]">
                    <div>
                      <label className={LABEL}>Number</label>
                      <input value={c.value} maxLength={14} onChange={(e) => patch(c.id, { value: e.target.value })} placeholder="2500+" className={FIELD} />
                    </div>
                    <div>
                      <label className={LABEL}>Name (English)</label>
                      <input value={c.labelEn} maxLength={60} onChange={(e) => patch(c.id, { labelEn: e.target.value })} placeholder="Clients" className={FIELD} />
                    </div>
                    <div>
                      <label className={LABEL}>Name (Arabic)</label>
                      <input dir="rtl" value={c.labelAr} maxLength={60} onChange={(e) => patch(c.id, { labelAr: e.target.value })} placeholder="عميل" className={FIELD} />
                    </div>
                  </div>
                  <div>
                    <p className={LABEL}>Icon</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ICON_IDS.map((id) => (
                        <button
                          key={id}
                          type="button"
                          title={ICON_LABELS[id]}
                          aria-label={ICON_LABELS[id]}
                          aria-pressed={c.icon === id}
                          onClick={() => patch(c.id, { icon: id })}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                            c.icon === id ? "border-brand-orange bg-brand-orange text-white" : "border-black/10 bg-white text-ink/70 hover:border-brand-orange hover:text-brand-orange"
                          }`}
                        >
                          <StatIcon id={id} size={17} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order and remove */}
                <div className="flex gap-2 lg:flex-col">
                  <button type="button" onClick={() => move(c.id, -1)} disabled={i === 0} aria-label="Move up" className={`${BTN} flex items-center justify-center`}>
                    <Arrow dir="up" />
                  </button>
                  <button type="button" onClick={() => move(c.id, 1)} disabled={i === cards.length - 1} aria-label="Move down" className={`${BTN} flex items-center justify-center`}>
                    <Arrow dir="down" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    disabled={cards.length <= 1}
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={add} disabled={cards.length >= MAX_STATS} className={BTN}>
            + Add card
          </button>
          <span className="text-xs text-ink/50">
            {cards.length} of {MAX_STATS} cards
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-black/5 pt-5">
          <button type="button" onClick={saveStats} disabled={statsPending} className={PRIMARY}>
            {statsPending ? "Saving..." : "Save statistics"}
          </button>
          {statsEdited ? (
            <button type="button" onClick={resetStats} disabled={statsPending} className={BTN}>
              Reset to original
            </button>
          ) : null}
        </div>
        <Message message={statsMsg} />
      </section>
    </div>
  );
}
