"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { areaLabel, formatDay, formatTime, initials, isOnline, timeAgo } from "@/lib/activityShared";

const CARD = "rounded-xl border border-black/5 bg-white p-4 shadow-sm";

function Avatar({ name, online }) {
  return (
    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-navy/10 text-sm font-semibold text-brand-navy">
      {initials(name)}
      <span className={`absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full border-2 border-white ${online ? "bg-emerald-500" : "bg-black/20"}`} />
    </span>
  );
}

export default function ActivityPanel({ team, activity, nowIso }) {
  const router = useRouter();
  const [now, setNow] = useState(Date.parse(nowIso));
  const [who, setWho] = useState("all");

  useEffect(() => {
    const t = setInterval(() => {
      router.refresh();
      setNow(Date.now());
    }, 30000);
    return () => clearInterval(t);
  }, [router]);
  useEffect(() => setNow(Date.parse(nowIso)), [nowIso]);

  const online = team.filter((m) => isOnline(m.lastSeen, now));
  const filtered = activity.filter((a) => who === "all" || String(a.userId) === who);

  // Group by day, newest first.
  const groups = [];
  for (const a of filtered) {
    const day = formatDay(a.at);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.items.push(a);
    else groups.push({ day, items: [a] });
  }

  return (
    <div className="mt-6 space-y-8">
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-brand-navy">
          Online now
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">{online.length}</span>
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {team.map((m) => {
            const on = isOnline(m.lastSeen, now);
            return (
              <li key={m.id} className={`${CARD} flex items-center gap-3 ${on ? "" : "opacity-75"}`}>
                <Avatar name={m.name} online={on} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-navy">
                    {m.name}
                    {m.isOwner ? <span className="ms-2 rounded-full bg-brand-navy/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">Owner</span> : null}
                  </p>
                  <p className="truncate text-xs text-ink/60">
                    {on ? `Online, in ${areaLabel(m.path)}` : m.lastSeen ? `Last seen ${timeAgo(m.lastSeen, now)}` : "Has not opened the admin yet"}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-brand-navy">Recent changes</h2>
          <select value={who} onChange={(e) => setWho(e.target.value)} className="h-9 rounded-lg border border-black/10 bg-white px-3 text-sm" aria-label="Filter by person">
            <option value="all">Everyone</option>
            {team.map((m) => (
              <option key={m.id} value={String(m.id)}>{m.name}</option>
            ))}
          </select>
        </div>

        {groups.length === 0 ? (
          <p className={`${CARD} text-sm text-ink/60`}>Nothing yet. Changes appear here as soon as someone saves something.</p>
        ) : (
          <div className="space-y-5">
            {groups.map((g) => (
              <div key={g.day}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/50">{g.day}</p>
                <ul className={`${CARD} divide-y divide-black/5 py-1`}>
                  {g.items.map((a) => (
                    <li key={a.id} className="flex items-start gap-3 py-3">
                      <Avatar name={a.name || a.email} online={false} />
                      <div className="min-w-0 flex-1 text-sm">
                        <p className="text-ink">
                          <span className="font-semibold text-brand-navy">{a.name || a.email}</span> {a.action}
                          {a.detail ? <span className="text-ink/70">: {a.detail}</span> : null}
                        </p>
                        {a.area ? <p className="mt-0.5 text-xs text-ink/50">{a.area}</p> : null}
                      </div>
                      <span className="shrink-0 text-xs text-ink/50">{formatTime(a.at)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
