# Prihlasovací formulár — backend (LIVE)

Stav: **nasadené a otestované.** Formulár cez popup → reCAPTCHA v2 → PHP endpoint
→ Mailgun (2 e-maily). Žiadne kľúče nie sú v repozitári ani v statickom builde.

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

## DOČASNÉ (na testovanie)
- `CLUB_EMAIL=9035038@gmail.com` v `/etc/synchrozralok/.env`.
- Po testoch zmeniť na `synchro.zralok.bratislava@gmail.com`:
  ```bash
  ssh root@5.75.136.96
  sed -i 's/^CLUB_EMAIL=.*/CLUB_EMAIL=synchro.zralok.bratislava@gmail.com/' /etc/synchrozralok/.env
  # netreba reload (PHP číta .env pri každom requeste)
  ```

## Rotácia kľúčov
Stačí upraviť `/etc/synchrozralok/.env` na serveri — bez rebuildu/deploya.

## Frontend env (lokálny build/dev)
Site key sa ťahá z `/api/config.php` (runtime), takže `.env` v repe netreba.
Lokálne (bez PHP) sa reCAPTCHA nevykreslí — testovať na nasadenej stránke.
