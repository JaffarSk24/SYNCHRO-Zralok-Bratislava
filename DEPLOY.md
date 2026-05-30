# Nasadenie — synchrozralok.com

Statická stránka (Astro → `dist/`). V produkcii ju obsluhuje **nginx ako statické súbory**,
takže na serveri **nebeží žiadny Node proces** a **nedochádza ku konfliktu** s Next.js
stránkou `whiteeagles.sk` (tá má vlastný Node proces a port).

## 1. Build

```bash
npm install          # prvýkrát
npm run build        # vytvorí ./dist
```

> Aktualizácia obsahu z Instagramu (medaily, súťaže, galéria) — kedykoľvek:
> ```bash
> npm run data       # fetch-instagram + parse-medals + download-images
> npm run build
> ```

## 2. Prenos na server (Hetzner)

```bash
# z lokálu
rsync -avz --delete dist/ deploy@SERVER:/var/www/synchrozralok.com/
```

Cieľový adresár drž **oddelene** od whiteeagles (napr. `/var/www/synchrozralok.com`).

## 3. nginx — samostatný server block

Vytvor `/etc/nginx/sites-available/synchrozralok.com`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name synchrozralok.com www.synchrozralok.com;

    root /var/www/synchrozralok.com;
    index index.html;

    # statická stránka — žiadny proxy_pass, žiadny port → 0 konfliktov s whiteeagles
    location / {
        try_files $uri $uri/ /index.html;
    }

    # cache statiky
    location ~* \.(css|js|svg|png|jpg|jpeg|webp|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    access_log /var/log/nginx/synchrozralok.access.log;
}
```

Aktivuj a over:

```bash
sudo ln -s /etc/nginx/sites-available/synchrozralok.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

`whiteeagles.sk` zostáva nedotknutý — má svoj vlastný `server_name` a svoj proxy na Node.

## 4. DNS (po kúpe domény)

V DNS u registrátora nasmeruj na IP Hetzner servera:

```
A     @      <IP_SERVERA>
A     www    <IP_SERVERA>
```

## 5. HTTPS (Let's Encrypt)

```bash
sudo certbot --nginx -d synchrozralok.com -d www.synchrozralok.com
```

Certbot upraví server block na `listen 443 ssl` a pridá presmerovanie z HTTP.

---

### Zhrnutie izolácie od whiteeagles.sk
| | whiteeagles.sk | synchrozralok.com |
|---|---|---|
| Typ | Next.js (Node runtime) | statické HTML/CSS |
| Proces | PM2/systemd + port | žiadny |
| nginx | `proxy_pass` na Node | `root` na priečinok |
| Konflikt | — | žiadny (iný server_name, žiadny port) |
