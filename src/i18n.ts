// Bilingual core. PUBLIC_LOCALE=en builds the English (.com) site; default = Slovak (.sk).
import skClub from "./content/club.json";
import enClub from "./content/en/club.json";
import skFaq from "./content/faq.json";
import enFaq from "./content/en/faq.json";
import skEvents from "./content/events.json";
import enEvents from "./content/en/events.json";
import skCoaches from "./content/coaches.json";
import enCoaches from "./content/en/coaches.json";
import medalsData from "./content/medals.json";
import galleryData from "./content/gallery.json";
import competitionsRaw from "./content/competitions.json";
import sustredeniaRaw from "./content/sustredenia.json";

export type Locale = "sk" | "en";
export const LOCALE: Locale = import.meta.env.PUBLIC_LOCALE === "en" ? "en" : "sk";
const en = LOCALE === "en";

export const SITE_URL = en ? "https://synchrozralok.com" : "https://synchrozralok.sk";
export const ALT_URL = en ? "https://synchrozralok.sk" : "https://synchrozralok.com";
export const OG_LOCALE = en ? "en_GB" : "sk_SK";
export const HTML_LANG = en ? "en" : "sk";
// GA4 — separate property per locale/domain
export const GA_ID = en ? "G-28K9J0T5EL" : "G-LKVF753T86";
// Seznam Webmaster (CZ) verification — per domain (empty = no tag rendered)
export const SEZNAM_WMT = en ? "s1CJEMYe1yaBzCvlKQIdEnCZSKAJSOSw" : "ZPUK05FT23dhVlvV1hw3xwhyubbhxjNn";

// --- content selection ---
export const club = (en ? enClub : skClub) as typeof skClub;
export const faq = (en ? enFaq : skFaq) as typeof skFaq;
export const events = (en ? enEvents : skEvents) as typeof skEvents;
export const coaches = (en ? enCoaches : skCoaches) as typeof skCoaches;
export const medals = medalsData;
export const gallery = galleryData;
export const competitions = competitionsRaw.map((c: any) => ({ ...c, title: en && c.title_en ? c.title_en : c.title }));
export const sustredenia = sustredeniaRaw.map((s: any) => ({ ...s, title: en && s.title_en ? s.title_en : s.title }));

// localized competition locations (key = data value, which stays Slovak)
const locationsSk: Record<string, { flag: string; label: string }> = {
  Slovensko: { flag: "🇸🇰", label: "Slovensko" },
  Maďarsko: { flag: "🇭🇺", label: "Maďarsko" },
  Česko: { flag: "🇨🇿", label: "Česko" },
};
const locationsEn: Record<string, { flag: string; label: string }> = {
  Slovensko: { flag: "🇸🇰", label: "Slovakia" },
  Maďarsko: { flag: "🇭🇺", label: "Hungary" },
  Česko: { flag: "🇨🇿", label: "Czechia" },
};
export const locations = en ? locationsEn : locationsSk;

const dict = {
  sk: {
    nav: { gallery: "Galéria", nabor: "Nábor", camps: "Kempy", about: "O klube", titles: "Tituly", faq: "FAQ", contact: "Kontakt", member: "Členská sekcia" },
    months: ["jan", "feb", "mar", "apr", "máj", "jún", "júl", "aug", "sep", "okt", "nov", "dec"],
    medalWords: { gold: "zlato", silver: "striebro", bronze: "bronz" },
    hero: {
      l1: "Synchronizované", l2: "plávanie pre", l3: "malé deti",
      ctaJoin: "Staň sa akvabelkou", ctaAch: "Naše úspechy →",
      gold: "zlatých", silver: "strieborných", bronze: "bronzových medailí",
    },
    about: {
      eyebrow: "O klube",
      h2: "Plávanie, gymnastika, tanec a&nbsp;hudba v&nbsp;jednom",
      p1: "Synchronizované plávanie je viac než šport – je to elegancia, sila a tímová súhra v jednom. Dievčatá sa učia ovládať svoje telo vo vode, vnímať hudbu, spolupracovať a budovať vzájomnú dôveru – hodnoty, ktoré využijú nielen v športe, ale aj v živote.",
      startInfo: "Začať s nami môžu dievčatá už od 5 rokov – od úplných začiatočníčok až po pretekárky reprezentujúce klub v zahraničí.",
      disciplinesH: "Disciplíny, v ktorých súťažíme",
      note: "Synchronizované (artistické) plávanie rozvíja silu, ohybnosť, hudobné cítenie aj tímovú spoluprácu – a&nbsp;predovšetkým prináša deťom radosť z&nbsp;vody.",
    },
    titles: {
      eyebrow: "Naše tituly", h2: "Medailová bilancia podľa kategórií",
      intro: "Prehľad medailí, ktoré naše dievčatá vybojovali na domácich aj medzinárodných súťažiach – rozdelený podľa vekových kategórií.",
      clubTotal: "Spolu pre klub", medals: "medailí", total: "Spolu",
      groupMeta: {
        U8: { age: "do 8 rokov", note: "dievčatá do 8 rokov" },
        U10: { age: "do 10 rokov", note: "dievčatá do 10 rokov" },
        U12: { age: "do 12 rokov", note: "mladšie žiačky" },
        U15: { age: "do 15 rokov", note: "staršie žiačky" },
      } as Record<string, { age: string; note: string }>,
      levelIntro: "Okrem toho dievčatá získali ďalšie medaily vo výkonnostných úrovniach (Level 2/3):",
      note: "Agregované z výsledkov uverejnených na Instagrame klubu.",
    },
    champions: {
      eyebrow: "Majsterky Slovenska 2026",
      h2pre: "U12 – zlato vo", h2hl: "všetkých disciplínach",
      pHtml: "Obrovská gratulácia našim <strong class=\"text-ink\">mladším žiačkam (U12)</strong> – na Majstrovstvách Slovenska &amp; Synchrostars 2026 vybojovali <strong class=\"text-ink\">zlato v každej jednej disciplíne</strong>. Päť štartov, päť zlatých! 🥇",
      disciplines: ["Povinné figúry", "Sólo", "Duo", "Tím", "Kombinovaná zostava"],
    },
    coaches: { eyebrow: "Trénerky", h2: "Ľudia za úspechmi", sub: "Náš tím vedie dievčatá s láskou k vode a zmyslom pre detail." },
    competitions: {
      eyebrow: "Súťaže", h2: "Výsledky z pretekov",
      intro: "Najnovšie štarty našich žralokýň doma aj v zahraničí. Sezóna pokračuje – sledujte nás na Instagrame.",
      view: "Pozrieť →", more: "Pozrieť viac",
    },
    gallery: {
      eyebrow: "Galéria", h2: "Momentky z vody", more: "Viac na Instagrame →",
      campsEyebrow: "Tábory a sústredenia", campsH: "Spomienky z výjazdov",
      prev: "Predošlé", next: "Ďalšie",
    },
    nabor: {
      eyebrow: "Nábor", h2: "Staň sa akvabelkou!",
      p1: "Miluješ vodu, pohyb a zábavu? Príď objaviť čaro synchronizovaného plávania, kde sa spája plávanie, tanec, gymnastika a hudba. Nájdeš u nás nové kamarátky, zažiješ množstvo nezabudnuteľných zážitkov a naučíš sa zručnosti, ktoré ti zostanú na celý život.",
      p2: "Pridaj sa k úspešnému tímu Synchro Žralok a zaži s nami radosť z pohybu vo vode! 🦈💙",
      openBtn: "Prihlasovací formulár",
      formTitle: "Prihlasovací formulár", formSub: "Vyplňte údaje a my sa vám čoskoro ozveme.",
      fChild: "Meno dieťaťa", fDob: "Dátum narodenia", fParent: "Meno rodiča", fEmail: "E-mail", fPhone: "Telefónne číslo",
      submit: "Odoslať", submitting: "Odosielam…",
      errRobot: "Potvrďte, prosím, že nie ste robot.",
      errGeneric: "Niečo sa pokazilo. Skúste to prosím znova.",
      errConn: "Spojenie zlyhalo. Skúste to prosím znova.",
      okTitle: "Prihlášku sme prijali!",
      okText: "Ďakujeme. Vašu žiadosť sme úspešne dostali – naši tréneri vás budú čoskoro kontaktovať na uvedených údajoch.",
      close: "Zavrieť",
    },
    camps: { eyebrow: "Podujatia", datesH: "Termíny leto 2026", note: "Tréningy vo vode aj na suchu pod vedením skúsených trénerov. Vhodné pre začiatočníčky aj pokročilé." },
    faqUi: {
      eyebrow: "Otázky a odpovede", h2: "Čo vás zaujíma najčastejšie",
      intro: "Nenašli ste odpoveď? Napíšte nám na Instagrame alebo na mail.",
      moreQ: "Máte ďalšiu otázku?", ig: "Napísať na Instagram", email: "Správa na e-mail",
    },
    contact: {
      eyebrow: "Pridaj sa", h2: "Chceš sa stať akvabelkou?",
      pHtml: "Napíš nám správu na Instagrame alebo sa rovno prihlás na letný kemp.<br />Tešíme sa na teba vo vode! 💦🦈",
      ig: "Napíš nám na Instagrame",
    },
    footer: { copyright: "Synchronizované plávanie v Bratislave.", builtBy: "Vytvoril" },
    seo: {
      title: "Synchronizované plávanie pre deti od 5 rokov v Bratislave | SYNCHRO Žralok",
      description: "Klub akvabeliek v Bratislave – tréningy od 5 rokov, Devínska & Karlova Ves. Letné kempy 2026 od 189 €. Prvý tréning nezáväzne. Prihlás dcérku ešte dnes!",
      keywords: "synchronizované plávanie Bratislava, akvabelky Bratislava, artistické plávanie deti Bratislava, plávanie pre dievčatá od 5 rokov, letný kemp plávanie 2026 Bratislava, Synchro Žralok Bratislava, plávanie pre deti Devínska Nová Ves, synchronized swimming club Bratislava",
      ogAlt: "SYNCHRO Žralok Bratislava — klub synchronizovaného plávania",
      campDesc: "Letný kemp synchronizovaného plávania pre dievčatá 5–12 rokov. Tréningy vo vode aj na suchu, nové priateľstvá a radosť z pohybu.",
    },
  },

  en: {
    nav: { gallery: "Gallery", nabor: "Join us", camps: "Camps", about: "About", titles: "Achievements", faq: "FAQ", contact: "Contact", member: "Member area" },
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    medalWords: { gold: "gold", silver: "silver", bronze: "bronze" },
    hero: {
      l1: "Synchronised", l2: "swimming for", l3: "young children",
      ctaJoin: "Join the club", ctaAch: "Our achievements →",
      gold: "gold", silver: "silver", bronze: "bronze medals",
    },
    about: {
      eyebrow: "About the club",
      h2: "Swimming, gymnastics, dance and&nbsp;music in&nbsp;one",
      p1: "Synchronised swimming is more than a sport – it is elegance, strength and teamwork in one. The girls learn to control their body in the water, feel the music, cooperate and build mutual trust – values they will use not only in sport, but also in life.",
      startInfo: "Girls can start with us from the age of 5 – from complete beginners to athletes representing the club abroad.",
      disciplinesH: "Disciplines we compete in",
      note: "Synchronised (artistic) swimming develops strength, flexibility, a feel for music and teamwork – and above all it brings children joy from the water.",
    },
    titles: {
      eyebrow: "Achievements", h2: "Medal tally by category",
      intro: "An overview of the medals our girls have won at home and at international competitions – broken down by age category.",
      clubTotal: "Club total", medals: "medals", total: "Total",
      groupMeta: {
        U8: { age: "under 8", note: "girls under 8" },
        U10: { age: "under 10", note: "girls under 10" },
        U12: { age: "under 12", note: "younger girls" },
        U15: { age: "under 15", note: "older girls" },
      } as Record<string, { age: string; note: string }>,
      levelIntro: "In addition, the girls won more medals in performance levels (Level 2/3):",
      note: "Aggregated from results published on the club's Instagram.",
    },
    champions: {
      eyebrow: "Slovak Champions 2026",
      h2pre: "U12 – gold in", h2hl: "every discipline",
      pHtml: "A huge congratulations to our <strong class=\"text-ink\">younger girls (U12)</strong> – at the Slovak Championships &amp; Synchrostars 2026 they won <strong class=\"text-ink\">gold in every single discipline</strong>. Five starts, five golds! 🥇",
      disciplines: ["Figures", "Solo", "Duo", "Team", "Combo"],
    },
    coaches: { eyebrow: "Coaches", h2: "The people behind the success", sub: "Our team guides the girls with a love for the water and an eye for detail." },
    competitions: {
      eyebrow: "Competitions", h2: "Competition results",
      intro: "The latest starts of our little sharks at home and abroad. The season continues – follow us on Instagram.",
      view: "View →", more: "View more",
    },
    gallery: {
      eyebrow: "Gallery", h2: "Moments from the water", more: "More on Instagram →",
      campsEyebrow: "Camps & training trips", campsH: "Memories from our trips",
      prev: "Previous", next: "Next",
    },
    nabor: {
      eyebrow: "Join us", h2: "Become a synchronised swimmer!",
      p1: "Do you love water, movement and fun? Come discover the magic of synchronised swimming, where swimming, dance, gymnastics and music come together. You'll make new friends, enjoy unforgettable experiences and learn skills that will stay with you for life.",
      p2: "Join the successful Synchro Žralok team and feel the joy of moving in the water with us! 🦈💙",
      openBtn: "Application form",
      formTitle: "Application form", formSub: "Fill in the details and we'll get back to you soon.",
      fChild: "Child's name", fDob: "Date of birth", fParent: "Parent's name", fEmail: "E-mail", fPhone: "Phone number",
      submit: "Send", submitting: "Sending…",
      errRobot: "Please confirm that you're not a robot.",
      errGeneric: "Something went wrong. Please try again.",
      errConn: "Connection failed. Please try again.",
      okTitle: "Application received!",
      okText: "Thank you. We've successfully received your request – our coaches will contact you soon using the details you provided.",
      close: "Close",
    },
    camps: { eyebrow: "Events", datesH: "Summer 2026 dates", note: "Training in the water and on dry land under experienced coaches. Suitable for beginners and advanced alike." },
    faqUi: {
      eyebrow: "Questions & answers", h2: "What people ask most",
      intro: "Didn't find your answer? Message us on Instagram or by e-mail.",
      moreQ: "Have another question?", ig: "Message on Instagram", email: "Send an e-mail",
    },
    contact: {
      eyebrow: "Join us", h2: "Want to become a synchronised swimmer?",
      pHtml: "Message us on Instagram or sign up straight away for the summer camp.<br />We look forward to seeing you in the water! 💦🦈",
      ig: "Message us on Instagram",
    },
    footer: { copyright: "Synchronised swimming in Bratislava.", builtBy: "Built by" },
    seo: {
      title: "Synchronised swimming for children from age 5 in Bratislava | SYNCHRO Žralok",
      description: "Synchronised swimming club in Bratislava – training from age 5, Devínska & Karlova Ves. Summer camps 2026 from €189. First trial lesson with no commitment. Sign your daughter up today!",
      keywords: "synchronised swimming Bratislava, artistic swimming Bratislava, swimming for girls from age 5, summer swimming camp 2026 Bratislava, Synchro Žralok Bratislava, kids swimming club Bratislava, aquabelles Bratislava",
      ogAlt: "SYNCHRO Žralok Bratislava — synchronised swimming club",
      campDesc: "Summer synchronised swimming camp for girls aged 5–12. Training in and out of the water, new friendships and the joy of movement.",
    },
  },
} as const;

export const t = dict[LOCALE];
