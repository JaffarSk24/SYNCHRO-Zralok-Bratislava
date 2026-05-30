// Downloads post images from Instagram CDN into public/gallery/<code>.jpg
// Selection: all competition-result posts + top-liked posts for the gallery.
import { readFileSync, mkdirSync, existsSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "gallery");
mkdirSync(OUT, { recursive: true });

const posts = JSON.parse(readFileSync(join(__dirname, "data", "posts.json"), "utf8"));
const comps = JSON.parse(readFileSync(join(ROOT, "src", "content", "competitions.json"), "utf8"));
const compCodes = new Set(comps.map((c) => c.permalink?.split("/p/")[1]?.replace("/", "")));

const withImg = posts.filter((p) => p.image);
const topLiked = [...withImg].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 16);
const wanted = new Map();
for (const p of withImg) if (compCodes.has(p.code)) wanted.set(p.code, p);
for (const p of topLiked) wanted.set(p.code, p);

let ok = 0;
const gallery = [];
for (const p of wanted.values()) {
  const file = join(OUT, `${p.code}.jpg`);
  if (!existsSync(file)) {
    try {
      execFileSync("curl", ["-s", "-o", file, p.image, "-H", "User-Agent: Mozilla/5.0"], {
        stdio: "ignore",
      });
    } catch (e) {
      console.warn("fail", p.code);
      continue;
    }
  }
  ok++;
  gallery.push({
    code: p.code,
    src: `/gallery/${p.code}.jpg`,
    date: p.date,
    likes: p.likes,
    caption: (p.caption || "").split("\n")[0].slice(0, 80),
    permalink: p.permalink,
  });
}
gallery.sort((a, b) => (b.likes || 0) - (a.likes || 0));
writeFileSync(join(ROOT, "src", "content", "gallery.json"), JSON.stringify(gallery, null, 2));
console.log(`downloaded/kept ${ok} images -> public/gallery, gallery.json (${gallery.length})`);
