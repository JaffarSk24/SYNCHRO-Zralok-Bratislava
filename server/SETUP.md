# Prihlasovací formulár — backend setup

Frontend (modal + form + lazy reCAPTCHA) je hotový. Aby fungovalo odoslanie,
treba dokončiť serverovú časť. Kroky nižšie sú jednorazové.

## 1. Google reCAPTCHA v2
- https://www.google.com/recaptcha/admin/create
- Typ: **reCAPTCHA v2 → „I'm not a robot" Checkbox**
- Domény: `synchrozralok.com` (neskôr aj `synchrozralok.sk`, `localhost`)
- Dostaneš **Site key** (verejný) a **Secret key** (tajný).
  - Site key → nastav build env `PUBLIC_RECAPTCHA_SITE_KEY` (v `.env.local` a v GitHub Actions).
  - Secret key → ide do `secrets.php` na serveri (krok 4).

## 2. Mailgun (sending domain mg.synchrozralok.sk)
- Mailgun → Add domain → `mg.synchrozralok.sk`, región **EU**.
- Pridaj DNS záznamy, ktoré Mailgun zobrazí, k doméne **synchrozralok.sk** (u registrátora):
  - TXT (SPF), TXT (DKIM), MX (2×), CNAME (tracking).
- Počkaj na overenie (zelené ✓). Skopíruj **Private API key**.

## 3. DNS pre samotný web (ak ešte nie je)
- `synchrozralok.com` už smeruje na Hetzner. (`.sk` rieš neskôr pri SK verzii.)

## 4. Secrets na serveri (mimo web rootu)
```bash
ssh root@5.75.136.96
mkdir -p /etc/synchrozralok
# skopíruj server/secrets.sample.php -> /etc/synchrozralok/secrets.php a vyplň kľúče
nano /etc/synchrozralok/secrets.php
chown www-data:www-data /etc/synchrozralok/secrets.php
chmod 600 /etc/synchrozralok/secrets.php
```

## 5. Endpoint + nginx (PHP cez php-fpm)
```bash
# umiestni endpoint mimo statického deploya (rsync ho neprepíše)
mkdir -p /var/www/synchrozralok-api/api
# nahraj server/api/prihlaska.php -> /var/www/synchrozralok-api/api/prihlaska.php
chown -R www-data:www-data /var/www/synchrozralok-api
```
Do nginx vhostu `synchrozralok.com` (do 80 aj 443 servera) pridaj:
```nginx
location = /api/prihlaska.php {
    root /var/www/synchrozralok-api;
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php8.3-fpm.sock;
}
```
Potom `nginx -t && systemctl reload nginx`.

## Čo treba odo mňa (Kirill) dodať pre dokončenie
- **reCAPTCHA Site key** (verejný) — pridám do frontend env.
- **reCAPTCHA Secret key** + **Mailgun Private API key** — vložia sa do `secrets.php`.
- Potvrdiť, že **mg.synchrozralok.sk je v Mailgune overený** (DNS zelené).

Po dodaní kľúčov dorobím nginx + secrets a otestujeme reálne odoslanie.

> Pozn.: kým nie sú kľúče, formulár používa testovací reCAPTCHA kľúč (zobrazí
> „for testing purposes only") a odoslanie vráti chybu, lebo endpoint ešte nebeží.
