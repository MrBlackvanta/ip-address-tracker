const IPV4 =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
const IPV6_CHARACTERS = /^[0-9a-f:.]+$/;
const DOMAIN =
  /^(?=.{4,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

export type Query = { ipAddress: string } | { domain: string };

function isIpv6(value: string) {
  return IPV6_CHARACTERS.test(value) && URL.canParse(`http://[${value}]`);
}

function hostnameOf(value: string) {
  return value.includes("://") && URL.canParse(value)
    ? new URL(value).hostname
    : value;
}

export function parseQuery(raw: string): Query | null {
  const value = hostnameOf(raw.trim()).toLowerCase();
  if (IPV4.test(value) || isIpv6(value)) return { ipAddress: value };
  if (DOMAIN.test(value)) return { domain: value };
  return null;
}

export function queryValue(query: Query) {
  return "ipAddress" in query ? query.ipAddress : query.domain;
}
