import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Static landing page. Built to ./dist and served by nginx as static files
// (no Node runtime in production -> no conflict with the Next.js site on the box).
export default defineConfig({
  site: "https://synchrozralok.com",
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
});
