// One time clean up of the images already inside /public/images.
// Same file names and formats (so no code changes), same look, smaller files.
//
//   node scripts/optimize-images.mjs            shows what would be saved (changes nothing)
//   node scripts/optimize-images.mjs --write    rewrites the smaller versions
//
// Commit your work in git first, so you can undo with "git checkout public".

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");
const WRITE = process.argv.includes("--write");
const MAX_SIDE = 2400;
const MIN_GAIN = 0.05; // only rewrite when at least 5 percent smaller

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
let before = 0;
let after = 0;
let changed = 0;

for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

  const input = await fs.readFile(file);
  let img = sharp(input, { failOn: "none" }).rotate();
  const meta = await img.metadata();
  if (Math.max(meta.width || 0, meta.height || 0) > MAX_SIDE) {
    img = img.resize({ width: meta.width >= meta.height ? MAX_SIDE : undefined, height: meta.height > meta.width ? MAX_SIDE : undefined });
  }

  let output;
  if (ext === ".png") output = await img.png({ compressionLevel: 9, effort: 10 }).toBuffer();
  else if (ext === ".webp") output = await img.webp({ quality: 82, effort: 5 }).toBuffer();
  else output = await img.jpeg({ quality: 82, mozjpeg: true }).toBuffer();

  before += input.length;
  const better = output.length < input.length * (1 - MIN_GAIN);
  after += better ? output.length : input.length;
  if (!better) continue;

  changed += 1;
  console.log(`${path.relative(process.cwd(), file)}  ${kb(input.length)} -> ${kb(output.length)}`);
  if (WRITE) await fs.writeFile(file, output);
}

console.log(`\n${changed} files ${WRITE ? "rewritten" : "can be reduced"}. Total ${kb(before)} -> ${kb(after)} (${(100 - (after / (before || 1)) * 100).toFixed(0)}% smaller).`);
if (!WRITE) console.log("Nothing was changed. Run again with --write to apply.");
