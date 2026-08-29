import type { LookupResult } from "../src/lib/types";
import type { Query } from "./query";

const IPIFY_ENDPOINT = "https://geo.ipify.org/api/v2/country,city";

type IpifyResponse = {
  ip: string;
  isp: string;
  location: {
    city: string;
    region: string;
    postalCode: string;
    timezone: string;
    lat: number;
    lng: number;
  };
};

export class LookupError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function offsetFor(timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "longOffset",
  });
  const label = formatter
    .formatToParts(new Date())
    .find((part) => part.type === "timeZoneName")?.value;
  return label?.replace("GMT", "") || "+00:00";
}

export async function geolocate(query: Query | null, apiKey: string) {
  const url = new URL(IPIFY_ENDPOINT);
  url.searchParams.set("apiKey", apiKey);
  for (const [parameter, value] of Object.entries(query ?? {})) {
    url.searchParams.set(parameter, value);
  }

  const response = await fetch(url);
  if (!response.ok) {
    console.error(`geo.ipify answered ${response.status}`);
    if (response.status === 403 || response.status >= 500) {
      throw new LookupError(
        502,
        "The lookup service didn't respond. Try again in a moment.",
      );
    }
    throw new LookupError(404, "We couldn't locate that IP address or domain.");
  }

  const { ip, isp, location } = (await response.json()) as IpifyResponse;
  return {
    ip,
    isp,
    city: location.city,
    region: location.region,
    postalCode: location.postalCode,
    timezoneOffset: location.timezone,
    lat: location.lat,
    lng: location.lng,
  } satisfies LookupResult;
}

export type IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

export function lookupVisitor(request: IncomingRequest): LookupResult | null {
  const { cf } = request;
  const ip = request.headers.get("CF-Connecting-IP");
  if (!cf || !ip) return null;
  if (cf.latitude === undefined || cf.longitude === undefined) return null;

  return {
    ip,
    city: cf.city ?? "",
    region: cf.region ?? "",
    postalCode: cf.postalCode ?? "",
    timezoneOffset: cf.timezone ? offsetFor(cf.timezone) : "",
    isp: cf.asOrganization ?? "",
    lat: Number(cf.latitude),
    lng: Number(cf.longitude),
  };
}
