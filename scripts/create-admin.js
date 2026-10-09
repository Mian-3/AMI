import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing in .env.local");
  process.exit(1);
}

const rl = readline.createInterface({ input, output });
const email = (await rl.question("Admin email: ")).trim().toLowerCase();
const name = (await rl.question("Name: ")).trim();
const password = await rl.question("Password (min 10 characters): ");
rl.close();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("That email does not look valid.");
  process.exit(1);
}
if (password.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const sql = neon(process.env.DATABASE_URL);

await sql`
  insert into admin_users (email, name, password_hash, role)
  values (${email}, ${name}, ${hash}, 'admin')
  on conflict (email) do update
  set password_hash = excluded.password_hash, name = excluded.name
`;

console.log("Admin saved:", email);
