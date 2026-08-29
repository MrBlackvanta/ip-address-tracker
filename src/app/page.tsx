import { HeaderBanner } from "@/components/layout";
import { DetailsCard, SearchForm } from "@/components/tracker";
import type { LookupResult } from "@/lib";

const designPreview: LookupResult = {
  ip: "192.212.174.101",
  city: "Brooklyn",
  region: "NY",
  postalCode: "10001",
  timezoneOffset: "-05:00",
  isp: "SpaceX Starlink",
  lat: 40.6782,
  lng: -73.9442,
};

export default function Home() {
  return (
    <>
      <HeaderBanner>
        <SearchForm />
      </HeaderBanner>
      <main className="relative flex-1">
        <div className="relative -mt-33.25 px-6 lg:-mt-20">
          <DetailsCard result={designPreview} error={null} isPending={false} />
        </div>
      </main>
    </>
  );
}
