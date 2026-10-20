// Run once from the project root:  node add-youtube.mjs
// Adds the YouTube link fields to the English and Arabic dictionaries so the admin can edit them
// (Site content > WhatsApp button > Youtube Url). Safe to run twice.
import fs from "node:fs";

const add = {
  "lib/dictionaries/en.js": ['    youtubeLabel: "Watch our video on YouTube",', '    youtubeUrl: "https://www.youtube.com/",'],
  "lib/dictionaries/ar.js": ['    youtubeLabel: "شاهد فيديو الشركة على يوتيوب",', '    youtubeUrl: "https://www.youtube.com/",'],
};

for (const [file, lines] of Object.entries(add)) {
  const src = fs.readFileSync(file, "utf8");
  if (src.includes("youtubeUrl")) {
    console.log("already done:", file);
    continue;
  }
  const re = /(\bwhatsapp:\s*\{\r?\n)/;
  if (!re.test(src)) {
    console.log("could not find the whatsapp block in", file);
    continue;
  }
  fs.writeFileSync(file, src.replace(re, `$1${lines.join("\n")}\n`));
  console.log("updated:", file);
}
