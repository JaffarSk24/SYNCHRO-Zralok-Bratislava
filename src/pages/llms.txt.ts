import type { APIRoute } from "astro";
import { club, medals, events, SITE_URL, ALT_URL, LOCALE } from "../i18n";

// AI/LLM discovery file (llms.txt standard). Per-locale: correct language + domain.
export const GET: APIRoute = () => {
  const isEn = LOCALE === "en";
  const ct = medals.clubTotal;
  const camp = events.camps;
  const body = isEn
    ? `# ${club.name}

> A synchronised (artistic) swimming club for children in Bratislava.

${club.intro}

## Website sections

- [About the club](${SITE_URL}/#o-klube): What artistic swimming is, age categories U8–U15, disciplines
- [Achievements](${SITE_URL}/#tituly): Medal tally — ${ct.gold} gold, ${ct.silver} silver, ${ct.bronze} bronze
- [Competitions](${SITE_URL}/#sutaze): Results from the 2025/26 season
- [Summer camps](${SITE_URL}/#kempy): ${camp.title}, Devínska Nová Ves, July–August 2026, ${camp.price}${camp.priceNote}
- [Gallery](${SITE_URL}/#galeria): Photos from training and competitions
- [FAQ](${SITE_URL}/#faq): Age, swimming ability, training, joining, camps, funding
- [Contact](${SITE_URL}/#kontakt): Joining the club via Instagram

## Key facts

- Club: ${club.name}
- Sport: Synchronised (artistic) swimming for children
- Minimum age: 5 years (no prior experience needed)
- Age categories: U8, U10, U12, U15
- Location: Bratislava, Devínska Nová Ves, Slovakia
- Instagram: ${club.instagramHandle}
- Head coach: Martina Nela (@martina.nela)
- 2025/26 season: ${ct.total} medals in total
- Site language: English — Slovak version at ${ALT_URL}
`
    : `# ${club.name}

> Klub synchronizovaného (artistického) plávania pre deti v Bratislave.

${club.intro}

## Sekcie webu

- [O klube](${SITE_URL}/#o-klube): Čo je synchronizované plávanie, vekové kategórie U8–U15, disciplíny
- [Naše tituly](${SITE_URL}/#tituly): Medailová bilancia — ${ct.gold} zlatých, ${ct.silver} strieborných, ${ct.bronze} bronzových
- [Súťaže](${SITE_URL}/#sutaze): Výsledky zo sezóny 2025/26
- [Letné kempy](${SITE_URL}/#kempy): ${camp.title}, Devínska Nová Ves, júl–august 2026, ${camp.price}${camp.priceNote}
- [Galéria](${SITE_URL}/#galeria): Fotky z tréningov a súťaží
- [Časté otázky](${SITE_URL}/#faq): Vek, plávanie, tréningy, prihlásenie, kempy, financovanie
- [Kontakt](${SITE_URL}/#kontakt): Prihlásenie do klubu cez Instagram

## Kľúčové fakty

- Klub: ${club.name}
- Šport: Synchronizované (artistické) plávanie pre deti
- Minimálny vek: 5 rokov (bez predchádzajúcich skúseností)
- Kategórie: U8, U10, U12, U15
- Lokalita: Bratislava, Devínska Nová Ves, Slovensko
- Instagram: ${club.instagramHandle}
- Hlavný tréner: Martina Nela (@martina.nela)
- Sezóna 2025/26: ${ct.total} medailí celkom
- Jazyk webu: slovenčina — anglická verzia na ${ALT_URL}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
