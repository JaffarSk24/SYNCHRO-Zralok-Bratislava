# SYNCHRO Žralok Bratislava — landing page

Moderný jednostránkový web pre klub synchronizovaného plávania
[@synchro.zralok.bratislava](https://www.instagram.com/synchro.zralok.bratislava/).

Postavené na **Astro** + **Tailwind CSS v4**, výstup je čistá statika (`dist/`).

## Vývoj

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # statika do ./dist
npm run preview  # náhľad buildu
```

## Obsah (dáta)

Obsah sekcií *Tituly*, *Súťaže* a *Galéria* sa generuje z verejného Instagramu klubu
(bez prihlásenia, cez verejné API endpointy). Spustenie pipeline:

```bash
npm run data
# = node scripts/fetch-instagram.mjs   -> scripts/data/*.json (108 príspevkov)
#   node scripts/parse-medals.mjs       -> src/content/medals.json, competitions.json
#   node scripts/download-images.mjs    -> public/gallery/*, src/content/gallery.json
```

Ručne udržiavané dáta: `src/content/club.json`, `coaches.json`, `events.json` (kempy).

## Štruktúra

```
scripts/            sťahovanie a parsovanie Instagramu
src/
  content/*.json    dáta sekcií
  components/*.astro sekcie (Hero, Titles, Competitions, Camps, …)
  layouts/Base.astro shell (SEO, fonty, reveal-on-scroll)
  pages/index.astro  zloženie stránky
public/
  logo-zralok.svg   vektorizované logo (žralok), recolorovateľné cez currentColor
  favicon.svg, og-image.png
```

## Logo

`public/logo-zralok.svg` je vektorizovaná verzia pôvodného loga z trička
(potrace z fotografie). Používa `fill="currentColor"`, takže sa dá prefarbiť cez CSS.

## Nasadenie

Pozri [DEPLOY.md](./DEPLOY.md) — nginx static vhost na Hetzner serveri vedľa whiteeagles.sk.
