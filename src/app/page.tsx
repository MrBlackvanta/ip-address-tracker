import { Attribution, HeaderBanner } from "@/components/layout";
import {
  DetailsCard,
  MapPanel,
  SearchForm,
  TrackerProvider,
} from "@/components/tracker";

export default function Home() {
  return (
    <TrackerProvider>
      <HeaderBanner>
        <SearchForm />
      </HeaderBanner>
      <main className="relative flex-1">
        <MapPanel />
        <div className="relative z-10 -mt-33.25 px-6 lg:-mt-20">
          <DetailsCard />
        </div>
      </main>
      <footer className="absolute inset-x-0 bottom-0.5 z-20 mx-auto w-fit rounded-full bg-white px-3 py-0.5">
        <Attribution />
      </footer>
    </TrackerProvider>
  );
}
