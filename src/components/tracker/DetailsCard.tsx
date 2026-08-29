"use client";

import { formatLocation, formatTimezone } from "@/lib";

import DetailsItem from "./DetailsItem";
import { LOOKUP_ERROR_ID, useTracker } from "./TrackerProvider";

export default function DetailsCard() {
  const { result, error, errorId, isPending } = useTracker();

  return (
    <section
      data-details-card=""
      aria-label="Address details"
      aria-busy={isPending}
      className="mx-auto w-full max-w-277.5 rounded-panel bg-white px-6 pt-6.5 pb-6 shadow-panel lg:px-8 lg:pt-9.25 lg:pb-9"
    >
      {error ? (
        <p
          key={errorId}
          id={LOOKUP_ERROR_ID}
          role="alert"
          className="text-center text-field text-error"
        >
          {error}
        </p>
      ) : (
        <dl className="grid gap-6 text-center md:grid-cols-2 lg:grid-cols-4 lg:gap-x-16.25 lg:gap-y-0 lg:text-left">
          <DetailsItem label="IP Address" value={result?.ip ?? ""} />
          <DetailsItem
            label="Location"
            value={result ? formatLocation(result) : ""}
          />
          <DetailsItem
            label="Timezone"
            value={result ? formatTimezone(result.timezoneOffset) : ""}
          />
          <DetailsItem label="ISP" value={result?.isp ?? ""} />
        </dl>
      )}
    </section>
  );
}
