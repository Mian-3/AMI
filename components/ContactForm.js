"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Reveal from "@/components/Reveal";
import { COUNTRIES, POPULAR, flagUrl, countryName } from "@/lib/countries";

const LABEL = "mb-2 block text-[12px] font-semibold uppercase tracking-[0.08em] text-ink/60 rtl:tracking-normal md:text-[13px]";
const FIELD =
  "h-14 w-full rounded-[14px] border-[1.5px] border-transparent bg-[#f5f3ef] text-[16px] text-ink outline-none transition duration-200 placeholder:text-ink/35 hover:border-ink/10 focus:border-brand-orange focus:bg-white focus:ring-4 focus:ring-brand-orange/15 user-invalid:border-red-400/70 user-invalid:bg-red-50/40";

const CSS = `
@keyframes cf-pop{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:none}}
@keyframes cf-pop-up{from{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:none}}
@keyframes cf-draw{to{stroke-dashoffset:0}}
@keyframes cf-ring{from{transform:scale(.6);opacity:0}to{transform:scale(1);opacity:1}}
@keyframes cf-fade{from{opacity:0}to{opacity:1}}
.cf-pop{animation:cf-pop .18s cubic-bezier(.2,.8,.2,1) both;transform-origin:top}
.cf-pop-up{animation:cf-pop-up .18s cubic-bezier(.2,.8,.2,1) both;transform-origin:bottom}
.cf-draw{stroke-dasharray:40;stroke-dashoffset:40;animation:cf-draw .5s .25s ease-out forwards}
.cf-ring{animation:cf-ring .45s cubic-bezier(.2,.8,.2,1) both}
.cf-fade{animation:cf-fade .3s ease-out both}
.cf-scroll{scrollbar-width:thin;scrollbar-color:#d9d5cd transparent}
@media (prefers-reduced-motion:reduce){.cf-pop,.cf-pop-up,.cf-ring,.cf-fade{animation:none}.cf-draw{animation:none;stroke-dashoffset:0}}
`;

function Icon({ children, className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {children}
    </svg>
  );
}

const IUser = () => <Icon><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" /></Icon>;
const IBuilding = () => <Icon><path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M14 10h5a1 1 0 0 1 1 1v10M2 21h20" /><path d="M8 8h2M8 12h2M8 16h2" /></Icon>;
const IMail = () => <Icon><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></Icon>;
const IChat = () => <Icon><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12Z" /></Icon>;
const ITopic = () => <Icon><path d="M4 7h16M4 12h10M4 17h6" /></Icon>;

function Chevron({ open }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`shrink-0 text-ink/50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <path d="m2.5 4.5 3.5 3.5 3.5-3.5" />
    </svg>
  );
}

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-brand-orange">
      <path d="m3 8.5 3.2 3.2L13 4.8" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ClockCalendarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M40 22V10a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v26a3 3 0 0 0 3 3h14" />
      <path d="M6 16h34M14 4v6M32 4v6" />
      <circle cx="35" cy="35" r="8" />
      <path d="M35 31v4l3 2" />
    </svg>
  );
}

function Flag({ iso }) {
  const [bad, setBad] = useState(false);
  if (bad) {
    return <span className="inline-flex h-[18px] w-6 shrink-0 items-center justify-center rounded-[3px] bg-ink/10 text-[9px] font-bold text-ink/60">{iso}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={flagUrl(iso, 40)}
      srcSet={`${flagUrl(iso, 40)} 1x, ${flagUrl(iso, 80)} 2x`}
      alt=""
      width="24"
      height="18"
      loading="lazy"
      onError={() => setBad(true)}
      className="h-[18px] w-6 shrink-0 rounded-[3px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
    />
  );
}

/**
 * Accessible listbox dropdown (keyboard: arrows, Home/End, Enter, Esc, type to search).
 * options: [{ value, label, search?, ...anything renderOption needs }]
 * rows (optional) lets the caller insert dividers: [{ divider: true }, option, ...]
 */
function Dropdown({ id, name, value, onChange, options, rows, renderValue, renderOption, searchable, searchPlaceholder, emptyText, buttonClassName, panelClassName, describedBy, labelledBy, dir }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [up, setUp] = useState(false);
  const wrap = useRef(null);
  const listRef = useRef(null);
  const searchRef = useRef(null);
  const btnRef = useRef(null);
  const uid = useId();

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return rows || options;
    return options.filter((o) => (o.search || o.label).toLowerCase().includes(q));
  }, [q, rows, options]);
  const selectable = useMemo(() => filtered.filter((r) => !r.divider), [filtered]);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open, filtered]);

  function openMenu() {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setUp(window.innerHeight - r.bottom < 340 && r.top > window.innerHeight - r.bottom);
    const i = Math.max(0, selectable.findIndex((o) => o.value === value));
    setActive(i);
    setQuery("");
    setOpen(true);
    if (searchable) setTimeout(() => searchRef.current?.focus(), 30);
  }

  function close(focusBtn = true) {
    setOpen(false);
    if (focusBtn) btnRef.current?.focus();
  }

  function choose(opt) {
    onChange(opt.value);
    close();
  }

  function onKey(e) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(selectable.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(selectable.length - 1);
    } else if (e.key === "Enter" || (e.key === " " && !searchable)) {
      e.preventDefault();
      if (selectable[active]) choose(selectable[active]);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  let idx = -1;
  return (
    <div ref={wrap} className="relative" dir={dir}>
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        ref={btnRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${uid}-list`}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={onKey}
        className={buttonClassName}
      >
        {renderValue(current)}
        <Chevron open={open} />
      </button>

      {open ? (
        <div className={`absolute z-50 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.28)] ${up ? "bottom-full mb-2 cf-pop-up" : "top-full mt-2 cf-pop"} ${panelClassName}`}>
          {searchable ? (
            <div className="border-b border-ink/10 p-2.5">
              <div className="relative">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-ink/40">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onKey}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder}
                  autoComplete="off"
                  className="h-10 w-full rounded-lg bg-[#f5f3ef] ps-9 pe-3 text-[15px] text-ink outline-none placeholder:text-ink/40 focus:ring-2 focus:ring-brand-orange/30"
                />
              </div>
            </div>
          ) : null}
          <ul id={`${uid}-list`} ref={listRef} role="listbox" aria-labelledby={labelledBy} className="cf-scroll max-h-[264px] overflow-y-auto p-1.5">
            {selectable.length === 0 ? <li className="px-3 py-6 text-center text-[14px] text-ink/50">{emptyText}</li> : null}
            {filtered.map((row, i) => {
              if (row.divider) return <li key={`d${i}`} role="presentation" className="my-1.5 h-px bg-ink/10" />;
              idx += 1;
              const me = idx;
              const selected = row.value === value;
              return (
                <li
                  key={row.value}
                  id={`${uid}-o${me}`}
                  role="option"
                  aria-selected={selected}
                  data-idx={me}
                  onMouseEnter={() => setActive(me)}
                  onClick={() => choose(row)}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors ${me === active ? "bg-brand-orange/10" : ""} ${selected ? "font-semibold text-ink" : "text-ink/80"}`}
                >
                  {renderOption(row)}
                  {selected ? <Check /> : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, htmlFor, labelId, children, className = "" }) {
  return (
    <div className={className}>
      <label id={labelId} htmlFor={htmlFor} className={LABEL}>{label}</label>
      {children}
    </div>
  );
}

function IconInput({ icon, ...props }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-ink/35">{icon}</span>
      <input {...props} className={`${FIELD} ps-12 pe-4`} />
    </div>
  );
}

export default function ContactForm({ dict }) {
  const c = dict.contactPage.form;
  const params = useParams();
  const locale = params?.locale === "ar" ? "ar" : "en";
  const ar = locale === "ar";
  const id = useId();
  const [status, setStatus] = useState("idle");
  const [country, setCountry] = useState("PK");
  const [topic, setTopic] = useState(c.topics[0]);

  useEffect(() => {
    if (status !== "success") return undefined;
    const t = setTimeout(() => setStatus("idle"), 7000);
    return () => clearTimeout(t);
  }, [status]);

  const countryOptions = useMemo(() => {
    const list = COUNTRIES.map((x) => {
      const label = countryName(x.iso, locale);
      return { value: x.iso, label, dial: x.dial, search: `${label} ${x.iso} ${x.dial}` };
    });
    const byName = [...list].sort((a, b) => a.label.localeCompare(b.label, locale));
    const popular = POPULAR.map((iso) => list.find((x) => x.value === iso)).filter(Boolean);
    const rest = byName.filter((x) => !POPULAR.includes(x.value));
    return { all: byName, rows: [...popular, { divider: true }, ...rest] };
  }, [locale]);

  const topicOptions = useMemo(() => c.topics.map((t) => ({ value: t, label: t })), [c.topics]);
  const dial = countryOptions.all.find((x) => x.value === country)?.dial || "";

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    data.phone = `${dial} ${String(data.phone || "").trim()}`.trim();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setCountry("PK");
      setTopic(c.topics[0]);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const noteText = status === "error" ? c.error : c.note;
  const sending = status === "sending";

  return (
    <section id="contact-form" className="relative scroll-mt-24 overflow-hidden bg-[#201e1e]">
      <style>{CSS}</style>

      {/* Desktop photo half */}
      <div className="absolute inset-y-0 start-0 hidden w-[46.25%] lg:block">
        <Image src="/images/contact/contact-form-bg.jpg" alt="" fill sizes="46vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent rtl:bg-gradient-to-l" />
      </div>

      {/* Soft glow + dotted texture on the dark side */}
      <div aria-hidden="true" className="pointer-events-none absolute -end-40 top-0 h-[34rem] w-[34rem] rounded-full bg-brand-orange/20 blur-[140px]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_left,black,transparent_60%)] rtl:[mask-image:linear-gradient(to_right,black,transparent_60%)]" />

      <div className="relative mx-auto flex max-w-[75rem] flex-col lg:grid lg:grid-cols-[minmax(0,44.625fr)_minmax(0,26.125fr)] lg:items-start lg:gap-[4.25rem] lg:py-[6.5rem]">
        {/* Form card */}
        <div className="relative order-2 px-4 pb-14 pt-2 sm:px-6 lg:order-1 lg:p-0">
          <Reveal className="relative">
            <form
              id="contact-form-el"
              onSubmit={handleSubmit}
                      className="relative rounded-[28px] border border-white/60 bg-white p-6 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.45)] sm:p-8 md:rounded-[32px] md:p-10"
            >
              <span aria-hidden="true" className="absolute inset-x-10 -top-px h-[3px] rounded-full bg-gradient-to-r from-transparent via-brand-orange to-transparent" />

              <div className="grid gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-6">
                <Field label={c.fullName} htmlFor={`${id}-name`}>
                  <IconInput id={`${id}-name`} icon={<IUser />} name="name" type="text" required autoComplete="name" placeholder={c.fullNamePh} />
                </Field>
                <Field label={c.company} htmlFor={`${id}-company`}>
                  <IconInput id={`${id}-company`} icon={<IBuilding />} name="company" type="text" required autoComplete="organization" placeholder={c.companyPh} />
                </Field>
                <Field label={c.email} htmlFor={`${id}-email`}>
                  <IconInput id={`${id}-email`} icon={<IMail />} name="email" type="email" required autoComplete="email" placeholder={c.emailPh} />
                </Field>
                <Field label={c.phone} htmlFor={`${id}-phone`} labelId={`${id}-phone-l`}>
                  <div className="flex gap-2.5" dir="ltr">
                    <Dropdown
                      id={`${id}-cc`}
                      value={country}
                      onChange={setCountry}
                      options={countryOptions.all}
                      rows={countryOptions.rows}
                      searchable
                      searchPlaceholder={ar ? "ابحث عن دولة" : "Search country or code"}
                      emptyText={ar ? "لا توجد نتائج" : "No results"}
                      labelledBy={`${id}-phone-l`}
                      dir="ltr"
                      panelClassName="start-0 w-[min(20rem,calc(100vw-3rem))]"
                      buttonClassName={`${FIELD} flex w-[7.25rem] shrink-0 items-center justify-between gap-2 px-3.5 text-start focus-visible:border-brand-orange focus-visible:ring-4 focus-visible:ring-brand-orange/15`}
                      renderValue={(o) => (
                        <span className="flex min-w-0 items-center gap-2.5">
                          <Flag iso={country} />
                          <span className="text-[15px] font-medium tabular-nums">{o?.dial}</span>
                        </span>
                      )}
                      renderOption={(o) => (
                        <>
                          <Flag iso={o.value} />
                          <span className="min-w-0 flex-1 truncate" dir="auto">{o.label}</span>
                          <span className="shrink-0 text-[13px] tabular-nums text-ink/45">{o.dial}</span>
                        </>
                      )}
                    />
                    <input
                      id={`${id}-phone`}
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel-national"
                      inputMode="tel"
                      placeholder={c.phonePh}
                      className={`${FIELD} min-w-0 flex-1 px-4`}
                      dir="ltr"
                    />
                  </div>
                </Field>
                <Field label={c.topic} labelId={`${id}-topic-l`} className="md:col-span-2">
                  <Dropdown
                    id={`${id}-topic`}
                    name="topic"
                    value={topic}
                    onChange={setTopic}
                    options={topicOptions}
                    labelledBy={`${id}-topic-l`}
                    panelClassName="inset-x-0"
                    buttonClassName={`${FIELD} flex items-center justify-between gap-3 ps-12 pe-4 text-start focus-visible:border-brand-orange focus-visible:ring-4 focus-visible:ring-brand-orange/15`}
                    renderValue={(o) => (
                      <>
                        <span className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-ink/35"><ITopic /></span>
                        <span className="truncate">{o?.label}</span>
                      </>
                    )}
                    renderOption={(o) => <span className="min-w-0 flex-1">{o.label}</span>}
                  />
                </Field>
                <Field label={c.message} htmlFor={`${id}-message`} className="md:col-span-2">
                  <div className="relative">
                    <span className="pointer-events-none absolute start-4 top-4 text-ink/35"><IChat /></span>
                    <textarea id={`${id}-message`} name="message" required rows={4} placeholder={c.messagePh} className={`${FIELD} h-36 resize-none py-4 ps-12 pe-4`} />
                  </div>
                </Field>
              </div>

              {/* Honeypot: hidden from people, bots fill it */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

              <button
                type="submit"
                disabled={sending}
                className="group mt-7 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-[14px] bg-brand-orange px-8 text-[16px] font-semibold text-white shadow-[0_14px_30px_-10px_rgba(245,139,50,0.7)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-10px_rgba(245,139,50,0.85)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-orange/30 disabled:cursor-wait disabled:opacity-80 motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:w-auto md:min-w-[14rem]"
              >
                {sending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" aria-hidden="true" />
                    {c.sending}
                  </>
                ) : (
                  <>
                    {c.send}
                    <ArrowIcon />
                  </>
                )}
              </button>

              {status === "error" ? (
                <p role="alert" className="cf-fade mt-4 rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700">{c.error}</p>
              ) : null}

              {/* Success state */}
              {status === "success" ? (
                <div
                  role="status"
                  onClick={() => setStatus("idle")}
                  className="cf-fade absolute inset-0 z-10 flex cursor-pointer flex-col items-center justify-center gap-5 rounded-[inherit] bg-white px-8 text-center"
                >
                  <span className="cf-ring flex h-20 w-20 items-center justify-center rounded-full bg-brand-orange/12 text-brand-orange">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path className="cf-draw" d="m5 12.5 4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <p className="max-w-[22rem] text-[18px] font-medium leading-[1.5] text-ink xl:text-[20px] xl:leading-[30px]">{c.success}</p>
                </div>
              ) : null}
            </form>
          </Reveal>
        </div>

        {/* Dark panel copy */}
        <div className="relative order-1 px-4 pb-8 pt-12 sm:px-6 lg:order-2 lg:p-0 lg:pt-[4rem]">
          <Reveal as="p" delay={150} className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.13em] text-white rtl:tracking-normal xl:text-[14px]">
            <span className="h-[2px] w-8 bg-brand-orange" aria-hidden="true" />
            {c.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={250} className="max-w-[26rem] text-[26px] font-semibold leading-[1.25] text-white md:text-[28px] xl:text-[32px] xl:leading-[40px]">
            {c.heading}
          </Reveal>
          <Reveal as="p" delay={350} className="mt-4 max-w-[26rem] text-[14px] leading-[22px] text-white/80 xl:text-[16px] xl:leading-[26px]">
            {c.text}
          </Reveal>
          <Reveal delay={450} className="mt-8 max-w-[26rem]">
            <div
              role="status"
              aria-live="polite"
              className={`flex items-center gap-4 rounded-2xl border p-4 text-[14px] leading-[1.5] transition-colors duration-300 ${
                status === "error" ? "border-red-400/30 bg-red-500/10 text-[#ff9b9b]" : "border-white/10 bg-white/[0.06] text-white/85 backdrop-blur-sm"
              }`}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${status === "error" ? "bg-red-500/15 text-[#ff9b9b]" : "bg-brand-orange/15 text-brand-orange"}`}>
                <ClockCalendarIcon />
              </span>
              <span>{noteText}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
