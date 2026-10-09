"use client";

import ImageField from "@/components/admin/ImageField";

const FIELD =
  "w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";

const TYPES = [
  { type: "h", label: "Heading" },
  { type: "p", label: "Paragraph" },
  { type: "list", label: "List" },
  { type: "callout", label: "Callout" },
  { type: "quote", label: "Quote" },
  { type: "image", label: "Image" },
];

const BLANK = {
  h: { type: "h", text: "" },
  p: { type: "p", text: "" },
  list: { type: "list", intro: "", items: [{ title: "", text: "" }] },
  callout: { type: "callout", title: "", text: "" },
  quote: { type: "quote", text: "", author: "" },
  image: { type: "image", src: "", caption: "" },
};

const LABELS = Object.fromEntries(TYPES.map((t) => [t.type, t.label]));

export default function BlockEditor({ value, onChange, dir }) {
  const blocks = Array.isArray(value) ? value : [];

  const update = (index, patch) => onChange(blocks.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  const remove = (index) => onChange(blocks.filter((_, i) => i !== index));
  const add = (type) => onChange([...blocks, { ...BLANK[type] }]);
  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {blocks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-black/15 bg-white/60 p-4 text-center text-sm text-ink/50">
          No content yet. Add a heading, paragraph, list, callout, quote or image below.
        </p>
      ) : null}

      {blocks.map((block, index) => (
        <div key={index} className="rounded-lg border border-black/10 bg-[#fafafa] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-orange">{LABELS[block.type] || block.type}</span>
            <div className="flex items-center gap-1 text-sm">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="rounded px-2 py-1 hover:bg-black/5 disabled:opacity-30" aria-label="Move up">&uarr;</button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === blocks.length - 1} className="rounded px-2 py-1 hover:bg-black/5 disabled:opacity-30" aria-label="Move down">&darr;</button>
              <button type="button" onClick={() => remove(index)} className="rounded px-2 py-1 text-red-600 hover:bg-red-50">Remove</button>
            </div>
          </div>

          {block.type === "h" ? (
            <input dir={dir} value={block.text} onChange={(e) => update(index, { text: e.target.value })} placeholder="Heading text" className={FIELD} />
          ) : null}

          {block.type === "p" ? (
            <textarea dir={dir} rows={4} value={block.text} onChange={(e) => update(index, { text: e.target.value })} placeholder="Paragraph text" className={FIELD} />
          ) : null}

          {block.type === "list" ? (
            <div className="space-y-2">
              <input dir={dir} value={block.intro || ""} onChange={(e) => update(index, { intro: e.target.value })} placeholder="Short line above the cards (optional)" className={FIELD} />
              {(block.items || []).map((item, i) => {
                const it = typeof item === "string" ? { title: "", text: item } : item;
                const setItem = (patch) =>
                  update(index, { items: block.items.map((x, j) => (j === i ? { ...it, ...patch } : x)) });
                return (
                  <div key={i} className="rounded-lg border border-black/10 bg-white p-2.5">
                    <div className="mb-1.5 flex items-center justify-between text-xs text-ink/50">
                      <span>Card {i + 1}</span>
                      <button
                        type="button"
                        onClick={() => update(index, { items: block.items.filter((_, j) => j !== i) })}
                        className="text-red-600 hover:underline"
                      >
                        Remove card
                      </button>
                    </div>
                    <input dir={dir} value={it.title || ""} onChange={(e) => setItem({ title: e.target.value })} placeholder="Card title" className={FIELD} />
                    <textarea dir={dir} rows={2} value={it.text || ""} onChange={(e) => setItem({ text: e.target.value })} placeholder="Card text" className={`${FIELD} mt-2`} />
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => update(index, { items: [...(block.items || []), { title: "", text: "" }] })}
                className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium transition hover:border-brand-orange hover:text-brand-orange"
              >
                + Add card
              </button>
            </div>
          ) : null}

          {block.type === "callout" ? (
            <div className="space-y-2">
              <input dir={dir} value={block.title} onChange={(e) => update(index, { title: e.target.value })} placeholder="Callout title (for example: Key takeaway)" className={FIELD} />
              <textarea dir={dir} rows={3} value={block.text} onChange={(e) => update(index, { text: e.target.value })} placeholder="Callout text" className={FIELD} />
            </div>
          ) : null}

          {block.type === "quote" ? (
            <div className="space-y-2">
              <textarea dir={dir} rows={3} value={block.text} onChange={(e) => update(index, { text: e.target.value })} placeholder="Quote" className={FIELD} />
              <input dir={dir} value={block.author} onChange={(e) => update(index, { author: e.target.value })} placeholder="Who said it (optional)" className={FIELD} />
            </div>
          ) : null}

          {block.type === "image" ? (
            <div className="space-y-2">
              <ImageField value={block.src} onChange={(src) => update(index, { src })} />
              <input dir={dir} value={block.caption} onChange={(e) => update(index, { caption: e.target.value })} placeholder="Caption (optional)" className={FIELD} />
            </div>
          ) : null}
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-ink/50">Add:</span>
        {TYPES.map((t) => (
          <button
            key={t.type}
            type="button"
            onClick={() => add(t.type)}
            className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium transition hover:border-brand-orange hover:text-brand-orange"
          >
            + {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
