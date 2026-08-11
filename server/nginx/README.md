# nginx vhosts (reference)

Reference copies of the two production nginx vhosts on the Hetzner server
(`root@5.75.136.96`). **CI never touches nginx** — the static builds are deployed
by `.github/workflows/deploy.yml`, but these server blocks are applied by hand.
Keep these files in sync when you change the live config so the server stays
reproducible.

## Files
- `synchrozralok.com.conf` → EN build, root `/var/www/synchrozralok-en`
- `synchrozralok.sk.conf` → SK build, root `/var/www/synchrozralok.com` *(legacy dir name — it holds the Slovak site)*

## What these encode (manual features, not defaults)
- `charset utf-8;` — text files (`.txt`, `.xml`, `.html`) are served as UTF-8, so
  `llms.txt` / `robots.txt` render correctly instead of mojibake.
- `www` → non-www 301 (over HTTPS), on both domains.
- `location ~ \.(xml|txt)$ { try_files $uri =404; }` — stale/removed files (e.g. the
  old `sitemap-index.xml`) return a real 404 instead of the SPA HTML fallback.
- ACME challenge left open for Let's Encrypt renewals.
- `/api/(config|prihlaska).php` → php-fpm; PHP lives in `/var/www/synchrozralok-api`
  (outside the static roots) and reads secrets from `/etc/synchrozralok/.env`.
- No basic auth (the site is public). No secrets are stored in these files.

## Apply on the server
```bash
ssh root@5.75.136.96
# copy the file into place (example for .com):
#   scp server/nginx/synchrozralok.com.conf root@5.75.136.96:/etc/nginx/sites-available/synchrozralok.com
ln -sf /etc/nginx/sites-available/synchrozralok.com /etc/nginx/sites-enabled/synchrozralok.com
ln -sf /etc/nginx/sites-available/synchrozralok.sk  /etc/nginx/sites-enabled/synchrozralok.sk
nginx -t && systemctl reload nginx
```

SSL is managed by Certbot (`certbot --nginx`); the `listen 443 ssl` / `ssl_certificate*`
lines are Certbot-managed. Secrets (reCAPTCHA, Mailgun, CLUB_EMAIL) live only in
`/etc/synchrozralok/.env` — see `server/SETUP.md`.
