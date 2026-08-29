"use client";

import { createContext, use } from "react";
import type { ReactNode } from "react";

import { useIpLookup } from "@/hooks";
import type { Tracker } from "@/hooks";

export const LOOKUP_ERROR_ID = "lookup-error";

const TrackerContext = createContext<Tracker | null>(null);

export function useTracker() {
  const tracker = use(TrackerContext);
  if (!tracker) throw new Error("useTracker needs a TrackerProvider above it");
  return tracker;
}

export default function TrackerProvider({ children }: { children: ReactNode }) {
  const tracker = useIpLookup();
  return <TrackerContext value={tracker}>{children}</TrackerContext>;
}
