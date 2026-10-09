import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing in .env.local");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const rows = await sql`select now() as now`;
console.log("Connected to Neon. Server time:", rows[0].now);