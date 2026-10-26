import Link from "next/link";
import { buildReport, summarize } from "@/lib/report";
import { addDays, fmtTime, isDateStr, pkToday } from "@/lib/reportDates";

export const dynamic = "force-dynamic";

const card = "rounded-xl border border-black/5 bg-white shadow-sm";
const th = "px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-ink/50";
const td = "px-3 py-2 align-top text-sm text-ink/80";

function Stat({ label, value, tone }) {
  return (
    <div className={card + " p-4"}>
      <p className={"text-2xl font-bold " + (tone || "text-brand-navy")}>{value}</p>
      <p className="mt-1 text-xs text-ink/60">{label}</p>
    </div>
  );
}

export default async function ReportsPage({ searchParams }) {
  const sp = await searchParams;
  const today = pkToday();
  let from = isDateStr(sp?.from) ? sp.from : today;
  let to = isDateStr(sp?.to) ? sp.to : from;
  if (to < from) [from, to] = [to, from];
  if (to > addDays(from, 92)) to = addDays(from, 92);

  let report;
  let failed = false;
  try {
    report = await buildReport(from, to);
  } catch (error) {
    console.error("[reports] could not build", error);
    failed = true;
  }
  const s = report ? summarize(report) : null;
  const dl = (format) => `/api/admin/report?from=${from}&to=${to}&format=${format}`;
  const quick = [
    ["Today", today, today],
    ["Yesterday", addDays(today, -1), addDays(today, -1)],
    ["Last 7 days", addDays(today, -6), today],
    ["Last 30 days", addDays(today, -29), today],
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-brand-navy">Reports</h1>
      <p className="mt-1 text-sm text-ink/60">Pick any day or period to see the enquiries, sign ins and changes. A report is also emailed every Friday night.</p>

      <form method="get" className={card + " mt-5 flex flex-wrap items-end gap-3 p-4"}>
        <label className="text-xs font-medium text-ink/60">
          From
          <input type="date" name="from" defaultValue={from} max={today} className="mt-1 block rounded-lg border border-black/10 px-3 py-2 text-sm text-ink" />
        </label>
        <label className="text-xs font-medium text-ink/60">
          To
          <input type="date" name="to" defaultValue={to} max={today} className="mt-1 block rounded-lg border border-black/10 px-3 py-2 text-sm text-ink" />
        </label>
        <button type="submit" className="h-[38px] rounded-lg bg-brand-navy px-4 text-sm font-medium text-white transition hover:opacity-90">Show</button>
        <div className="ms-auto flex flex-wrap gap-2">
          {quick.map(([label, f, t]) => (
            <Link key={label} href={`/admin/reports?from=${f}&to=${t}`} className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink/70 transition hover:bg-black/5">{label}</Link>
          ))}
        </div>
      </form>

      {failed ? (
        <p className="mt-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">The report could not be built. Check that the database is reachable.</p>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-brand-navy">{report.label}</h2>
            <div className="flex gap-2">
              <a href={dl("pdf")} className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">Download PDF</a>
              <a href={dl("docx")} className="rounded-lg border border-brand-navy/20 px-4 py-2 text-sm font-medium text-brand-navy transition hover:bg-brand-navy/5">Download Word</a>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Enquiries received" value={s.enquiries} />
            <Stat label="Successful sign ins" value={s.signIns} />
            <Stat label="Failed sign ins" value={s.failed} tone={s.failed ? "text-red-600" : undefined} />
            <Stat label="Changes in the admin" value={s.changes} />
          </div>
          {report.truncated ? <p className="mt-3 text-xs text-amber-700">Very busy period: only the newest entries are listed.</p> : null}

          <h3 className="mt-8 text-base font-semibold text-brand-navy">Enquiries</h3>
          <div className={card + " mt-2 overflow-x-auto"}>
            {report.enquiries.length === 0 ? (
              <p className="p-6 text-center text-sm text-ink/60">No enquiries in this period.</p>
            ) : (
              <table className="w-full min-w-[640px]">
                <thead><tr className="border-b border-black/5"><th className={th}>When</th><th className={th}>From</th><th className={th}>Contact</th><th className={th}>Topic</th><th className={th}>Message</th></tr></thead>
                <tbody>
                  {report.enquiries.map((e, i) => (
                    <tr key={i} className="border-b border-black/5 last:border-0">
                      <td className={td + " whitespace-nowrap"}>{fmtTime(e.at)}</td>
                      <td className={td}><span className="font-medium">{e.name}</span><br />{e.company}</td>
                      <td className={td}>{e.email}<br />{e.phone}</td>
                      <td className={td}>{e.topic || "-"}</td>
                      <td className={td + " max-w-[18rem] whitespace-pre-line break-words"}>{e.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <h3 className="mt-8 text-base font-semibold text-brand-navy">Sign in attempts</h3>
          <div className={card + " mt-2 overflow-x-auto"}>
            {report.logins.length === 0 ? (
              <p className="p-6 text-center text-sm text-ink/60">No sign in attempts in this period.</p>
            ) : (
              <table className="w-full min-w-[560px]">
                <thead><tr className="border-b border-black/5"><th className={th}>When</th><th className={th}>Email</th><th className={th}>Result</th><th className={th}>Address</th></tr></thead>
                <tbody>
                  {report.logins.map((l) => (
                    <tr key={l.id} className="border-b border-black/5 last:border-0">
                      <td className={td + " whitespace-nowrap"}>{fmtTime(l.at)}</td>
                      <td className={td}>{l.email || "-"}</td>
                      <td className={td}>{l.ok ? <span className="font-medium text-emerald-700">Signed in</span> : <span className="font-medium text-red-600">Failed ({l.reason || "unknown"})</span>}</td>
                      <td className={td}>{l.ip || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <h3 className="mt-8 text-base font-semibold text-brand-navy">Changes in the admin</h3>
          <div className={card + " mt-2 mb-10 overflow-x-auto"}>
            {report.activity.length === 0 ? (
              <p className="p-6 text-center text-sm text-ink/60">No changes in this period.</p>
            ) : (
              <table className="w-full min-w-[560px]">
                <thead><tr className="border-b border-black/5"><th className={th}>When</th><th className={th}>Who</th><th className={th}>Area</th><th className={th}>What</th></tr></thead>
                <tbody>
                  {report.activity.map((a) => (
                    <tr key={a.id} className="border-b border-black/5 last:border-0">
                      <td className={td + " whitespace-nowrap"}>{fmtTime(a.at)}</td>
                      <td className={td}>{a.name || a.email || "-"}</td>
                      <td className={td}>{a.area || "-"}</td>
                      <td className={td}>{a.action}{a.detail ? `: ${a.detail}` : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
