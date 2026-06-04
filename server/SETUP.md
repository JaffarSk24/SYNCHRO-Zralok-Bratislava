# Prihlasovací formulár — backend (LIVE)

Stav: **nasadené a otestované.** Formulár cez popup → reCAPTCHA v2 → PHP endpoint
→ Mailgun (2 e-maily). Žiadne kľúče nie sú v repozitári ani v statickom builde.

---

## Dvojjazyčné nasadenie (.sk = SK, .com = EN)

Web sa builduje dvakrát z jedného kódu (i18n cez `PUBLIC_LOCALE`):
- `npm run build` → `dist/` = **slovenská** verzia (synchrozralok**.sk**)
- `PUBLIC_LOCALE=en npx astro build --outDir dist-en` → `dist-en/` = **anglická** verzia (synchrozralok**.com**)

CI (`.github/workflows/deploy.yml`) buildne obe a nasadí:
- `dist/` → `DEPLOY_PATH` (root vhostu **.sk**)
- `dist-en/` → `DEPLOY_PATH_EN` (root vhostu **.com**)

### Jednorazové kroky na serveri (nutné raz, mimo CI)

1. **GitHub secret** `DEPLOY_PATH_EN` = root pre anglickú verziu, napr. `/var/www/synchrozralok-en`
   (musí sa zhodovať s `root` vo vhoste .com — viď nižšie).
   `DEPLOY_PATH` ponecháme ako root pre **.sk**.

2. **nginx**: vhost **synchrozralok.com** prepnúť `root` na `DEPLOY_PATH_EN`,
   vhost **synchrozralok.sk** necháva `root` = `DEPLOY_PATH`. `/api/` (php-fpm) ostáva
   na oboch vhostoch rovnaké (endpoint sám rozlišuje jazyk cez `lang` v POST tele).
   ```bash
   ssh root@5.75.136.96
   mkdir -p /var/www/synchrozralok-en && chown -R www-data:www-data /var/www/synchrozralok-en
   # v /etc/nginx/sites-available/<vhost .com>: root /var/www/synchrozralok-en;
   nginx -t && systemctl reload nginx
   ```
   Po prvom merge do `main` CI naplní `/var/www/synchrozralok-en` anglickým buildom.

### Nasadenie API (php)
CI (`deploy.yml`) okrem statiky synchronizuje aj `server/api/` → `DEPLOY_PATH_API`
(`/var/www/synchrozralok-api/api`, bez `--delete`). Predtým sa PHP nasadzovalo ručne,
čo spôsobilo, že server bežal na starej verzii bez `lang` (e-maily chodili po slovensky
aj z .com) — teraz sa `prihlaska.php`/`config.php` aktualizujú pri každom merge do `main`.

### E-maily podľa jazyka
`prihlaska.php` prijíma `lang` (`sk`/`en`) z formulára:
- **en** → anglické predmety + texty, podpis `www.synchrozralok.com`
- **sk** → slovenské predmety + texty, podpis `www.synchrozralok.sk`

---

## Server (Hetzner)
- Secrets: `/etc/synchrozralok/.env` (chmod 600, www-data) — reCAPTCHA secret/site key,
  Mailgun key/domain, FROM_EMAIL, CLUB_EMAIL. **Nikdy necommitovať.**
- Endpoints (mimo statického deploya): `/var/www/synchrozralok-api/api/`
  - `config.php` → vracia iba verejný `recaptchaSiteKey`
  - `prihlaska.php` → overí reCAPTCHA, pošle 2 e-maily cez Mailgun
- nginx (vhost synchrozralok.com, 443): `location ~ ^/api/(config|prihlaska)\.php$` → php-fpm.

## E-maily
- Odosielateľ (oba): `SYNCHRO Žralok <ahoj@synchrozralok.sk>` (cez mg.synchrozralok.sk, EU).
- Klubu: predmet „Nová prihláška: …", **Reply-To = e-mail rodiča**.
- Rodičovi: potvrdenie, **Reply-To = CLUB_EMAIL**.

## Príjemca prihlášok (klub)
- `CLUB_EMAIL=synchro.zralok.bratislava@gmail.com` v `/etc/synchrozralok/.env` (ostrá adresa klubu).
- Zmena adresy (bez rebuildu/deploya, PHP číta `.env` pri každom requeste):
  ```bash
  ssh root@5.75.136.96
  sed -i 's/^CLUB_EMAIL=.*/CLUB_EMAIL=synchro.zralok.bratislava@gmail.com/' /etc/synchrozralok/.env
  ```

## Rotácia kľúčov
Stačí upraviť `/etc/synchrozralok/.env` na serveri — bez rebuildu/deploya.

## Frontend env (lokálny build/dev)
Site key sa ťahá z `/api/config.php` (runtime), takže `.env` v repe netreba.
Lokálne (bez PHP) sa reCAPTCHA nevykreslí — testovať na nasadenej stránke.
