// Run once from the project root:  node bigger-logo.mjs
// Makes the logo a little larger in the header, footer and loading screen.
import { readFileSync, writeFileSync } from "node:fs";

const edits = [
  ["components/Header.js", 'className="h-auto w-[170px] xl:w-[calc(233*var(--u))]"', 'className="h-auto w-[200px] xl:w-[calc(276*var(--u))]"'],
  ["components/Footer.js", 'className="h-10 w-auto xl:h-[54px]"', 'className="h-12 w-auto xl:h-[64px]"'],
  ["components/NavigationLoader.js", 'className="w-[160px] h-auto"', 'className="w-[190px] h-auto"'],
];

for (const [file, from, to] of edits) {
  try {
    const src = readFileSync(file, "utf8");
    if (src.includes(to)) { console.log("Already done:", file); continue; }
    if (!src.includes(from)) { console.log("Not found (check by hand):", file); continue; }
    writeFileSync(file, src.replace(from, to));
    console.log("Updated:", file);
  } catch (e) {
    console.log("Skipped:", file, "-", e.message);
  }
}
