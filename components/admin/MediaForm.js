"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import ImageField from "@/components/admin/ImageField";
import FileField from "@/components/admin/FileField";
import { saveMedia, resetMedia } from "@/app/admin/(panel)/media/actions";
import { SOCIAL_PLATFORMS } from "@/lib/mediaShared";

const FIELD =
  "h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const LABEL = "mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60";

function Card({ title, note, children }) {
  return (
    <section className="rounded-xl border border-black/5 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-brand-navy">{title}</h2>
      {note ? <p className="mt-1 text-xs text-ink/50">{note}</p> : null}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default function MediaForm({ initial, labels }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState(null);
  const [m, setM] = useState(initial);

  const setPath = (group, key, value) => setM((s) => ({ ...s, [group]: { ...s[group], [key]: value } }));
  const setFooter = (list, index, value) =>
    setM((s) => ({ ...s, footerLinks: { ...s.footerLinks, [list]: s.footerLinks[list].map((x, i) => (i === index ? value : x)) } }));

  const setSocial = (i, patch) => setM((st) => ({ ...st, socials: st.socials.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const setCert = (i, patch) => setM((st) => ({ ...st, certifications: st.certifications.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const moveCert = (i, d) =>
    setM((st) => {
      const j = i + d;
      if (j < 0 || j >= st.certifications.length) return st;
      const next = [...st.certifications];
      [next[i], next[j]] = [next[j], next[i]];
      return { ...st, certifications: next };
    });
  const setClients = (next) => setM((s) => ({ ...s, clients: next }));
  const moveClient = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= m.clients.length) return;
    const next = [...m.clients];
    [next[i], next[j]] = [next[j], next[i]];
    setClients(next);
  };

  function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await saveMedia(m);
      if (!res.ok) return setMessage({ type: "error", text: res.error });
      setMessage({ type: "ok", text: "Saved. The website is updating." });
      router.refresh();
    });
  }

  function reset() {
    if (!window.confirm("Reset the catalogue, hero, links and client logos to the originals?")) return;
    startTransition(async () => {
      const res = await resetMedia();
      if (!res.ok) return setMessage({ type: "error", text: res.error });
      setMessage({ type: "ok", text: "Reset to the originals." });
      router.refresh();
      setTimeout(() => window.location.reload(), 300);
    });
  }

  const linkRow = (group, key, label, hint) => (
    <div key={key}>
      <label className={LABEL}>{label}</label>
      <input value={m[group][key]} onChange={(e) => setPath(group, key, e.target.value)} className={FIELD} />
      {hint ? <p className="mt-1 text-xs text-ink/50">{hint}</p> : null}
    </div>
  );

  const cardMedia = (key, title) => {
    const mode = m.expertise[`${key}Mode`];
    return (
      <div key={key} className="rounded-lg border border-black/10 bg-[#fafafa] p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-brand-navy">{title}</p>
          <div className="inline-flex overflow-hidden rounded-lg border border-black/10">
            {[["image", "Image"], ["video", "Video"]].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setPath("expertise", `${key}Mode`, v)} className={`h-9 px-4 text-sm font-medium transition ${mode === v ? "bg-brand-navy text-white" : "bg-white text-ink/70 hover:bg-black/5"}`}>{l}</button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {mode === "video" ? (
            <FileField label="Card video (mp4)" value={m.expertise[`${key}Video`]} onChange={(v) => setPath("expertise", `${key}Video`, v)} accept="video/mp4,video/webm" hint="Plays muted on a loop. Keep it under about 10 MB and 15 seconds." />
          ) : null}
          <ImageField label={mode === "video" ? "Poster image (shows while the video loads)" : "Card photo"} value={m.expertise[key]} onChange={(v) => setPath("expertise", key, v)} />
        </div>
      </div>
    );
  };

  const footerList = (list, title) => (
    <div key={list}>
      <p className="mb-2 text-sm font-medium text-brand-navy">{title}</p>
      <div className="space-y-2">
        {m.footerLinks[list].map((url, i) => (
          <div key={i} className="grid items-center gap-2 sm:grid-cols-[180px_1fr]">
            <span className="truncate text-sm text-ink/70">{labels[list]?.[i] || `Link ${i + 1}`}</span>
            <input value={url} onChange={(e) => setFooter(list, i, e.target.value)} className={FIELD} aria-label={labels[list]?.[i] || `Link ${i + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-6 space-y-6">
      <Card title="Catalogue" note="The file visitors get from every Download Catalogue button.">
        <FileField label="Catalogue PDF" value={m.catalogue.pdf} onChange={(v) => setPath("catalogue", "pdf", v)} accept="application/pdf" hint="Upload a PDF, or paste a link." />
      </Card>

      <Card title="Events page: top banner" note="The big banner at the very top of the Events page. It is not linked to any event: add or remove events freely and the banner stays. The whole picture is shown at full width, never cropped. Leave empty to hide it. Use Layout and visibility to hide or show it.">
        <ImageField label="Banner image (desktop)" value={m.eventsBanner.image} onChange={(v) => setPath("eventsBanner", "image", v)} hint="Wide, at least 1920 px. It is shown in full, so any proportion works." />
        <ImageField label="Banner image for phones (optional)" value={m.eventsBanner.imageMobile} onChange={(v) => setPath("eventsBanner", "imageMobile", v)} hint="Optional. A squarer or taller version for small screens. If empty, the desktop image is used." />
        <div>
          <label className={LABEL}>Description of the image (for screen readers)</label>
          <input value={m.eventsBanner.alt} onChange={(e) => setPath("eventsBanner", "alt", e.target.value)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL}>Link when clicked (optional)</label>
          <input value={m.eventsBanner.link} onChange={(e) => setPath("eventsBanner", "link", e.target.value)} className={FIELD} placeholder="https://... or /{locale}/contact" />
        </div>
      </Card>

      <Card title="Home page hero" note="Video plays muted in the background. The poster image shows while it loads, and on devices that block autoplay.">
        <FileField label="Background video (mp4)" value={m.hero.video} onChange={(v) => setPath("hero", "video", v)} accept="video/mp4,video/webm" hint="Keep it under about 10 MB and 15 seconds for fast loading." />
        <ImageField label="Poster image" value={m.hero.poster} onChange={(v) => setPath("hero", "poster", v)} />
      </Card>

      <Card title="Home page: Flavours and Fragrances cards" note="The two photo cards in the Flavours and Fragrances section of the home page. Each card can show a photo or a looping video. Both open the Flavours and Fragrances page. Their text is in Site content, Expertise.">
        <div>
          <label className={LABEL}>Card overlay (text clarity): {m.expertise.cardOverlay}%</label>
          <input type="range" min="0" max="80" step="5" value={m.expertise.cardOverlay} onChange={(e) => setPath("expertise", "cardOverlay", Number(e.target.value))} className="w-full accent-[#f58220]" />
          <p className="mt-1 text-xs text-ink/50">A dark tint over both card photos or videos. Raise it if the title and text are hard to read.</p>
        </div>
        {cardMedia("flavours", "Flavours card")}
        {cardMedia("fragrances", "Fragrances card")}
      </Card>

      <Card title="Home page: Flavours and Fragrances section background" note="Optional background behind the whole section. Choose Image or Video: only the chosen one shows, the other is hidden. Text can be edited in Site content, Expertise.">
        <div>
          <label className={LABEL}>Background</label>
          <div className="inline-flex overflow-hidden rounded-lg border border-black/10">
            {[["none", "None"], ["image", "Image"], ["video", "Video"]].map(([v, l]) => (
              <button key={v} type="button" onClick={() => setPath("expertise", "bgMode", v)} className={`h-10 px-5 text-sm font-medium transition ${m.expertise.bgMode === v ? "bg-brand-navy text-white" : "bg-white text-ink/70 hover:bg-black/5"}`}>{l}</button>
            ))}
          </div>
        </div>
        {m.expertise.bgMode === "image" ? (
          <ImageField label="Background image" value={m.expertise.bgImage} onChange={(v) => setPath("expertise", "bgImage", v)} />
        ) : null}
        {m.expertise.bgMode === "video" ? (
          <>
            <FileField label="Background video (mp4)" value={m.expertise.bgVideo} onChange={(v) => setPath("expertise", "bgVideo", v)} accept="video/mp4,video/webm" hint="Plays muted on a loop. Keep it under about 10 MB and 15 seconds." />
            <ImageField label="Poster image (shows while loading)" value={m.expertise.bgPoster} onChange={(v) => setPath("expertise", "bgPoster", v)} />
          </>
        ) : null}
        {m.expertise.bgMode !== "none" ? (
          <>
            <div>
              <label className={LABEL}>Text colour over the background</label>
              <select value={m.expertise.bgOverlay} onChange={(e) => setPath("expertise", "bgOverlay", e.target.value)} className={FIELD}>
                <option value="light">Dark text on a light wash</option>
                <option value="dark">White text on a dark overlay</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Overlay strength: {m.expertise.bgStrength}%</label>
              <input type="range" min="0" max="90" step="5" value={m.expertise.bgStrength} onChange={(e) => setPath("expertise", "bgStrength", Number(e.target.value))} className="w-full accent-[#f58220]" />
              <p className="mt-1 text-xs text-ink/50">Lower shows more of the picture or video. Keep it high enough for the text to stay readable.</p>
            </div>
          </>
        ) : null}
      </Card>

      <Card title="Buttons" note="Use /{locale}/contact style links for pages on this site ({locale} becomes en or ar). Use a full https:// link for other sites. # means no link yet.">
        {linkRow("links", "requestSample", "Request for Sample button")}
      </Card>

      <Card title="Social links" note="The social icons in the header and footer, in this order. Add the platforms you use, remove the ones you do not. Use a full https:// link.">
        <ul className="space-y-2">
          {m.socials.map((s, i) => (
            <li key={i} className="grid items-center gap-2 sm:grid-cols-[170px_1fr_auto]">
              <select value={s.platform} onChange={(e) => setSocial(i, { platform: e.target.value })} className={FIELD} aria-label="Platform">
                {SOCIAL_PLATFORMS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <input value={s.url} onChange={(e) => setSocial(i, { url: e.target.value })} placeholder="https://" className={FIELD} aria-label="Link" />
              <button type="button" onClick={() => setM((st) => ({ ...st, socials: st.socials.filter((_, j) => j !== i) }))} className="h-10 rounded-lg px-3 text-sm text-red-600 hover:bg-red-50">Remove</button>
            </li>
          ))}
        </ul>
        {m.socials.length === 0 ? <p className="text-xs text-ink/50">No social icons are shown on the website.</p> : null}
        {m.socials.length < 8 ? (
          <button type="button" onClick={() => setM((st) => ({ ...st, socials: [...st.socials, { platform: SOCIAL_PLATFORMS.find((p) => !st.socials.some((x) => x.platform === p.id))?.id || "facebook", url: "https://" }] }))} className="h-10 rounded-lg border border-black/10 bg-white px-4 text-sm font-medium text-brand-navy hover:bg-black/5">Add social link</button>
        ) : null}
      </Card>

      <Card title="Footer links" note="Where each footer link goes. The link names are edited in Site content, Footer.">
        {footerList("fragrances", "Fragrances")}
        {footerList("foodFlavours", "Food flavours")}
        {footerList("quick", "Quick links")}
      </Card>

      <Card title="Home page: Certifications" note="The round certification badges at the bottom of the home page. Change the picture, add the PDF certificate it opens, reorder, add or remove badges. A badge with no PDF is just a picture.">
        <ul className="space-y-3">
          {m.certifications.map((c, i) => (
            <li key={i} className="rounded-lg border border-black/10 bg-[#fafafa] p-3">
              <div className="mb-3 flex items-center justify-between text-xs text-ink/50">
                <span>Badge {i + 1}</span>
                <span className="flex items-center gap-1">
                  <button type="button" onClick={() => moveCert(i, -1)} disabled={i === 0} className="rounded px-2 py-1 hover:bg-black/5 disabled:opacity-30" aria-label="Move up">&uarr;</button>
                  <button type="button" onClick={() => moveCert(i, 1)} disabled={i === m.certifications.length - 1} className="rounded px-2 py-1 hover:bg-black/5 disabled:opacity-30" aria-label="Move down">&darr;</button>
                  <button type="button" onClick={() => setM((st) => ({ ...st, certifications: st.certifications.filter((_, j) => j !== i) }))} className="rounded px-2 py-1 text-red-600 hover:bg-red-50">Remove</button>
                </span>
              </div>
              <div className="space-y-4">
                <ImageField label="Badge picture" value={c.image} onChange={(v) => setCert(i, { image: v })} />
                <FileField label="Certificate PDF (opens when the badge is clicked)" value={c.pdf} onChange={(v) => setCert(i, { pdf: v })} accept="application/pdf" hint="Upload a PDF, or paste a link. Leave empty for a badge that is only a picture." />
                <div>
                  <label className={LABEL}>Name (for screen readers and the download file name)</label>
                  <input value={c.alt} onChange={(e) => setCert(i, { alt: e.target.value })} className={FIELD} />
                </div>
              </div>
            </li>
          ))}
        </ul>
        {m.certifications.length === 0 ? <p className="text-xs text-ink/50">No certification badges are shown on the home page.</p> : null}
        {m.certifications.length < 12 ? (
          <button type="button" onClick={() => setM((st) => ({ ...st, certifications: [...st.certifications, { image: "", pdf: "", alt: `Certification ${st.certifications.length + 1}` }] }))} className="h-10 rounded-lg border border-black/10 bg-white px-4 text-sm font-medium text-brand-navy hover:bg-black/5">Add badge</button>
        ) : null}
      </Card>

      <Card title="Client logos" note="Shown in the scrolling strip on the home page. Use a PNG or WebP with a transparent or white background.">
        <ul className="space-y-3">
          {m.clients.map((c, i) => (
            <li key={i} className="rounded-lg border border-black/10 bg-[#fafafa] p-3">
              <div className="mb-2 flex items-center justify-between text-xs text-ink/50">
                <span>Logo {i + 1}</span>
                <span className="flex items-center gap-1">
                  <button type="button" onClick={() => moveClient(i, -1)} disabled={i === 0} className="rounded px-2 py-1 hover:bg-black/5 disabled:opacity-30" aria-label="Move up">&uarr;</button>
                  <button type="button" onClick={() => moveClient(i, 1)} disabled={i === m.clients.length - 1} className="rounded px-2 py-1 hover:bg-black/5 disabled:opacity-30" aria-label="Move down">&darr;</button>
                  <button type="button" onClick={() => setClients(m.clients.filter((_, j) => j !== i))} className="rounded px-2 py-1 text-red-600 hover:bg-red-50">Remove</button>
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
                <ImageField value={c.src} onChange={(v) => setClients(m.clients.map((x, j) => (j === i ? { ...x, src: v } : x)))} />
                <div>
                  <label className={LABEL}>Name</label>
                  <input value={c.name} onChange={(e) => setClients(m.clients.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} className={FIELD} />
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setClients([...m.clients, { name: `Client${m.clients.length + 1}`, src: "" }])}
          className="rounded-full border border-black/10 bg-white px-4 py-1.5 text-sm font-medium transition hover:border-brand-orange hover:text-brand-orange"
        >
          + Add logo
        </button>
        <p className="text-xs text-ink/50">A new logo without an image is ignored when you save.</p>
      </Card>

      <div className="sticky bottom-0 -mx-4 border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
          <button type="button" disabled={pending} onClick={save} className="rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60">
            {pending ? "Saving..." : "Save changes"}
          </button>
          <button type="button" disabled={pending} onClick={reset} className="rounded-lg border border-black/10 px-5 py-2.5 text-sm font-medium transition hover:bg-black/5 disabled:opacity-60">
            Reset to originals
          </button>
          {message ? <p role="status" className={`text-sm ${message.type === "error" ? "text-red-600" : "text-emerald-700"}`}>{message.text}</p> : null}
        </div>
      </div>
    </div>
  );
}
