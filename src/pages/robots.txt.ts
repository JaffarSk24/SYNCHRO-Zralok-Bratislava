import type { APIRoute } from "astro";
import { SITE_URL } from "../i18n";

// Per-locale robots.txt → correct sitemap domain on .sk vs .com
export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
