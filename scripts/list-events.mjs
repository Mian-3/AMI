// Lists the events in the database with ready-to-paste lines for lib/eventImages.js
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
config({ path: ".env.local" });
if (!process.env.DATABASE_URL) { console.error("DATABASE_URL is missing in .env.local"); process.exit(1); }
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`select slug, status, event_date, data from events order by event_date, sort_order`;
if (!rows.length) { console.log("No events in the database yet (the website shows the starter events)."); process.exit(0); }
console.log("Event list:\n");
for (const r of rows) console.log(`${String(r.event_date).slice(0, 10)}  [${r.status}]  ${r.data?.en?.title || ""}  ->  ${r.slug}`);
console.log("\nPaste these lines inside EVENT_IMAGES in lib/eventImages.js, then put each photo in public/images/events/ with the same file name:\n");
for (const r of rows) console.log(`  "${r.slug}": "/images/events/${r.slug}.jpg",`);
