// Moves the home page client logos (the sliding strip) from Vercel Blob into the website files.
//
//   node scripts/localize-clients.mjs          -> dry run: lists each logo and where it will be saved
//   node scripts/localize-clients.mjs --apply  -> downloads the logos to public/uploads/clients/
//                                                 and switches the links in the database
// Only the client logos are touched. Everything else stays as it is.
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
const sql = neon(process.env.DATABASE_URL);
const DIR = path.join("public", "uploads", "clients");
const BLOB = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;
// While Blob is blocked (403) the logos that are already on the live site can still be fetched
// from the site's own image cache. This is the live site address.
const SITE = (process.env.SITE_URL || "https://ami-ebon-one.vercel.app").replace(/\/$/, "");

async function getLogo(url) {
  const direct = await fetch(url);
  if (direct.ok) return { buf: Buffer.from(await direct.arrayBuffer()), via: "blob" };
  for (const w of [1080, 1920, 828, 640, 384, 256]) {
    const r = await fetch(`${SITE}/_next/image?url=${encodeURIComponent(url)}&w=${w}&q=75`, { headers: { accept: "image/webp,image/*" } });
    if (r.ok && (r.headers.get("content-type") || "").startsWith("image/")) return { buf: Buffer.from(await r.arrayBuffer()), via: "site cache" };
  }
  return null;
}

const rows = await sql`select value from site_content where key = 'media'`;
if (!rows.length) {
  console.log("No saved media settings in the database. The logos already come from the website files (public/images/clients). Nothing to do.");
  process.exit(0);
}
const value = rows[0].value;
const clients = Array.isArray(value.clients) ? value.clients : [];
if (!clients.length) {
  console.log("No client logos saved in the admin. The website uses the built-in logos. Nothing to do.");
  process.exit(0);
}

const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const used = new Set();
const plan = [];
clients.forEach((c, i) => {
  if (!BLOB.test(c?.src || "")) {
    plan.push({ i, from: null, c });
    return;
  }
  const ext = ".webp"; // logos are saved as webp (works for the site cache copy too)
  let base = slug(c.name) || `logo-${i + 1}`;
  let file = base + ext, n = 2;
  while (used.has(file)) file = `${base}-${n++}${ext}`;
  used.add(file);
  plan.push({ i, from: c.src, file, c });
});

console.log(`${clients.length} client logos in the admin, ${plan.filter((p) => p.from).length} of them are on Blob.\n`);
for (const p of plan) console.log(`${String(p.i + 1).padStart(2)}. ${p.c.name || "(no name)"}  ->  ${p.from ? "/uploads/clients/" + p.file : "already in the website files"}`);

if (!APPLY) {
  console.log("\nDry run only. Nothing was downloaded or changed. To do it for real run:  node scripts/localize-clients.mjs --apply");
  process.exit(0);
}

fs.mkdirSync(DIR, { recursive: true });
let bad = 0;
for (const p of plan.filter((x) => x.from)) {
  const dest = path.join(DIR, p.file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) continue;
  const got = await getLogo(p.from);
  if (!got) {
    console.error(`FAILED  ${p.c.name}`);
    bad++;
    continue;
  }
  fs.writeFileSync(dest, got.buf);
  console.log(`ok (${got.via})  ${p.c.name}`);
}
console.log(`\nDownloaded to ${DIR}. Failed: ${bad}`);
if (bad) {
  console.error("Some logos failed, so the database was NOT changed. Run again later.");
  process.exit(1);
}

const next = { ...value, clients: clients.map((c, i) => (plan[i].from ? { ...c, src: "/uploads/clients/" + plan[i].file } : c)) };
await sql`update site_content set value = ${JSON.stringify(next)}::jsonb where key = 'media'`;
console.log("Database updated. Now run:  git add -A  then  git commit -m \"Client logos into the website files\"  then  git push origin main");
