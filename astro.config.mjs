import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// Per-locale canonical site (drives sitemap URLs): .com = EN build, .sk = SK build
const site =
  process.env.PUBLIC_LOCALE === "en"
    ? "https://synchrozralok.com"
    : "https://synchrozralok.sk";

export default defineConfig({
  site,
  output: "static",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
