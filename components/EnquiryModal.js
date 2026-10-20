"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ENQUIRY_CSS } from "@/lib/enquiryStyles";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const EMPTY = {
  name: "", company: "", email: "", phone: "", location: "",
  industry: "", industryOther: "",
  interest: "", form: "", requests: [],
  sampleProfile: "", sampleVolume: "", sampleApplication: "", sampleAddress: "",
  message: "", source: "", contactTime: "", contactMethod: "",
  consent: false, website: "",
};

const norm = (s) => String(s || "").replace(/\s+/g, " ").trim().toLowerCase();
const SAMPLE_RX = /(request(ing)?\s+(a\s+|for\s+)?(free\s+)?sample)|اطلب عينة|طلب عينة/i;

/* ---------- small icons ---------- */
const Svg = ({ children, ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>{children}</svg>
);
const CheckIcon = () => <Svg strokeWidth="3"><path d="m5 12.5 4.5 4.5L19 7.5" /></Svg>;
const ArrowIcon = () => <Svg className="eq-arr"><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
const BackIcon = () => <Svg className="eq-flip"><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
const CloseIcon = () => <Svg strokeWidth="2.2"><path d="M18 6 6 18M6 6l12 12" /></Svg>;
const PhoneIcon = () => <Svg strokeWidth="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></Svg>;
const MailIcon = () => <Svg strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Svg>;
const ChatIcon = () => <Svg strokeWidth="1.8"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20.5l1.7-5A8.4 8.4 0 1 1 21 11.5Z" /></Svg>;

function Tick() {
  return (
    <span className="eq-tick" aria-hidden="true">
      <CheckIcon />
    </span>
  );
}

function Option({ checked, onClick, role, i, note, children }) {
  return (
    <button type="button" role={role} aria-checked={checked} className="eq-opt" style={{ "--i": i }} onClick={onClick}>
      <span>{children}</span>
      {note ? <small>{note}</small> : null}
      <Tick />
    </button>
  );
}

export default function EnquiryModal({ dict, locale }) {
  const t = dict.enquiryForm;
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState("fwd");
  const [data, setData] = useState(EMPTY);
  const [err, setErr] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef(null);
  const lastFocus = useRef(null);
  const bodyRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => setMounted(true), []);

  const set = (patch) => setData((d) => ({ ...d, ...patch }));
  const wantsSample = data.requests.includes(t.needs.requestOptions[0]);
  const steps = useMemo(() => ["about", "industry", "needs", ...(wantsSample ? ["sample"] : []), "details", "review"], [wantsSample]);
  const key = steps[step] || steps[0];
  const stepNames = { about: t.stepNames[0], industry: t.stepNames[1], needs: t.stepNames[2], sample: t.stepNames[3], details: t.stepNames[4], review: t.stepNames[5] };

  /* ---------- open / close ---------- */
  const openModal = useCallback(() => {
    lastFocus.current = typeof document !== "undefined" ? document.activeElement : null;
    setClosing(false);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
      setStatus((s) => {
        if (s === "done") {
          setData(EMPTY);
          setStep(0);
        }
        return s === "done" ? "idle" : s;
      });
      if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
    }, 260);
  }, []);

  // Any "Request a Sample" button or link on the site opens the popup.
  // It listens on window in the capture phase and also takes the link's href away for a moment when the
  // pointer goes down, so a page-transition script (or the browser) cannot navigate to the Contact page first.
  useEffect(() => {
    const labels = [dict.buttons?.requestSample, dict.contactPage?.cta?.sample, t.side?.eyebrow].filter(Boolean).map(norm);
    const saved = new WeakMap();

    function findTrigger(target) {
      const el = target?.closest?.("[data-enquiry],a,button");
      if (!el || el.closest(".eq-root")) return null;
      if (el.hasAttribute("data-enquiry")) return el;
      if (el.tagName === "A" || (el.tagName === "BUTTON" && el.type !== "submit")) {
        const text = norm(el.textContent);
        if (text.length < 48 && (labels.includes(text) || SAMPLE_RX.test(text))) return el;
      }
      return null;
    }
    function restore(el) {
      const h = saved.get(el);
      if (h != null) {
        el.setAttribute("href", h);
        saved.delete(el);
      }
    }
    function arm(e) {
      if ((e.type === "pointerdown" && e.button !== 0) || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (e.type === "keydown") {
        if (e.key !== "Enter") return;
        const k = findTrigger(e.target);
        if (!k) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        openModal();
        return;
      }
      const el = findTrigger(e.target);
      if (!el || el.tagName !== "A" || !el.hasAttribute("href") || saved.has(el)) return;
      saved.set(el, el.getAttribute("href"));
      el.removeAttribute("href");
      setTimeout(() => restore(el), 1500);
    }
    function onClick(e) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = findTrigger(e.target);
      if (!el) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      setTimeout(() => restore(el), 0);
      openModal();
    }
    function onEvent() { openModal(); }

    window.addEventListener("pointerdown", arm, true);
    window.addEventListener("keydown", arm, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("open-enquiry", onEvent);
    return () => {
      window.removeEventListener("pointerdown", arm, true);
      window.removeEventListener("keydown", arm, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("open-enquiry", onEvent);
    };
  }, [dict, t, openModal]);

  // scroll lock, Escape, focus trap
  useEffect(() => {
    if (!open) return;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (sbw > 0) document.body.style.paddingRight = sbw + "px";

    function onKey(e) {
      if (e.key === "Escape") { e.preventDefault(); closeModal(); return; }
      if (e.key !== "Tab" || !panelRef.current) return;
      const f = [...panelRef.current.querySelectorAll('button:not([disabled]),input:not([type="hidden"]),select,textarea,a[href]')].filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener("keydown", onKey);
    const focusTimer = setTimeout(() => {
      const first = panelRef.current?.querySelector(".eq-body input, .eq-body select, .eq-body textarea, .eq-body .eq-opt");
      (first || panelRef.current)?.focus?.({ preventScroll: true });
    }, 380);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [open, closeModal]);

  /* ---------- navigation ---------- */
  function validate() {
    if (key === "about") return data.name.trim() && data.company.trim() && EMAIL_RE.test(data.email.trim()) && data.phone.trim() ? "" : t.about.error;
    if (key === "industry") return data.industry && (data.industry !== t.industry.options[t.industry.options.length - 1] || data.industryOther.trim()) ? "" : t.industry.error;
    if (key === "needs") return data.interest && data.requests.length ? "" : t.needs.error;
    if (key === "details") return data.contactMethod ? "" : t.details.error;
    if (key === "review") return data.consent ? "" : t.review.error;
    return "";
  }

  function go(delta) {
    setDir(delta > 0 ? "fwd" : "back");
    setErr("");
    setStep((s) => Math.max(0, Math.min(steps.length - 1, s + delta)));
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }

  function next() {
    const m = validate();
    if (m) { setErr(m); return; }
    go(1);
  }

  function onEnter(e) {
    if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.type !== "checkbox") {
      e.preventDefault();
      if (key === "review") submit(); else next();
    }
  }

  async function submit() {
    const m = validate();
    if (m) { setErr(m); return; }
    setStatus("sending");
    setErr("");
    const other = t.industry.options[t.industry.options.length - 1];
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          industry: data.industry === other ? `${data.industry}: ${data.industryOther}` : data.industry,
          wantsSample,
          locale,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setErr(res.status === 429 && json.error ? json.error : t.ui.error);
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch {
      setErr(t.ui.error);
      setStatus("idle");
    }
  }

  // swipe down on the header (mobile sheet) to close
  function dragStart(e) {
    if (window.innerWidth > 860 || !panelRef.current) return;
    dragRef.current = { y: e.touches[0].clientY, dy: 0 };
    panelRef.current.style.transition = "none";
  }
  function dragMove(e) {
    const d = dragRef.current;
    if (!d) return;
    d.dy = Math.max(0, e.touches[0].clientY - d.y);
    panelRef.current.style.transform = `translateY(${d.dy}px)`;
  }
  function dragEnd() {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d || !panelRef.current) return;
    const el = panelRef.current;
    el.style.transition = "transform .35s cubic-bezier(.22,1,.36,1)";
    if (d.dy > 110) closeModal();
    else el.style.transform = "";
    setTimeout(() => { if (el) el.style.transition = ""; }, 380);
  }

  /* ---------- helpers for fields ---------- */
  const toggleReq = (label) => set({ requests: data.requests.includes(label) ? data.requests.filter((x) => x !== label) : [...data.requests, label] });
  const reqLabel = (o) => (o ? <>{o}</> : null);

  const c = t.contact;
  const waDigits = String(c.whatsapp || "").replace(/\D/g, "");
  const telHref = "tel:" + String(c.phone || "").replace(/[^\d+]/g, "");
  const waText = encodeURIComponent(`${data.name || ""} - ${data.company || ""}: ${data.requests.join(", ")}`.trim());

  const sep = locale === "ar" ? "، " : ", ";
  const rows = [
    [t.review.name, data.name],
    [t.review.company, data.company],
    [t.review.email, data.email, true],
    [t.review.phone, data.phone, true],
    [t.review.industry, data.industry === t.industry.options[t.industry.options.length - 1] ? data.industryOther || data.industry : data.industry],
    [t.review.interest, data.interest],
    [t.review.form, data.form],
    [t.review.requests, data.requests.join(sep)],
    ...(wantsSample ? [[t.review.sample, data.sampleProfile]] : []),
    [t.review.method, data.contactMethod],
  ];

  if (!mounted || !open) return null;

  const done = status === "done";
  const sending = status === "sending";

  return createPortal(
    <div className="eq-root" data-closing={closing ? "true" : "false"} role="presentation">
      <style>{ENQUIRY_CSS}</style>
      <div className="eq-back" onClick={closeModal} />
      <div ref={panelRef} className="eq-panel" role="dialog" aria-modal="true" aria-label={t.side.eyebrow} tabIndex={-1} onKeyDown={onEnter}>
        {/* ---------- side ---------- */}
        <aside className="eq-side">
          <span className="eq-logo">
            <Image src="/images/logo/am-international-logo.svg" alt="A.M International" width={1184} height={329} />
          </span>
          <p className="eq-side-eyebrow">{t.side.eyebrow}</p>
          <h2 className="eq-side-h">{t.side.heading}</h2>
          <p className="eq-side-t">{t.side.text}</p>
          <ul className="eq-points">
            {t.side.points.map((p) => (
              <li key={p}><CheckIcon />{p}</li>
            ))}
          </ul>
          <div className="eq-contact">
            <a href={telHref}><PhoneIcon /><span><small>{c.callLabel}</small><span className="eq-ltr">{c.phone}</span></span></a>
            <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer"><ChatIcon /><span><small>{c.whatsappLabel}</small><span className="eq-ltr">{c.whatsapp}</span></span></a>
            <a href={`mailto:${c.email}`}><MailIcon /><span><small>{c.emailLabel}</small>{c.email}</span></a>
          </div>
        </aside>

        {/* ---------- main ---------- */}
        <div className="eq-main">
          <div className="eq-head" onTouchStart={dragStart} onTouchMove={dragMove} onTouchEnd={dragEnd} onTouchCancel={dragEnd}>
            <span className="eq-grab" aria-hidden="true" />
            <div className="eq-top">
              <span className="eq-mlogo">
                <Image src="/images/logo/am-international-logo.svg" alt="A.M International" width={1184} height={329} />
              </span>
              <span className="eq-count">
                {done ? null : (
                  <>
                    <span className="eq-cnt-n">
                      {t.ui.stepOf.replace("{n}", String(step + 1)).replace("{total}", String(steps.length))}
                    </span>
                    <b>{stepNames[key]}</b>
                  </>
                )}
              </span>
              <button type="button" className="eq-x" onClick={closeModal} aria-label={t.ui.close}><CloseIcon /></button>
            </div>
            {!done ? (
              <div className="eq-bar" aria-hidden="true">
                {steps.map((s, i) => (
                  <span key={s} className="eq-seg" data-on={i <= step ? "true" : "false"}><i /></span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="eq-body" ref={bodyRef}>
            {done ? (
              <div className="eq-done" aria-live="polite">
                <span className="eq-ok">
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="24" cy="24" r="21" />
                    <path d="m14 25 7 7 13-15" />
                  </svg>
                </span>
                <h2>{t.success.heading.replace("{name}", (data.name.trim().split(/\s+/)[0]) || "")}</h2>
                <p>{t.success.text}</p>
                <p className="eq-resp">{t.success.response}</p>
                <div className="eq-alt">
                  <a className="eq-wa" href={`https://wa.me/${waDigits}?text=${waText}`} target="_blank" rel="noopener noreferrer"><ChatIcon />{t.success.whatsappCta}</a>
                  <a href={telHref}><PhoneIcon /><span className="eq-ltr">{c.phone}</span></a>
                  <a href={`mailto:${c.email}`}><MailIcon />{c.email}</a>
                </div>
              </div>
            ) : (
              <div className="eq-step" key={key} data-dir={dir}>
                {key === "about" && (
                  <>
                    <p className="eq-eyebrow">{t.about.eyebrow}</p>
                    <h2 className="eq-h">{t.about.heading}</h2>
                    <p className="eq-sub">{t.about.sub}</p>
                    <div className="eq-field">
                      <label className="eq-l" htmlFor="eq_name">{t.about.fullName}<em>*</em></label>
                      <input id="eq_name" className="eq-in" autoComplete="name" value={data.name} placeholder={t.about.fullNamePh} onChange={(e) => set({ name: e.target.value })} />
                    </div>
                    <div className="eq-g2">
                      <div className="eq-field">
                        <label className="eq-l" htmlFor="eq_company">{t.about.company}<em>*</em></label>
                        <input id="eq_company" className="eq-in" autoComplete="organization" value={data.company} placeholder={t.about.companyPh} onChange={(e) => set({ company: e.target.value })} />
                      </div>
                      <div className="eq-field">
                        <label className="eq-l" htmlFor="eq_email">{t.about.email}<em>*</em></label>
                        <input id="eq_email" type="email" dir="ltr" className="eq-in" autoComplete="email" value={data.email} placeholder={t.about.emailPh} onChange={(e) => set({ email: e.target.value })} />
                      </div>
                    </div>
                    <div className="eq-g2">
                      <div className="eq-field">
                        <label className="eq-l" htmlFor="eq_phone">{t.about.phone}<em>*</em></label>
                        <input id="eq_phone" type="tel" dir="ltr" className="eq-in" autoComplete="tel" value={data.phone} placeholder={t.about.phonePh} onChange={(e) => set({ phone: e.target.value })} />
                      </div>
                      <div className="eq-field">
                        <label className="eq-l" htmlFor="eq_loc">{t.about.location}</label>
                        <input id="eq_loc" className="eq-in" autoComplete="address-level2" value={data.location} placeholder={t.about.locationPh} onChange={(e) => set({ location: e.target.value })} />
                      </div>
                    </div>
                    {/* honeypot */}
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={data.website} onChange={(e) => set({ website: e.target.value })} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
                  </>
                )}

                {key === "industry" && (
                  <>
                    <p className="eq-eyebrow">{t.industry.eyebrow}</p>
                    <h2 className="eq-h">{t.industry.heading}</h2>
                    <p className="eq-sub">{t.industry.sub}</p>
                    <div className="eq-field">
                      <div className="eq-opts" data-compact="true" role="radiogroup" aria-label={t.industry.heading}>
                        {t.industry.options.map((o, i) => (
                          <Option key={o} role="radio" i={i} checked={data.industry === o} onClick={() => set({ industry: o })}>{o}</Option>
                        ))}
                      </div>
                    </div>
                    {data.industry === t.industry.options[t.industry.options.length - 1] ? (
                      <div className="eq-field eq-other">
                        <label className="eq-l" htmlFor="eq_other">{t.industry.otherLabel}<em>*</em></label>
                        <input id="eq_other" className="eq-in" value={data.industryOther} placeholder={t.industry.otherPh} onChange={(e) => set({ industryOther: e.target.value })} />
                      </div>
                    ) : null}
                  </>
                )}

                {key === "needs" && (
                  <>
                    <p className="eq-eyebrow">{t.needs.eyebrow}</p>
                    <h2 className="eq-h">{t.needs.heading}</h2>
                    <div className="eq-field">
                      <span className="eq-l">{t.needs.interestLabel}<em>*</em></span>
                      <div className="eq-opts" data-cols="3" role="radiogroup" aria-label={t.needs.interestLabel}>
                        {t.needs.interestOptions.map((o, i) => (
                          <Option key={o} role="radio" i={i} checked={data.interest === o} onClick={() => set({ interest: o })}>{o}</Option>
                        ))}
                      </div>
                    </div>
                    <div className="eq-field">
                      <span className="eq-l">{t.needs.formLabel}<span>{t.ui.optional}</span></span>
                      <div className="eq-opts" data-cols="3" role="radiogroup" aria-label={t.needs.formLabel}>
                        {t.needs.formOptions.map((o, i) => (
                          <Option key={o} role="radio" i={i + 3} checked={data.form === o} onClick={() => set({ form: data.form === o ? "" : o })}>{o}</Option>
                        ))}
                      </div>
                    </div>
                    <div className="eq-field">
                      <span className="eq-l">{t.needs.requestLabel}<em>*</em><span>{t.needs.requestHint}</span></span>
                      <div className="eq-opts" role="group" aria-label={t.needs.requestLabel}>
                        {t.needs.requestOptions.map((o, i) => (
                          <Option key={o} role="checkbox" i={i + 6} note={t.needs.requestNotes[i]} checked={data.requests.includes(o)} onClick={() => toggleReq(o)}>{reqLabel(o)}</Option>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {key === "sample" && (
                  <>
                    <p className="eq-eyebrow">{t.sample.eyebrow}</p>
                    <h2 className="eq-h">{t.sample.heading}</h2>
                    <p className="eq-sub">{t.sample.sub}</p>
                    <div className="eq-field">
                      <label className="eq-l" htmlFor="eq_profile">{t.sample.profile}</label>
                      <input id="eq_profile" className="eq-in" value={data.sampleProfile} placeholder={t.sample.profilePh} onChange={(e) => set({ sampleProfile: e.target.value })} />
                    </div>
                    <div className="eq-g2">
                      <div className="eq-field">
                        <label className="eq-l" htmlFor="eq_vol">{t.sample.volume}</label>
                        <select id="eq_vol" className="eq-sel" value={data.sampleVolume} onChange={(e) => set({ sampleVolume: e.target.value })}>
                          <option value="">{t.ui.choose}</option>
                          {t.sample.volumeOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="eq-field">
                        <label className="eq-l" htmlFor="eq_app">{t.sample.application}</label>
                        <input id="eq_app" className="eq-in" value={data.sampleApplication} placeholder={t.sample.applicationPh} onChange={(e) => set({ sampleApplication: e.target.value })} />
                      </div>
                    </div>
                    <div className="eq-field">
                      <label className="eq-l" htmlFor="eq_addr">{t.sample.address}</label>
                      <textarea id="eq_addr" className="eq-ta" value={data.sampleAddress} placeholder={t.sample.addressPh} onChange={(e) => set({ sampleAddress: e.target.value })} />
                    </div>
                  </>
                )}

                {key === "details" && (
                  <>
                    <p className="eq-eyebrow">{t.details.eyebrow}</p>
                    <h2 className="eq-h">{t.details.heading}</h2>
                    <div className="eq-field">
                      <label className="eq-l" htmlFor="eq_msg">{t.details.message}</label>
                      <textarea id="eq_msg" className="eq-ta" value={data.message} placeholder={t.details.messagePh} onChange={(e) => set({ message: e.target.value })} />
                    </div>
                    <div className="eq-g2">
                      <div className="eq-field">
                        <label className="eq-l" htmlFor="eq_src">{t.details.source}</label>
                        <select id="eq_src" className="eq-sel" value={data.source} onChange={(e) => set({ source: e.target.value })}>
                          <option value="">{t.ui.choose}</option>
                          {t.details.sourceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="eq-field">
                        <label className="eq-l" htmlFor="eq_time">{t.details.time}</label>
                        <input id="eq_time" className="eq-in" value={data.contactTime} placeholder={t.details.timePh} onChange={(e) => set({ contactTime: e.target.value })} />
                      </div>
                    </div>
                    <div className="eq-field">
                      <span className="eq-l">{t.details.method}<em>*</em></span>
                      <div className="eq-opts" data-cols="3" role="radiogroup" aria-label={t.details.method}>
                        {t.details.methodOptions.map((o, i) => (
                          <Option key={o} role="radio" i={i} checked={data.contactMethod === o} onClick={() => set({ contactMethod: o })}>{o}</Option>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {key === "review" && (
                  <>
                    <p className="eq-eyebrow">{t.review.eyebrow}</p>
                    <h2 className="eq-h">{t.review.heading}</h2>
                    <div className="eq-rv">
                      {rows.filter(([, v]) => v).map(([k, v, ltr], i) => (
                        <div className="eq-row" key={k} style={{ "--i": i }}><span>{k}</span><span dir={ltr ? "ltr" : "auto"}>{v}</span></div>
                      ))}
                    </div>
                    <label className="eq-consent">
                      <input type="checkbox" checked={data.consent} onChange={(e) => set({ consent: e.target.checked })} />
                      <span className="eq-box" aria-hidden="true"><CheckIcon /></span>
                      <span>{t.review.consent}</span>
                    </label>
                  </>
                )}

                {err ? <p className="eq-err" role="alert" key={err + step}>{err}</p> : null}
              </div>
            )}
          </div>

          <div className="eq-nav">
            {done ? (
              <>
                <span />
                <button type="button" className="eq-btn eq-primary" onClick={closeModal}>{t.success.done}</button>
              </>
            ) : (
              <>
                {step > 0 ? (
                  <button type="button" className="eq-btn eq-ghost" onClick={() => go(-1)} disabled={sending}><BackIcon />{t.ui.back}</button>
                ) : <span />}
                {key === "review" ? (
                  <button type="button" className="eq-btn eq-primary" onClick={submit} disabled={sending}>
                    {sending ? <><span className="eq-spin" />{t.ui.submitting}</> : <>{t.ui.submit}<CheckIcon /></>}
                  </button>
                ) : (
                  <button type="button" className="eq-btn eq-primary" onClick={next}>{t.ui.next}<ArrowIcon /></button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
