import type { APIRoute } from "astro";
import {
  club, medals, events, competitions, coaches, faq, locations, t,
  SITE_URL, ALT_URL, LOCALE,
} from "../i18n";

// Full AI/LLM context file. Per-locale: language + domain stay correct on .sk vs .com.
export const GET: APIRoute = () => {
  const isEn = LOCALE === "en";
  const camp = events.camps;
  const g = medals.groups as Record<string, { gold: number; silver: number; bronze: number; total: number }>;
  const lb = medals.levelBased;
  const ct = medals.clubTotal;

  const fmtDate = (d: string) => {
    if (!d) return "";
    const [y, m] = d.split("-").map(Number);
    return `${t.months[m - 1]} ${y}`;
  };
  const loc = (l?: string) => (l && locations[l] ? `${locations[l].flag} ${locations[l].label}` : "");
  const medalStr = (m: { gold: number; silver: number; bronze: number }) => {
    const parts: string[] = [];
    if (m.gold) parts.push(`${m.gold}🥇`);
    if (m.silver) parts.push(`${m.silver}🥈`);
    if (m.bronze) parts.push(`${m.bronze}🥉`);
    return parts.join(" ");
  };

  // competitions with at least one medal, newest first (already sorted desc)
  const comps = competitions
    .filter((c: any) => c.medals && c.medals.total > 0)
    .map((c: any) => {
      const meta = [fmtDate(c.date), loc(c.location)].filter(Boolean).join(", ");
      return `- **${c.title}**${meta ? ` (${meta})` : ""} — ${medalStr(c.medals)}`;
    })
    .join("\n");

  const faqBlock = faq
    .map((item: any) => {
      const a = String(item.a).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      return `### ${item.q}\n${a}`;
    })
    .join("\n\n");

  const sessions = camp.sessions.map((s: any) => `- ${s.dates}`).join("\n");

  const body = isEn
    ? `# ${club.name} — Full overview

## About the club

${club.intro}

The club was founded in 2004 in Bratislava. Training takes place at Plavecká Akadémia in Devínska Nová Ves and at IUVENTA in Karlova Ves. Synchronised (artistic) swimming combines swimming, gymnastics, dance and music. Girls can join from age 5 with no prior experience.

**Head coach:** Martina Nela (@martina.nela on Instagram)
**Contact:** ${club.instagramHandle} on Instagram
**Training location:** Devínska Nová Ves & Karlova Ves, Bratislava, Slovakia

## Age categories

- U8 — up to 8 years (youngest sharks)
- U10 — up to 10 years
- U12 — up to 12 years
- U15 — up to 15 years (Youth / Junior)

## Disciplines

${club.disciplines.map((d) => `- ${d}`).join("\n")}

## Medal tally (all seasons, source: Instagram)

| Category | 🥇 Gold | 🥈 Silver | 🥉 Bronze | Total |
|----------|---------|-----------|-----------|-------|
| U8 | ${g.U8.gold} | ${g.U8.silver} | ${g.U8.bronze} | ${g.U8.total} |
| U10 | ${g.U10.gold} | ${g.U10.silver} | ${g.U10.bronze} | ${g.U10.total} |
| U12 | ${g.U12.gold} | ${g.U12.silver} | ${g.U12.bronze} | ${g.U12.total} |
| U15 (Youth/Junior) | ${g.U15.gold} | ${g.U15.silver} | ${g.U15.bronze} | ${g.U15.total} |
| Level 2/3 | ${lb.gold} | ${lb.silver} | ${lb.bronze} | ${lb.total} |
| **CLUB TOTAL** | **${ct.gold}** | **${ct.silver}** | **${ct.bronze}** | **${ct.total}** |

## Competitions (with medals)

${comps}

Competitions take place in Slovakia 🇸🇰, Hungary 🇭🇺 and Czechia 🇨🇿.

## Summer camps 2026 — ${camp.title}

**For:** ${camp.audience}
**Place:** ${camp.location}
**Schedule:** ${camp.schedule}
**Price:** ${camp.price} ${camp.priceNote}

**Sessions:**
${sessions}

**Sign-up:** ${camp.ctaUrl}

## Frequently asked questions

${faqBlock}

## Social media

- Instagram: ${club.instagram}

## Website

- URL: ${SITE_URL}
- Language: English (Slovak version: ${ALT_URL})
- Built by: White Eagles & Co. (https://whiteeagles.sk)
`
    : `# ${club.name} — Kompletný prehľad

## O klube

${club.intro}

Klub bol založený v roku 2004 v Bratislave. Tréningy prebiehajú v Plaveckej Akadémii v Devínskej Novej Vsi a v IUVENTE v Karlovej Vsi. Synchronizované (artistické) plávanie spája plávanie, gymnastiku, tanec a hudbu. Dievčatá môžu nastúpiť od 5 rokov, aj bez predchádzajúcich skúseností.

**Hlavný tréner:** Martina Nela (@martina.nela na Instagrame)
**Kontakt:** ${club.instagramHandle} na Instagrame
**Miesto tréningov:** Devínska Nová Ves a Karlova Ves, Bratislava, Slovensko

## Vekové kategórie

- U8 — do 8 rokov (najmladšie žralokyne)
- U10 — do 10 rokov
- U12 — do 12 rokov
- U15 — do 15 rokov (Youth / Junior)

## Disciplíny

${club.disciplines.map((d) => `- ${d}`).join("\n")}

## Medailová bilancia (všetky sezóny, zdroj: Instagram)

| Kategória | 🥇 Zlato | 🥈 Striebro | 🥉 Bronz | Spolu |
|-----------|---------|------------|---------|-------|
| U8 | ${g.U8.gold} | ${g.U8.silver} | ${g.U8.bronze} | ${g.U8.total} |
| U10 | ${g.U10.gold} | ${g.U10.silver} | ${g.U10.bronze} | ${g.U10.total} |
| U12 | ${g.U12.gold} | ${g.U12.silver} | ${g.U12.bronze} | ${g.U12.total} |
| U15 (Youth/Junior) | ${g.U15.gold} | ${g.U15.silver} | ${g.U15.bronze} | ${g.U15.total} |
| Level 2/3 | ${lb.gold} | ${lb.silver} | ${lb.bronze} | ${lb.total} |
| **KLUB CELKOM** | **${ct.gold}** | **${ct.silver}** | **${ct.bronze}** | **${ct.total}** |

## Súťaže (s medailami)

${comps}

Súťaží sa na Slovensku 🇸🇰, v Maďarsku 🇭🇺 a v Česku 🇨🇿.

## Letné kempy 2026 — ${camp.title}

**Pre:** ${camp.audience}
**Miesto:** ${camp.location}
**Program:** ${camp.schedule}
**Cena:** ${camp.price} ${camp.priceNote}

**Termíny:**
${sessions}

**Prihlásenie:** ${camp.ctaUrl}

## Časté otázky

${faqBlock}

## Sociálne siete

- Instagram: ${club.instagram}

## Web

- URL: ${SITE_URL}
- Jazyk: slovenčina (anglická verzia: ${ALT_URL})
- Vytvoril: White Eagles & Co. (https://whiteeagles.sk)
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
