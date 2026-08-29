import type { LookupResult } from "./types";

export const GENERIC_ERROR = "Something went wrong. Try again.";

export class LookupFailed extends Error {}

export async function requestLookup(query: string, signal: AbortSignal) {
  const url = new URL("/api/lookup", location.origin);
  if (query) url.searchParams.set("q", query);

  const response = await fetch(url, { signal });
  const payload = (await response.json()) as LookupResult & { error?: string };
  if (!response.ok) throw new LookupFailed(payload.error ?? GENERIC_ERROR);
  return payload;
}
