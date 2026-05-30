# PLAN — synchrozralok.com landing page
_Файл ведётся как живой чеклист. Каждый шаг помечается `[x]` сразу после выполнения._
_Любой агент может продолжить с любого `[ ]` шага._

---

## Контекст и решения

| Параметр | Значение |
|---|---|
| Клуб | SYNCHRO Žralok Bratislava — аkvabelky, детское синхронное плавание, Bratislava |
| Instagram | [@synchro.zralok.bratislava](https://www.instagram.com/synchro.zralok.bratislava/) — **единственный** онлайн-источник клуба |
| Главный тренер | Martina Nela (@martina.nela) |
| Язык сайта | Словацкий (SK) |
| Стек | Astro 5 + Tailwind CSS v4 → статика в `dist/` |
| Хостинг | Hetzner (рядом с whiteeagles.sk — Next.js). Статика = отдельный nginx vhost, 0 конфликтов |
| Репозиторий | https://github.com/JaffarSk24/SYNCHRO-Zralok-Bratislava |
| Домен | ещё не куплен, настроить потом |
| Dev сервер | `npm run dev` → http://localhost:4321 |

> ⚠️ Внимание: клуб "KSP Žralok" (ksp-zralok.com, iedu.sk) — это ДРУГОЙ клуб (плавание с ластами). Данные оттуда не использовать.

---

## Фаза 0 — Сбор данных ✅

- [x] Скачать все 108 постов из Instagram через curl (`scripts/fetch-instagram.mjs`)
- [x] Распарсить медали по группам U8/U10/U12/U16 (`scripts/parse-medals.mjs`) → `src/content/medals.json`
- [x] Сформировать список соревнований с результатами → `src/content/competitions.json`
- [x] Скачать 22 фото в `public/gallery/`, оптимизировать до 82% quality, 1280px → `src/content/gallery.json`

**Медальный зачёт (агрегат всех 108 постов):**
| Группа | 🥇 | 🥈 | 🥉 | Σ |
|---|---|---|---|---|
| U8 | 1 | 0 | 1 | 2 |
| U10 | 15 | 10 | 7 | 32 |
| U12 | 14 | 8 | 12 | 34 |
| U16 (Youth/Junior) | 0 | 1 | 1 | 2 |
| Level 2/3 (не привязаны к возрасту) | 7 | 2 | 4 | 13 |
| **КЛУБ ИТОГО** | **37** | **21** | **25** | **83** |

---

## Фаза 1 — Логотип ✅ / ⏳ (частично)

- [x] Векторизовать акулу в SVG → `public/logo-zralok.svg` (currentColor, прозрачный фон)
- [x] Сгенерировать favicon.svg (чёрный кружок + белая акула)
- [x] Сгенерировать og-image.png (1200×630, тёмный градиент + белая акула + название)
- [ ] **Векторизовать текстовую часть логотипа отдельно** (`IMG_7041.jpg` или `IMG_7042.jpg`)
  - Исходник: `IMG_7041.jpg` (4032×2268) — крупный план надписи SYNCHRO / ŽRALOK / BRATISLAVA
  - Метод: ImageMagick threshold + potrace → `public/logo-text.svg`
  - Использование: отдельный SVG-компонент `src/components/LogoText.astro` (вместо/рядом с акулой в нужных местах)
  - Сохранить комбинированный вариант: `public/logo-full.svg` (акула + текст)
- [ ] Обновить `src/components/Logo.astro` — добавить prop `variant="shark"|"text"|"full"` для выбора части логотипа
- [ ] Обновить Nav: в брендинге использовать SVG-текст вместо HTML-надписи «SYNCHRO ŽRALOK»

---

## Фаза 2 — Блок «Naše tituly» ✅

Медальный зачёт по группам (U8/U10/U12/U16) реализован — баннер «83 medailí» + 4 карточки. Trophy Cabinet не нужен.

---

## Фаза 3 — GitHub + Deployment ⏳

- [ ] Инициализировать git-репозиторий в папке проекта
- [ ] Создать/обновить `.gitignore`:
  ```
  node_modules/
  dist/
  .astro/
  .DS_Store
  *.log
  .env
  .env.local
  .env.*.local
  IMG_*.jpg          # исходники фото логотипа (локальные, тяжёлые)
  457902034*.jpg     # исходник фото логотипа
  scripts/data/      # сырые JSON от Instagram (генерируется, не в репо)
  ```
- [ ] Создать `.env.example` (шаблон без секретов):
  ```
  # Пример — скопируй в .env.local и заполни
  # IG_APP_ID=936619743392459     # публичный, но лучше держать снаружи
  # SITE_URL=https://synchrozralok.com
  ```
- [ ] Создать `.env.local` (реальный, в .gitignore, никогда не коммитить):
  ```
  IG_APP_ID=936619743392459
  SITE_URL=https://synchrozralok.com
  ```
- [ ] Сделать первый коммит: `git init && git add . && git commit -m "init: Astro landing page"`
- [ ] Привязать к удалённому репозиторию: `git remote add origin https://github.com/JaffarSk24/SYNCHRO-Zralok-Bratislava.git`
- [ ] Создать ветку develop: `git checkout -b develop && git push -u origin develop`
- [ ] Настроить GitHub Actions для автоматической сборки при push в develop → проверка `npm run build`
  - [ ] Создать `.github/workflows/build.yml`

---

## Фаза 4 — UX/дизайн доработки ⏳

- [ ] Мобильное меню-бургер (сейчас nav-ссылки скрыты на мобильном)
- [ ] Добавить ссылку-якорь «Trenéri» в nav (сейчас есть блок, но нет в nav)
- [ ] Проверить и починить цвет текста `text-cyan`, `text-gold`, `text-silver`, `text-bronze` — они объявлены в @theme, убедиться что Tailwind v4 их подхватывает корректно
- [ ] Добавить `<meta name="theme-color" content="#050f1a">` (мобильный браузер)
- [ ] Проверить все внешние ссылки (Instagram, kemp CTA) — открываются в новой вкладке с rel="noopener"

---

## Фаза 5 — Деплой (после покупки домена)

- [ ] Купить домен synchrozralok.com (или .sk)
- [ ] На Hetzner сервере: создать `/var/www/synchrozralok.com/`
- [ ] Создать nginx vhost (шаблон в `DEPLOY.md`)
- [ ] `rsync -avz --delete dist/ deploy@SERVER:/var/www/synchrozralok.com/`
- [ ] `sudo certbot --nginx -d synchrozralok.com -d www.synchrozralok.com`
- [ ] Проверить, что whiteeagles.sk продолжает работать (разные server_name)
- [ ] Подключить GitHub Actions → auto deploy при push в main

---

## Файловая структура проекта

```
/
├── PLAN.md                    ← этот файл
├── DEPLOY.md                  ← инструкция по деплою
├── README.md
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .gitignore
├── .env.example               ← шаблон без секретов (в репо)
├── .env.local                 ← реальные ключи (НЕ в репо)
├── .github/
│   └── workflows/build.yml
├── scripts/
│   ├── fetch-instagram.mjs    ← скачать 108 постов (npm run data)
│   ├── parse-medals.mjs       ← медали + соревнования
│   ├── download-images.mjs    ← галерея
│   └── data/                  ← .gitignore — генерируемые JSON
├── public/
│   ├── logo-zralok.svg        ← акула ✅
│   ├── logo-text.svg          ← SYNCHRO ŽRALOK BRATISLAVA текст [ ]
│   ├── logo-full.svg          ← акула + текст [ ]
│   ├── favicon.svg            ✅
│   ├── og-image.png           ✅
│   └── gallery/*.jpg          ✅ (22 фото, 4.5 МБ)
└── src/
    ├── content/
    │   ├── medals.json         ✅
    │   ├── competitions.json   ✅
    │   ├── gallery.json        ✅
    │   ├── club.json           ✅
    │   ├── coaches.json        ✅
    │   └── events.json         ✅
    ├── components/
    │   ├── Nav.astro           ✅ (обновить с SVG-текстом [ ])
    │   ├── Logo.astro          ✅ (обновить variants [ ])
    │   ├── LogoText.astro      ← новый [ ]
    │   ├── Hero.astro          ✅
    │   ├── About.astro         ✅
    │   ├── Titles.astro        ✅
    │   ├── Competitions.astro  ✅
    │   ├── Camps.astro         ✅
    │   ├── Coaches.astro       ✅
    │   ├── Gallery.astro       ✅
    │   ├── Contact.astro       ✅
    │   └── Footer.astro        ✅
    ├── layouts/Base.astro      ✅
    ├── pages/index.astro       ✅
    └── styles/global.css       ✅
```

---

## Команды быстрого старта для следующего агента

```bash
cd "/Users/kirill 1/Desktop/synchrozralok.com"
npm run dev          # dev сервер → localhost:4321
npm run build        # продакшн сборка → dist/
npm run data         # обновить данные из Instagram
```

Instagram API (без браузера, через curl):
- Профиль: `curl -s 'https://www.instagram.com/api/v1/users/web_profile_info/?username=synchro.zralok.bratislava' -H 'x-ig-app-id: 936619743392459'`
- Посты: `curl -s 'https://i.instagram.com/api/v1/feed/user/57729421506/?count=33&max_id=<next_max_id>' -H 'x-ig-app-id: 936619743392459' -H 'User-Agent: Instagram 219.0.0.12.117 Android'`
