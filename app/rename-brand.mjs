// Run from the project root:  node rename-brand.mjs
// Changes the brand name text "AM International" to "A.M International" (and AM INTERNATIONAL to A.M INTERNATIONAL)
// in source files only. File names, package name, email and website addresses are not touched.
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXT = new Set([".js", ".jsx", ".mjs", ".json", ".md", ".html", ".css"]);
const RULES = [
  [/\bAM International\b/g, "A.M International"],
  [/\bAM INTERNATIONAL\b/g, "A.M INTERNATIONAL"],
];

let files = 0;
let hits = 0;

function walk(dir) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name === "node_modules" || name.name === ".next") continue;
    const full = path.join(dir, name.name);
    if (name.isDirectory()) walk(full);
    else if (EXT.has(path.extname(name.name))) fix(full);
  }
}

function fix(file) {
  const before = fs.readFileSync(file, "utf8");
  let after = before;
  let n = 0;
  for (const [re, to] of RULES) {
    after = after.replace(re, () => {
      n++;
      return to;
    });
  }
  if (n) {
    fs.writeFileSync(file, after);
    files++;
    hits += n;
    console.log(`${String(n).padStart(3)}  ${file}`);
  }
}

for (const r of ROOTS) if (fs.existsSync(r)) walk(r);
console.log(`\nDone: ${hits} replacements in ${files} files.`);
