"use client";

import { ArrowIcon } from "@/components/icons";

import { useTracker } from "./TrackerProvider";

export default function SearchForm() {
  const { lookup } = useTracker();

  function handleSubmit(
    event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q");
    lookup(typeof query === "string" ? query.trim() : "");
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="relative mt-7.25 flex h-14.5 w-full max-w-138.75 overflow-hidden rounded-panel bg-white shadow-panel has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-white lg:mt-7.75"
    >
      <label htmlFor="query" className="sr-only">
        IP address or domain
      </label>
      <input
        id="query"
        name="q"
        type="text"
        autoComplete="off"
        spellCheck={false}
        placeholder="Search for any IP address or domain"
        className="min-w-0 flex-1 overflow-hidden pr-4 pl-6 text-field text-ellipsis text-ink placeholder:text-muted focus-visible:outline-hidden"
      />
      <button
        type="submit"
        aria-label="Search"
        className="grid w-14.5 shrink-0 place-items-center bg-button text-white transition-colors hover:bg-button-hover focus-visible:-outline-offset-4 focus-visible:outline-white"
      >
        <ArrowIcon className="h-3.5 w-2.5" />
      </button>
    </form>
  );
}
