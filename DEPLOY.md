# Deployment — synchrozralok.com

Статический Astro-сайт на Hetzner (`5.75.136.96`, Ubuntu 24.04, nginx) рядом с whiteeagles.sk.
Деплой автоматический через GitHub Actions при push в ветку `main`.

## Архитектура

- **Репозиторий:** https://github.com/JaffarSk24/SYNCHRO-Zralok-Bratislava
- **Ветки:** `develop` — работа; `main` — продакшн (любой push → автодеплой).
- **CI/CD:** `.github/workflows/deploy.yml` — `npm ci` → `npm run build` → `rsync dist/` на сервер.
- **Сервер:** nginx vhost `synchrozralok.com`, файлы в `/var/www/synchrozralok.com`.
- **Basic-auth:** сайт скрыт логином/паролем (оба `12345`) до одобрения руководительницей клуба.
  Файл: `/etc/nginx/.htpasswd-synchrozralok`.

## GitHub Secrets (уже настроены)

| Secret | Значение |
|---|---|
| `SSH_PRIVATE_KEY` | приватный ed25519 deploy-ключ |
| `SSH_HOST` | `5.75.136.96` |
| `SSH_USER` | `root` |
| `DEPLOY_PATH` | `/var/www/synchrozralok.com` |

Публичный deploy-ключ установлен в `/root/.ssh/authorized_keys` на сервере.

## Как задеплоить

```bash
git checkout main
git merge develop
git push origin main      # → GitHub Actions соберёт и выложит автоматически
```
Или вручную: вкладка **Actions → Deploy to Hetzner → Run workflow**.

## DNS (делается в панели webglobe.sk)

A-запись домена должна указывать на сервер Hetzner:

| Тип | Имя | Значение | TTL |
|---|---|---|---|
| A | @ (synchrozralok.com) | `5.75.136.96` | 300 |
| A | www | `5.75.136.96` | 300 |

(удалить старую A-запись на `62.109.151.80`).

## SSL (после смены DNS)

Когда домен начнёт резолвиться в `5.75.136.96`:
```bash
ssh root@5.75.136.96
certbot --nginx -d synchrozralok.com -d www.synchrozralok.com
```
certbot добавит 443-блок и редирект 80→443; basic-auth сохранится.
Автопродление уже работает системным таймером certbot (как у whiteeagles.sk).

## Снять basic-auth (когда сайт одобрят и пора открыть публично)

```bash
ssh root@5.75.136.96
sed -i '/auth_basic/d' /etc/nginx/sites-available/synchrozralok.com
nginx -t && systemctl reload nginx
```

## Изоляция от whiteeagles.sk

- Разные nginx vhost'ы (name-based по `server_name`), общий nginx.
- Разные каталоги: `/var/www/html` (whiteeagles) vs `/var/www/synchrozralok.com`.
- Статика, без отдельного node-процесса/порта → конфликтов нет.
