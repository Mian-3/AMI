"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

const LABEL = "mb-2 block text-[clamp(0.75rem,0.73vw,0.875rem)] font-medium uppercase tracking-[0.01em] text-[#4b5563]";
const FIELD =
  "h-12 w-full rounded-lg border border-transparent bg-white px-5 text-[clamp(1rem,0.94vw,1.125rem)] text-ink outline-none transition duration-200 placeholder:text-ink/40 focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/20 ";

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function ClockCalendarIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M40 22V10a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v26a3 3 0 0 0 3 3h14" />
      <path d="M6 16h34M14 4v6M32 4v6" />
      <path d="M12 23h3M19 23h3M26 23h3M12 29h3M19 29h3" />
      <circle cx="35" cy="35" r="8" />
      <path d="M35 31v4l3 2" />
    </svg>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className={LABEL}>{label}</label>
      {children}
    </div>
  );
}

export default function ContactForm({ dict }) {
  const c = dict.contactPage.form;
  const [status, setStatus] = useState("idle");

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const noteText =
    status === "success" ? c.success : status === "error" ? c.error : c.note;

  return (
    <section id="contact-form" className="relative scroll-mt-24 bg-[#201e1e]">
      {/* Desktop photo half */}
      <div className="absolute inset-y-0 start-0 hidden w-[46.25%] lg:block">
        <Image src="/images/contact/contact-form-bg.jpg" alt="" fill sizes="46vw" className="object-cover" />
      </div>

      <div className="relative mx-auto max-w-[75rem] lg:grid lg:grid-cols-[minmax(0,44.625fr)_minmax(0,26.125fr)] lg:gap-[4.25rem] lg:py-[6.5rem]">
        {/* Form card */}
        <div className="relative px-4 py-10 sm:px-6 lg:p-0">
          <div className="absolute inset-0 lg:hidden">
            <Image src="/images/contact/contact-form-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
          </div>
          <Reveal className="relative">
            <form
              id="contact-form-el"
              onSubmit={handleSubmit}
              className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl md:rounded-[2.5rem] md:p-[2.125rem]"
            >
              <div className="grid gap-5 md:grid-cols-2 md:gap-x-8 md:gap-y-6">
                <Field label={c.fullName}>
                  <input name="name" type="text" required autoComplete="name" placeholder={c.fullNamePh} className={FIELD} />
                </Field>
                <Field label={c.company}>
                  <input name="company" type="text" required autoComplete="organization" placeholder={c.companyPh} className={FIELD} />
                </Field>
                <Field label={c.email}>
                  <input name="email" type="email" required autoComplete="email" placeholder={c.emailPh} className={FIELD} />
                </Field>
                <Field label={c.phone}>
                  <div className="flex gap-3">
                    <span className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-white text-[clamp(1rem,0.94vw,1.125rem)] text-ink/50 " dir="ltr">+92</span>
                    <input name="phone" type="tel" required autoComplete="tel-national" inputMode="tel" placeholder={c.phonePh} className={FIELD} dir="ltr" />
                  </div>
                </Field>
                <Field label={c.topic} className="md:col-span-2">
                  <div className="relative">
                    <select name="topic" defaultValue={c.topics[0]} className={`${FIELD} appearance-none pe-12`}>
                      {c.topics.map((topic) => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true" className="pointer-events-none absolute end-5 top-1/2 -translate-y-1/2 text-ink/60">
                      <path d="M1 3l4 4 4-4z" />
                    </svg>
                  </div>
                </Field>
                <Field label={c.message} className="md:col-span-2">
                  <textarea name="message" required rows={4} placeholder={c.messagePh} className={`${FIELD} h-28 resize-none py-3 md:h-[7rem]`} />
                </Field>
              </div>
              {/* Honeypot: hidden from people, bots fill it */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
            </form>
          </Reveal>
        </div>

        {/* Dark panel copy */}
        <div className="px-4 pb-14 pt-10 sm:px-6 lg:p-0 lg:pt-[5rem]">
          <Reveal as="p" delay={150} className="mb-3 text-[clamp(0.75rem,0.73vw,0.875rem)] font-semibold uppercase tracking-[0.15em] text-white">
            {c.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={250} className="max-w-[26rem] text-[clamp(1.875rem,2.3vw,2.75rem)] font-bold leading-[1.1] text-white">
            {c.heading}
          </Reveal>
          <Reveal as="p" delay={350} className="mt-5 max-w-[26rem] text-[clamp(1rem,1.25vw,1.5rem)] leading-[1.5] text-white/85">
            {c.text}
          </Reveal>
          <Reveal delay={450} className="mt-7">
            <button
              type="submit"
              form="contact-form-el"
              disabled={status === "sending"}
              className="group inline-flex h-12 items-center gap-2 rounded-lg bg-brand-orange px-8 text-[0.875rem] font-medium text-white transition duration-200 hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-wait disabled:opacity-70 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              {status === "sending" ? c.sending : c.send}
              <ArrowIcon />
            </button>
          </Reveal>
          <Reveal delay={550} className="mt-5 max-w-[26rem]">
            <div
              role="status"
              aria-live="polite"
              className={`flex items-center gap-4 rounded-lg px-4 py-4 text-[clamp(0.8125rem,0.78vw,0.9375rem)] leading-[1.35] transition-colors duration-300 ${
                status === "error" ? "bg-[#4b1e1e] text-[#ff9b9b]" : "bg-[#4b381e] text-[#fba01f]"
              }`}
            >
              <span className="shrink-0"><ClockCalendarIcon /></span>
              <span>{noteText}</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
