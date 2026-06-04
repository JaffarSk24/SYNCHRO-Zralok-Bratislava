import type { APIRoute } from "astro";
import { SITE_URL, ALT_URL, LOCALE } from "../i18n";

// Flat sitemap for this single-page site — one direct URL so Search Console
// reports the page immediately (no index→child indirection). Per-locale domain,
// with hreflang alternates pointing at the other language.
export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().split("T")[0];
  const hl = LOCALE === "en" ? "en" : "sk";
  const altHl = LOCALE === "en" ? "sk" : "en";
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <xhtml:link rel="alternate" hreflang="${hl}" href="${SITE_URL}/"/>
    <xhtml:link rel="alternate" hreflang="${altHl}" href="${ALT_URL}/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://synchrozralok.com/"/>
  </url>
</urlset>
`;
  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
