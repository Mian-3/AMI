// Cleaning for events saved from the admin. Never trust the browser.

function text(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function url(value) {
  const v = text(value, 600);
  if (!v) return "";
  return (v.startsWith("https://") || (v.startsWith("/") && !v.startsWith("//"))) ? v : "";
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function validateEvent(input) {
  const status = input?.status === "published" ? "published" : "draft";
  const date = text(input?.date, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T00:00:00Z`).getTime())) {
    return { ok: false, error: "Choose a valid event date." };
  }
  const endRaw = text(input?.endDate, 10);
  const endDate = endRaw && /^\d{4}-\d{2}-\d{2}$/.test(endRaw) && !Number.isNaN(new Date(`${endRaw}T00:00:00Z`).getTime()) ? endRaw : "";
  if (endRaw && !endDate) return { ok: false, error: "Choose a valid end date, or leave it empty." };
  if (endDate && endDate < date) return { ok: false, error: "The end date cannot be before the start date." };
  const image = url(input?.imageUrl);
  const heroImage = url(input?.heroImage);
  const en = { title: text(input?.data?.en?.title, 160), location: text(input?.data?.en?.location, 160) };
  const ar = { title: text(input?.data?.ar?.title, 160), location: text(input?.data?.ar?.location, 160) };
  if (!en.title) return { ok: false, error: "The English title is required." };
  if (!en.location) return { ok: false, error: "The English location is required." };
  if (status === "published" && !image) return { ok: false, error: "Add a card image before publishing." };
  return { ok: true, value: { status, date, image, data: { en, ar, heroImage, endDate } } };
}
