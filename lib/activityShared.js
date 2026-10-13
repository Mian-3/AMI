// Shared helpers for the activity log and the "who is online" display.
// Safe for server and client code. Times are shown in Pakistan time.

export const TIME_ZONE = "Asia/Karachi";
export const ONLINE_WINDOW_MS = 150 * 1000; // a person counts as online if seen in the last 2.5 minutes
export const HEARTBEAT_MS = 45 * 1000;

const AREAS = [
  ["/admin/insights", "Insights"],
  ["/admin/content", "Site content"],
  ["/admin/flavours", "Flavours page"],
  ["/admin/media", "Media and links"],
  ["/admin/enquiries", "Enquiries"],
  ["/admin/events", "Events"],
  ["/admin/team", "Team and access"],
  ["/admin/activity", "Activity"],
];

export function areaLabel(path) {
  if (typeof path !== "string") return "Dashboard";
  const hit = AREAS.find(([prefix]) => path === prefix || path.startsWith(prefix + "/"));
  return hit ? hit[1] : "Dashboard";
}

export function isOnline(lastSeenIso, nowMs = Date.now()) {
  const t = Date.parse(lastSeenIso || "");
  return Number.isFinite(t) && nowMs - t < ONLINE_WINDOW_MS;
}

export function timeAgo(iso, nowMs = Date.now()) {
  const t = Date.parse(iso || "");
  if (!Number.isFinite(t)) return "never";
  const s = Math.max(0, Math.round((nowMs - t) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

export function formatTime(iso) {
  const t = Date.parse(iso || "");
  if (!Number.isFinite(t)) return "";
  return new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hour12: true }).format(t);
}

export function formatDay(iso) {
  const t = Date.parse(iso || "");
  if (!Number.isFinite(t)) return "";
  const fmt = (d) => new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  const day = fmt(t);
  if (day === fmt(Date.now())) return "Today";
  if (day === fmt(Date.now() - 86400000)) return "Yesterday";
  return new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, weekday: "short", day: "numeric", month: "short", year: "numeric" }).format(t);
}

export function initials(name) {
  const parts = String(name || "?").trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "?";
}
