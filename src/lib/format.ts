import type { LookupResult } from "./types";

type Place = Pick<LookupResult, "city" | "region" | "postalCode">;

export function formatLocation({ city, region, postalCode }: Place) {
  const area = [city, region].filter(Boolean).join(", ");
  return [area, postalCode].filter(Boolean).join(" ");
}

export function formatTimezone(offset: string) {
  return offset ? `UTC ${offset}` : "";
}
