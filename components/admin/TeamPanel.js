"use client";

import { useState, useTransition } from "react";
import { PRESETS } from "@/lib/teamShared";
import { inviteMember, revokeInvite, updateMember, setMemberDisabled, removeMember } from "@/app/admin/(panel)/team/actions";

const FIELD =
  "h-11 w-full rounded-lg border border-black/10 bg-white px-4 text-sm text-ink outline-none transition focus:border-brand-orange focus:ring-4 focus:ring-brand-orange/15";
const CARD = "rounded-xl border border-black/5 bg-white p-5 shadow-sm";
const BTN = "h-10 rounded-lg px-4 text-sm font-medium transition disabled:cursor-wait disabled:opacity-60";

function SectionPicker({ sections, value, onChange }) {
  const toggle = (key) => onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {sections.map((s) => (
        <label key={s.key} className="flex cursor-pointer items-start gap-3 rounded-lg border border-black/10 p-3 text-sm hover:border-brand-orange/50">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#e8731a]" checked={value.includes(s.key)} onChange={() => toggle(s.key)} />
          <span>
            <span className="block font-medium text-brand-navy">{s.label}</span>
            <span className="block text-xs text-ink/60">{s.hint}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

function matchPreset(value) {
  const sorted = [...value].sort().join(",");
  const hit = PRESETS.find((p) => p.key !== "custom" && [...p.sections].sort().join(",") === sorted);
  return hit ? hit.key : "custom";
}

function InviteForm({ sections }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [picked, setPicked] = useState(["insights", "content", "media"]);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();
  const preset = matchPreset(picked);

  const onPreset = (key) => {
    const p = PRESETS.find((x) => x.key === key);
    if (p && key !== "custom") setPicked(p.sections);
  };

  const submit = (e) => {
    e.preventDefault();
    setResult(null);
    setCopied(false);
    start(async () => {
      const res = await inviteMember({ email, name, sections: picked });
      setResult(res);
      if (res.ok) {
        setEmail("");
        setName("");
      }
    });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.link);
      setCopied(true);
    } catch {}
  };

  return (
    <form onSubmit={submit} className={`${CARD} mt-6 space-y-4`}>
      <h2 className="text-lg font-semibold text-brand-navy">Invite a person</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} placeholder="name@company.com" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">Name (optional)</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className={FIELD} />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink/60">Role preset</label>
        <select value={preset} onChange={(e) => onPreset(e.target.value)} className={FIELD}>
          {PRESETS.map((p) => (
            <option key={p.key} value={p.key}>{p.label}</option>
          ))}
        </select>
      </div>
      <SectionPicker sections={sections} value={picked} onChange={setPicked} />
      <button type="submit" disabled={pending} className={`${BTN} bg-brand-orange text-white hover:opacity-90`}>
        {pending ? "Sending..." : "Send invitation"}
      </button>

      {result && !result.ok ? <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{result.error}</p> : null}
      {result?.ok ? (
        <div className="space-y-2 rounded-lg bg-emerald-50 px-3 py-3 text-sm text-emerald-900">
          <p>
            {result.emailed
              ? "Invitation email sent. The same link is below if you want to share it another way."
              : "Invite created, but no email was sent (email is not set up or failed). Copy the link and send it yourself."}
          </p>
          <div className="flex gap-2">
            <input readOnly value={result.link} onFocus={(e) => e.target.select()} className="h-10 min-w-0 flex-1 rounded-lg border border-emerald-200 bg-white px-3 text-xs" />
            <button type="button" onClick={copy} className={`${BTN} border border-emerald-300 bg-white`}>{copied ? "Copied" : "Copy"}</button>
          </div>
          <p className="text-xs">This link works once and expires in {result.days} days. It is shown only now.</p>
        </div>
      ) : null}
    </form>
  );
}

function MemberCard({ member, sections }) {
  const [picked, setPicked] = useState(member.sections);
  const [msg, setMsg] = useState(null);
  const [pending, start] = useTransition();
  const preset = matchPreset(picked);
  const dirty = [...picked].sort().join() !== [...member.sections].sort().join();

  const save = () =>
    start(async () => {
      const res = await updateMember(member.id, { sections: picked });
      setMsg(res.ok ? { ok: true, text: "Access saved." } : { ok: false, text: res.error });
    });

  return (
    <div className={`${CARD} space-y-4 ${member.disabled ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-brand-navy">{member.name || member.email}</p>
          <p className="truncate text-xs text-ink/60">{member.email}</p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${member.disabled ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {member.disabled ? "Disabled" : "Active"}
        </span>
      </div>
      <select
        value={preset}
        onChange={(e) => {
          const p = PRESETS.find((x) => x.key === e.target.value);
          if (p && p.key !== "custom") setPicked(p.sections);
        }}
        className={FIELD}
      >
        {PRESETS.map((p) => (
          <option key={p.key} value={p.key}>{p.label}</option>
        ))}
      </select>
      <SectionPicker sections={sections} value={picked} onChange={setPicked} />
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={save} disabled={pending || !dirty} className={`${BTN} bg-brand-navy text-white hover:opacity-90`}>
          {pending ? "Saving..." : "Save access"}
        </button>
        <form action={setMemberDisabled}>
          <input type="hidden" name="id" value={member.id} />
          <input type="hidden" name="disabled" value={member.disabled ? "0" : "1"} />
          <button type="submit" className={`${BTN} border border-black/10`}>{member.disabled ? "Enable" : "Disable"}</button>
        </form>
        <form
          action={removeMember}
          onSubmit={(e) => {
            if (!window.confirm(`Remove ${member.email}? They will lose access immediately.`)) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={member.id} />
          <button type="submit" className={`${BTN} border border-red-200 text-red-700 hover:bg-red-50`}>Remove</button>
        </form>
        {msg ? <span className={`text-sm ${msg.ok ? "text-emerald-700" : "text-red-700"}`}>{msg.text}</span> : null}
      </div>
    </div>
  );
}

export default function TeamPanel({ sections, owners, members, invites, currentId }) {
  const labelOf = (k) => sections.find((s) => s.key === k)?.label || k;
  return (
    <div>
      <InviteForm sections={sections} />

      <h2 className="mt-10 text-lg font-semibold text-brand-navy">Pending invitations</h2>
      {invites.length === 0 ? (
        <p className="mt-2 text-sm text-ink/60">No pending invitations.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {invites.map((inv) => (
            <div key={inv.key} className={`${CARD} flex flex-wrap items-center justify-between gap-3 py-3`}>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-brand-navy">{inv.email}</p>
                <p className="text-xs text-ink/60">
                  {inv.sections.map(labelOf).join(", ")} · {inv.expired ? "Expired" : `Expires ${new Date(inv.expiresAt).toLocaleDateString("en-GB")}`}
                </p>
              </div>
              <form action={revokeInvite}>
                <input type="hidden" name="key" value={inv.key} />
                <button type="submit" className={`${BTN} border border-black/10`}>Revoke</button>
              </form>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-10 text-lg font-semibold text-brand-navy">Members</h2>
      <div className="mt-3 space-y-3">
        {owners.map((o) => (
          <div key={o.id} className={`${CARD} flex flex-wrap items-center justify-between gap-2 py-3`}>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-brand-navy">{o.name || o.email}{o.id === currentId ? " (you)" : ""}</p>
              <p className="truncate text-xs text-ink/60">{o.email}</p>
            </div>
            <span className="rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-xs font-medium text-brand-navy">Owner, full access</span>
          </div>
        ))}
        {members.length === 0 ? <p className="text-sm text-ink/60">No invited members yet.</p> : null}
        {members.map((m) => (
          <MemberCard key={m.id} member={m} sections={sections} />
        ))}
      </div>
    </div>
  );
}
