// Run once from the project root:  node apply-logo.mjs
// Points every logo <Image> at the new client logo (PNG, 1600 x 429). Safe to run twice.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OLD = "/images/logo/am-international-logo.svg";
const NEW = "/images/logo/am-international-logo.png";
const roots = ["components", "app"];
const changed = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(js|jsx|mjs)$/.test(name)) fix(p);
  }
}

function fix(file) {
  const src = readFileSync(file, "utf8");
  if (!src.includes(OLD)) return;
  const out = src.replace(/<Image[\s\S]*?\/>/g, (tag) => {
    if (!tag.includes(OLD)) return tag;
    return tag
      .replaceAll(OLD, NEW)
      .replace(/width=\{1184\}/, "width={1600}")
      .replace(/height=\{329\}/, "height={429}");
  });
  if (out !== src) {
    writeFileSync(file, out);
    changed.push(file);
  }
}

for (const r of roots) {
  try { walk(r); } catch { /* folder missing */ }
}
console.log(changed.length ? "Updated:\n- " + changed.join("\n- ") : "Nothing to change (already done).");
