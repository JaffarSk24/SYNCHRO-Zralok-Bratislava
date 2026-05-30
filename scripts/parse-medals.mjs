// Parses scripts/data/posts.json captions into structured medal tallies and a
// competition timeline. Output: src/content/medals.json, src/content/competitions.json
//
// Group mapping (per project decision): U8, U10, U12, U16 (Youth/Junior -> U16).
// Performance-level results (LEVEL 2/3, "L3") aren't age-bound -> counted only in club total.
// Decorative medal emojis in title lines (flags + no discipline word) are ignored.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const posts = JSON.parse(
  readFileSync(join(__dirname, "data", "posts.json"), "utf8")
);

const G = "🥇", S = "🥈", B = "🥉";
const DISC = [
  "figúr", "figur", "figure", "sólo", "solo", "duo", "duet", "duett",
  "tím", "tim", "team", "combo", "combination", "element", "acro", "povinné", "povinne",
];

function mapGroup(label) {
  const l = label.toLowerCase().replace(/\s+/g, "");
  if (l.includes("u8") || l.includes("8u")) return "U8";
  if (l.includes("u10") || l.includes("10u")) return "U10";
  if (l.includes("u12") || l.includes("12u") || l.includes("12&under") || l.includes("12under")) return "U12";
  if (l.includes("u15") || l.includes("15u") || l.includes("u16") || l.includes("youth") || l.includes("junior")) return "U16";
  if (l === "mž" || l === "mz") return "U12"; // mladšie žiačky ≈ U12
  return null; // LEVEL/L3 -> not age-bound
}

function countLineMedals(line) {
  let g = 0, s = 0, b = 0;
  const mult = new RegExp(`(\\d+)\\s*x\\s*(${G}|${S}|${B})`, "g");
  let m;
  while ((m = mult.exec(line))) {
    const n = parseInt(m[1], 10);
    if (m[2] === G) g += n; else if (m[2] === S) s += n; else b += n;
  }
  const rest = line.replace(new RegExp(`\\d+\\s*x\\s*(${G}|${S}|${B})`, "g"), "");
  g += (rest.match(new RegExp(G, "g")) || []).length;
  s += (rest.match(new RegExp(S, "g")) || []).length;
  b += (rest.match(new RegExp(B, "g")) || []).length;
  return [g, s, b];
}

const groups = { U8: [0, 0, 0], U10: [0, 0, 0], U12: [0, 0, 0], U16: [0, 0, 0] };
const levelMedals = [0, 0, 0]; // performance-level, not age-bound
const groupRe = /(U\s?\d{1,2}|\d{1,2}\s?U|\d{1,2}\s?&?\s?under|MŽ|Youth|Junior|LEVEL\s?\d|L\d)/gi;

for (const p of posts) {
  const cap = p.caption || "";
  if (![G, S, B].some((x) => cap.includes(x))) continue;
  const lines = cap.split("\n");
  let current = null;
  lines.forEach((line, i) => {
    const toks = line.match(groupRe);
    if (toks) current = mapGroup(toks[toks.length - 1]);
    const [g, s, b] = countLineMedals(line);
    if (g + s + b === 0) return;
    const hasDisc = DISC.some((k) => line.toLowerCase().includes(k));
    const isTitle = (i === 0 || /[🇸🇰🇭🇺🇨🇿🏆🏅💦]/u.test(line)) && !hasDisc;
    if (isTitle) return; // decorative
    const tgt = current && groups[current] ? groups[current] : levelMedals;
    tgt[0] += g; tgt[1] += s; tgt[2] += b;
  });
}

const toObj = ([gold, silver, bronze]) => ({ gold, silver, bronze, total: gold + silver + bronze });
const clubTotal = [0, 0, 0];
for (const k of Object.keys(groups)) for (let j = 0; j < 3; j++) clubTotal[j] += groups[k][j];
for (let j = 0; j < 3; j++) clubTotal[j] += levelMedals[j];

const medals = {
  groups: Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, toObj(v)])),
  levelBased: toObj(levelMedals),
  clubTotal: toObj(clubTotal),
  note: "Agregované z výsledkov uverejnených na Instagrame klubu.",
};

mkdirSync(join(ROOT, "src", "content"), { recursive: true });
writeFileSync(join(ROOT, "src", "content", "medals.json"), JSON.stringify(medals, null, 2));
console.log("medals.json:", JSON.stringify(medals.groups), "| total", JSON.stringify(medals.clubTotal));

// ---- Competitions timeline ----------------------------------------------
const FLAG = { "🇸🇰": "Slovensko", "🇭🇺": "Maďarsko", "🇨🇿": "Česko" };
const COMP_KEYS = ["majstrovstvá", "championship", "cup", "kemp", "súťaž", "sutaz",
  "orca", "synchrostars", "memoriál", "memorial", "rybka", "kaprík", "open", "championships"];

function cleanTitle(line) {
  return line
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}️]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}
function locationOf(cap, title) {
  for (const [flag, name] of Object.entries(FLAG)) if (cap.includes(flag)) return name;
  const t = (title || "").toLowerCase();
  if (/(slovensk|slovak|\bsr\b|synchrostars|goldfish|zlatá rybka)/.test(t)) return "Slovensko";
  if (/(hungar|budape|orca|orka|maďar)/.test(t)) return "Maďarsko";
  if (/(olomouc|česk|czech|memoriál míly)/.test(t)) return "Česko";
  return null;
}

const competitions = [];
for (const p of posts) {
  const cap = p.caption || "";
  const first = cap.split("\n")[0] || "";
  const hasMedal = [G, S, B].some((x) => cap.includes(x));
  const looksComp = COMP_KEYS.some((k) => first.toLowerCase().includes(k));
  if (!hasMedal && !looksComp) continue;
  // total medal tally for the whole post (incl. decorative -> stripped: count only result lines)
  let g = 0, s = 0, b = 0;
  cap.split("\n").forEach((line, i) => {
    const [lg, ls, lb] = countLineMedals(line);
    if (lg + ls + lb === 0) return;
    const hasDisc = DISC.some((k) => line.toLowerCase().includes(k));
    const isTitle = (i === 0 || /[🇸🇰🇭🇺🇨🇿🏆🏅💦]/u.test(line)) && !hasDisc;
    if (isTitle) return;
    g += lg; s += ls; b += lb;
  });
  const title = cleanTitle(first);
  competitions.push({
    date: p.date,
    title,
    location: locationOf(cap, title),
    medals: { gold: g, silver: s, bronze: b, total: g + s + b },
    image: p.image ? `/gallery/${p.code}.jpg` : null,
    permalink: p.permalink,
  });
}
// keep only events with an actual medal result, newest first
const results = competitions
  .filter((c) => c.medals.total > 0)
  .sort((a, b) => (a.date < b.date ? 1 : -1));
writeFileSync(join(ROOT, "src", "content", "competitions.json"), JSON.stringify(results, null, 2));
console.log("competitions.json:", results.length, "events with results");
