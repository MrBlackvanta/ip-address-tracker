import type { LookupResult } from "../src/lib/types";
import { LookupError, geolocate, lookupVisitor } from "./lookup";
import type { IncomingRequest } from "./lookup";
import { parseQuery, queryValue } from "./query";
import type { Query } from "./query";

type Env = { IPIFY_API_KEY: string };

const CACHE_FOR_A_DAY = "public, max-age=86400";

function json(body: unknown, status = 200, cacheControl = "no-store") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": cacheControl,
    },
  });
}

async function visitorResult(
  request: IncomingRequest,
  env: Env,
): Promise<LookupResult> {
  const visitor = lookupVisitor(request);
  if (visitor) return visitor;

  const ip = request.headers.get("CF-Connecting-IP");
  return geolocate(ip ? { ipAddress: ip } : null, env.IPIFY_API_KEY);
}

async function cachedResult(
  query: Query,
  origin: string,
  env: Env,
  context: ExecutionContext,
) {
  const cache = caches.default;
  const key = new Request(
    `${origin}/api/lookup?q=${encodeURIComponent(queryValue(query))}`,
  );

  const cached = await cache.match(key);
  if (cached) return cached;

  const result = await geolocate(query, env.IPIFY_API_KEY);
  const response = json(result, 200, CACHE_FOR_A_DAY);
  context.waitUntil(cache.put(key, response.clone()));
  return response;
}

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/lookup")
      return json({ error: "Not found." }, 404);
    if (request.method !== "GET") {
      return json({ error: "Method not allowed." }, 405);
    }

    const raw = url.searchParams.get("q")?.trim() ?? "";

    try {
      if (!raw) return json(await visitorResult(request, env));

      const query = parseQuery(raw);
      if (!query) {
        return json({ error: "Enter a valid IP address or domain." }, 400);
      }
      return await cachedResult(query, url.origin, env, context);
    } catch (error) {
      if (error instanceof LookupError) {
        return json({ error: error.message }, error.status);
      }
      return json({ error: "Something went wrong. Try again." }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
