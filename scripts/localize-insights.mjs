// Moves the Insights article images (home page Insights section, Insights page and every article)
// from Vercel Blob into the website files.
//
//   node scripts/localize-insights.mjs          -> dry run: lists each image and where it will be saved
//   node scripts/localize-insights.mjs --apply  -> downloads to public/uploads/insights/<article>/ and
//                                                  switches the links in the database
// Only the articles are touched. Everything else stays as it is.
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
// --partial: update the database only for the images that downloaded; the rest keep their Blob link for now.
const PARTIAL = process.argv.includes("--partial");
const sql = neon(process.env.DATABASE_URL);
const OUT = path.join("public", "uploads", "insights");
const BLOB = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s"']+$/i;
const SITE = (process.env.SITE_URL || "https://ami-ebon-one.vercel.app").replace(/\/$/, "");
const isVideo = (u) => /\.(mp4|webm|mov)(\?|$)/i.test(u);
const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "article";

// Blob first. While Blob is blocked (403), the images already on the live site are taken from its image cache.
async function getImage(url) {
  const direct = await fetch(url);
  if (direct.ok) return { buf: Buffer.from(await direct.arrayBuffer()), via: "blob" };
  for (const w of [1080, 1920, 828, 1200, 750, 640, 2048, 384, 256, 128, 96, 64, 48, 32, 16]) {
    const r = await fetch(`${SITE}/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75`, { headers: { accept: "image/webp,image/*" } });
    if (r.ok && (r.headers.get("content-type") || "").startsWith("image/")) return { buf: Buffer.from(await r.arrayBuffer()), via: "site cache" };
  }
  return null;
}

const urls = new Map(); // url -> "article/file.webp"
const counters = {};
function register(url, articleSlug, isCover) {
  if (urls.has(url)) return urls.get(url);
  const n = (counters[articleSlug] = (counters[articleSlug] || 0) + 1);
  const rel = `${articleSlug}/${isCover && n === 1 ? "cover" : "image-" + n}.webp`;
  urls.set(url, rel);
  return rel;
}

function walk(v, fn) {
  if (typeof v === "string") return BLOB.test(v) && !isVideo(v) ? fn(v) : v;
  if (Array.isArray(v)) return v.map((x) => walk(x, fn));
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x, fn)]));
  return v;
}

const posts = await sql`select id, slug, image_url, data from posts order by id`;
const changes = [];
for (const r of posts) {
  const s = slug(r.slug);
  const img = BLOB.test(r.image_url || "") && !isVideo(r.image_url) ? "/uploads/insights/" + register(r.image_url, s, true) : r.image_url;
  const data = walk(r.data, (u) => "/uploads/insights/" + register(u, s, false));
  if (img !== r.image_url || JSON.stringify(data) !== JSON.stringify(r.data)) changes.push({ id: r.id, img, data });
}

console.log(`${posts.length} articles, ${urls.size} images on Blob, in ${changes.length} articles.\n`);
for (const [u, rel] of urls) console.log(`/uploads/insights/${rel}`);
if (!urls.size) {
  console.log("Nothing to move. The articles already use the website files.");
  process.exit(0);
}
if (!APPLY) {
  console.log("\nDry run only. Nothing was downloaded or changed. To do it for real run:  node scripts/localize-insights.mjs --apply");
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
  const got = await getImage(u);
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
  console.error("Some images failed, so the database was NOT changed. Run again later, or use --apply --partial to switch only the images that worked.");
  process.exit(1);
}
// Switch only the images that are saved in the website files.
const local = (u) => (ok.has(u) ? "/uploads/insights/" + urls.get(u) : u);
let updated = 0;
for (const r of posts) {
  const img = BLOB.test(r.image_url || "") && !isVideo(r.image_url) ? local(r.image_url) : r.image_url;
  const data = walk(r.data, local);
  if (img !== r.image_url || JSON.stringify(data) !== JSON.stringify(r.data)) {
    await sql`update posts set image_url = ${img}, data = ${JSON.stringify(data)}::jsonb where id = ${r.id}`;
    updated++;
  }
}
changes.length = updated;
console.log(`Database updated (${changes.length} articles). Now run: git add -A, then git commit -m "Insights images into the website files", then git push origin main`);
