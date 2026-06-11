import type { APIRoute } from "astro";
import { INDEXNOW_KEY } from "../i18n";

// IndexNow verification key file, emitted only for THIS build's domain.
// getStaticPaths makes the filename equal the locale's key, so each domain
// hosts exactly one key file at /<key>.txt. Body = the key, no trailing newline.
export function getStaticPaths() {
  return [{ params: { indexnowkey: INDEXNOW_KEY } }];
}

export const GET: APIRoute = () =>
  new Response(INDEXNOW_KEY, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
