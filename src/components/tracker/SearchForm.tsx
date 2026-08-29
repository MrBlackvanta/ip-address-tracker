"use client";

import { ArrowIcon } from "@/components/icons";

export default function SearchForm() {
  return (
    <form
      role="search"
      onSubmit={(event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) =>
        event.preventDefault()
      }
      className="relative mt-7.25 flex h-14.5 w-full max-w-138.75 overflow-hidden rounded-panel bg-white has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-4 has-[input:focus-visible]:outline-white lg:mt-7.75"
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
        className="min-w-0 flex-1 pr-4 pl-6 text-field text-ink placeholder:text-muted focus-visible:outline-hidden"
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
