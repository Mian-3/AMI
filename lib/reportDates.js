// Dates for reports are always Pakistan time (UTC+5, no daylight saving).
const PK_OFFSET_MS = 5 * 3600 * 1000;

export function pkToday() {
  return new Date(Date.now() + PK_OFFSET_MS).toISOString().slice(0, 10);
}

export function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function isDateStr(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(new Date(`${v}T00:00:00Z`).getTime());
}

// [fromMs, toMs) covering whole Pakistan days, both dates included.
export function dayRangeMs(fromStr, toStr) {
  const fromMs = new Date(`${fromStr}T00:00:00+05:00`).getTime();
  const toMs = new Date(`${addDays(toStr, 1)}T00:00:00+05:00`).getTime();
  return [fromMs, toMs];
}

export function fmtTime(iso) {
  return new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi" });
}

export function rangeLabel(fromStr, toStr) {
  const f = (s) => new Date(`${s}T00:00:00Z`).toLocaleDateString("en-GB", { dateStyle: "medium", timeZone: "UTC" });
  return fromStr === toStr ? f(fromStr) : `${f(fromStr)} to ${f(toStr)}`;
}
