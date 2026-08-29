import { HeaderBanner } from "@/components/layout";
import { SearchForm } from "@/components/tracker";

export default function Home() {
  return (
    <>
      <HeaderBanner>
        <SearchForm />
      </HeaderBanner>
      <main className="relative flex-1" />
    </>
  );
}
