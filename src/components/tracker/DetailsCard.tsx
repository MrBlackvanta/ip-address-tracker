import { formatLocation, formatTimezone } from "@/lib";
import type { LookupResult } from "@/lib";

import DetailsItem from "./DetailsItem";

type DetailsCardProps = {
  result: LookupResult | null;
  error: string | null;
  isPending: boolean;
};

export default function DetailsCard({
  result,
  error,
  isPending,
}: DetailsCardProps) {
  return (
    <section
      aria-label="Address details"
      aria-busy={isPending}
      className="mx-auto w-full max-w-277.5 rounded-panel bg-white px-6 pt-6.5 pb-6 lg:px-8 lg:pt-9.25 lg:pb-9"
    >
      {error ? (
        <p role="alert" className="text-center text-field text-error">
          {error}
        </p>
      ) : (
        <dl
          className={`grid gap-6 text-center transition-opacity duration-200 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-16.25 lg:gap-y-0 lg:text-left ${isPending ? "opacity-60" : ""}`}
        >
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
