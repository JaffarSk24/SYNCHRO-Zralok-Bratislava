// Fetches all posts from the public Instagram profile of SYNCHRO Žralok Bratislava.
// Browser-free: uses Instagram's public web/feed API endpoints via fetch.
// Output: scripts/data/posts.json (captions, dates, likes, media urls).
import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";

// Instagram rejects Node's fetch (400) but accepts curl. Shell out to curl.
function curlJson(url, extraHeaders = []) {
  const args = ["-s", "--compressed", url];
  for (const h of extraHeaders) args.push("-H", h);
  const out = execFileSync("curl", args, { maxBuffer: 64 * 1024 * 1024 });
  return JSON.parse(out.toString("utf8"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "data");

const USERNAME = "synchro.zralok.bratislava";
const USER_ID = "57729421506";
const APP_ID = "936619743392459";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fetchProfile() {
  const json = curlJson(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${USERNAME}`,
    [
      `x-ig-app-id: ${APP_ID}`,
      "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    ]
  );
  return json.data.user;
}

function fetchFeedPage(maxId) {
  let url = `https://i.instagram.com/api/v1/feed/user/${USER_ID}/?count=33`;
  if (maxId) url += `&max_id=${encodeURIComponent(maxId)}`;
  return curlJson(url, [
    `x-ig-app-id: ${APP_ID}`,
    "User-Agent: Instagram 219.0.0.12.117 Android",
  ]);
}

function pickImage(item) {
  // best candidate image url for a feed item (handles carousel/sidecar + video thumbs)
  const cands =
    item.image_versions2?.candidates ||
    item.carousel_media?.[0]?.image_versions2?.candidates ||
    [];
  return cands[0]?.url || null;
}

function normalize(item) {
  return {
    id: item.code || item.pk,
    code: item.code,
    date: new Date(item.taken_at * 1000).toISOString().slice(0, 10),
    timestamp: item.taken_at,
    likes: item.like_count ?? null,
    type:
      item.media_type === 2
        ? "video"
        : item.carousel_media
        ? "carousel"
        : "image",
    caption: item.caption?.text ?? "",
    image: pickImage(item),
    permalink: item.code ? `https://www.instagram.com/p/${item.code}/` : null,
  };
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });

  const profile = fetchProfile();
  const bio = {
    username: USERNAME,
    full_name: profile.full_name,
    biography: profile.biography,
    followers: profile.edge_followed_by.count,
    posts_count: profile.edge_owner_to_timeline_media.count,
    external_url: profile.external_url,
    profile_pic: profile.profile_pic_url_hd,
  };

  const posts = [];
  let maxId = null;
  let page = 0;
  while (true) {
    const data = fetchFeedPage(maxId);
    const items = data.items || [];
    for (const it of items) posts.push(normalize(it));
    page++;
    process.stdout.write(`page ${page}: +${items.length} (total ${posts.length})\n`);
    if (!data.more_available || !data.next_max_id) break;
    maxId = data.next_max_id;
    await sleep(1200); // be polite
    if (page > 20) break; // safety
  }

  await writeFile(
    join(DATA_DIR, "profile.json"),
    JSON.stringify(bio, null, 2)
  );
  await writeFile(
    join(DATA_DIR, "posts.json"),
    JSON.stringify(posts, null, 2)
  );
  console.log(`\nDone: ${posts.length} posts -> scripts/data/posts.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
