"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";

import { GENERIC_ERROR, LookupFailed, requestLookup } from "@/lib";
import type { LookupResult } from "@/lib";

type State = {
  result: LookupResult | null;
  error: string | null;
  errorId: number;
  isPending: boolean;
};

type Action =
  | { type: "started" }
  | { type: "resolved"; result: LookupResult }
  | { type: "failed"; error: string };

export type Tracker = State & { lookup: (query: string) => void };

const initialState: State = {
  result: null,
  error: null,
  errorId: 0,
  isPending: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "started":
      return state.isPending ? state : { ...state, isPending: true };
    case "resolved":
      return { ...state, result: action.result, error: null, isPending: false };
    case "failed":
      return {
        ...state,
        error: action.error,
        errorId: state.errorId + 1,
        isPending: false,
      };
  }
}

function messageFor(error: unknown) {
  return error instanceof LookupFailed ? error.message : GENERIC_ERROR;
}

export default function useIpLookup(): Tracker {
  const [state, dispatch] = useReducer(reducer, initialState);
  const inFlight = useRef<AbortController | null>(null);

  const lookup = useCallback((query: string) => {
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    dispatch({ type: "started" });

    requestLookup(query, controller.signal)
      .then((result) => dispatch({ type: "resolved", result }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        dispatch({ type: "failed", error: messageFor(error) });
      });
  }, []);

  useEffect(() => {
    lookup("");
    return () => inFlight.current?.abort();
  }, [lookup]);

  return { ...state, lookup };
}
