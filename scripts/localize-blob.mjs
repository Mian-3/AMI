// Copies every file the website uses from Vercel Blob into public/uploads, sorted into
// folders by page and section, and (with --apply) switches the database links to them.
//
//   node scripts/localize-blob.mjs --only=flavour,fragrance  -> only the Flavours & Fragrances page
//   node scripts/localize-blob.mjs            -> dry run: lists what it found and where each file will go
//   node scripts/localize-blob.mjs --apply    -> downloads the files, then updates the database
//
// Run it only when the Blob store is unblocked (the files must open in the browser).
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
import path from "node:path";

config({ path: ".env.local" });
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing in .env.local");
  process.exit(1);
}

const APPLY = process.argv.includes("--apply");
// --partial: switch only the files that downloaded; the rest keep their Blob link for now.
const PARTIAL = process.argv.includes("--partial");
const SITE = (process.env.SITE_URL || "https://ami-ebon-one.vercel.app").replace(/\/$/, "");

// Blob first. While Blob is blocked (403), files already on the live site come from its image cache (images only).
async function getFile(url) {
  const direct = await fetch(url);
  if (direct.ok) return { buf: Buffer.from(await direct.arrayBuffer()), via: "blob" };
  if (/\.pdf(\?|$)/i.test(url)) return null;
  for (const w of [1080, 1920, 828, 1200, 750, 640, 2048, 384, 256, 128, 96, 64, 48, 32, 16]) {
    const r = await fetch(`${SITE}/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75`, { headers: { accept: "image/webp,image/*" } });
    if (r.ok && (r.headers.get("content-type") || "").startsWith("image/")) return { buf: Buffer.from(await r.arrayBuffer()), via: "site cache" };
  }
  return null;
}
// --only=flavour,fragrance  -> only database rows whose key contains one of these words
// (articles and events are skipped when --only is used)
const ONLY = (process.argv.find((a) => a.startsWith("--only=")) || "").slice(7).toLowerCase().split(",").map((x) => x.trim()).filter(Boolean);
const wanted = (key) => !ONLY.length || ONLY.some((w) => String(key).toLowerCase().includes(w));
const sql = neon(process.env.DATABASE_URL);
const OUT = path.join("public", "uploads");
const BLOB = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s"']+$/i;
const isVideo = (u) => /\.(mp4|webm|mov)(\?|$)/i.test(u);

const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "misc";
const urls = new Map(); // url -> "folder/file.ext" (relative to public/uploads)
const used = new Set();

function cleanName(url) {
  let raw = decodeURIComponent(new URL(url).pathname.split("/").pop() || "file");
  const ext = path.extname(raw);
  let base = path.basename(raw, ext);
  base = base.replace(/-[A-Za-z0-9]{24,40}$/, ""); // random suffix Vercel adds to long names
  base = base.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "file";
  return { base, ext: ext.toLowerCase() };
}

function register(url, folder) {
  if (urls.has(url)) return urls.get(url);
  const { base, ext } = cleanName(url);
  let rel = `${folder}/${base}${ext}`;
  let i = 2;
  while (used.has(rel.toLowerCase())) rel = `${folder}/${base}-${i++}${ext}`;
  used.add(rel.toLowerCase());
  urls.set(url, rel);
  return rel;
}

// Folder from the place in the database: "home.stats" -> home/stats, media settings -> media/<group>
function folderFor(table, key, trail) {
  if (table === "site_content") {
    const parts = String(key).split(".").map(slug);
    if (/flavour|fragrance/i.test(String(key))) return "flavours-fragrances/" + slug(trail.filter((t) => !/^\d+$/.test(t))[0] || "misc");
    if (key === "media") return ["media", slug(trail[0] || "misc")].join("/");
    return parts.slice(0, 2).join("/");
  }
  if (table === "posts") return "insights/" + slug(key);
  if (table === "events") return "events/" + slug(key);
  return "misc";
}

function walk(v, fn, trail = []) {
  if (typeof v === "string") return BLOB.test(v) && !isVideo(v) ? fn(v, trail) : v;
  if (Array.isArray(v)) return v.map((x, i) => walk(x, fn, [...trail, String(i)]));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x, fn, [...trail, k])]));
  return v;
}

const changes = [];
const content = await sql`select key, value from site_content`;
const posts = await sql`select id, slug, image_url, data from posts`;
const events = await sql`select id, slug, image_url, data from events`;

for (const r of content) {
  if (!wanted(r.key)) continue;
  const next = walk(r.value, (u, trail) => "/uploads/" + register(u, folderFor("site_content", r.key, trail)));
  if (JSON.stringify(next) !== JSON.stringify(r.value)) changes.push({ t: "site_content", id: r.key, next });
}
for (const [t, rows] of ONLY.length ? [] : [["posts", posts], ["events", events]]) {
  for (const r of rows) {
    const f = folderFor(t, r.slug);
    const img = BLOB.test(r.image_url || "") && !isVideo(r.image_url) ? "/uploads/" + register(r.image_url, f) : r.image_url;
    const data = walk(r.data, (u) => "/uploads/" + register(u, f));
    if (img !== r.image_url || JSON.stringify(data) !== JSON.stringify(r.data)) changes.push({ t, id: r.id, img, data });
  }
}

console.log(`Found ${urls.size} files used by the website, in ${changes.length} database rows.\n`);
const byFolder = {};
for (const rel of urls.values()) (byFolder[path.dirname(rel)] ||= []).push(path.basename(rel));
for (const f of Object.keys(byFolder).sort()) {
  console.log(`public/uploads/${f}/  (${byFolder[f].length})`);
  for (const n of byFolder[f]) console.log(`   ${n}`);
}

if (!APPLY) {
  console.log("\nDry run only. Nothing was downloaded or changed. To do it for real run:  node scripts/localize-blob.mjs --apply");
  process.exit(0);
}

let bad = 0;
const ok = new Set();
for (const [u, rel] of urls) {
  const dest = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    ok.add(u);
    continue;
  }
  const got = await getFile(u);
  if (!got) {
    console.error(`FAILED  ${rel}`);
    bad++;
    continue;
  }
  fs.writeFileSync(dest, got.buf);
  ok.add(u);
  console.log(`ok (${got.via})  ${rel}`);
}
console.log(`\nDownloaded to ${OUT}. Failed: ${bad}`);
if (bad && !PARTIAL) {
  console.error("Some files failed, so the database was NOT changed. Run again after the store is unblocked, or use --apply --partial to switch only the files that worked.");
  process.exit(1);
}

// Switch only the files that are saved in the website files.
const local = (u) => (ok.has(u) ? "/uploads/" + urls.get(u) : u);
let updated = 0;
for (const c of changes) {
  if (c.t === "site_content") {
    const row = content.find((r) => r.key === c.id);
    await sql`update site_content set value = ${JSON.stringify(walk(row.value, local))}::jsonb where key = ${c.id}`;
  } else {
    const row = (c.t === "posts" ? posts : events).find((r) => r.id === c.id);
    const img = BLOB.test(row.image_url || "") && !isVideo(row.image_url) ? local(row.image_url) : row.image_url;
    const data = walk(row.data, local);
    if (c.t === "posts") await sql`update posts set image_url = ${img}, data = ${JSON.stringify(data)}::jsonb where id = ${c.id}`;
    else await sql`update events set image_url = ${img}, data = ${JSON.stringify(data)}::jsonb where id = ${c.id}`;
  }
  updated++;
}
console.log(`Database updated (${updated} rows). Now run: git add -A, git commit, git push origin main`);
