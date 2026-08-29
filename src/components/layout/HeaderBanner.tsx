import type { ReactNode } from "react";

import patternDesktop from "@/assets/pattern-bg-desktop.webp";
import patternMobile from "@/assets/pattern-bg-mobile.webp";

export default function HeaderBanner({ children }: { children: ReactNode }) {
  return (
    <header className="relative flex h-75 flex-col items-center bg-linear-to-bl/srgb from-banner-from to-banner-to px-6 pt-6.5 lg:h-70 lg:pt-8.25">
      <picture className="contents">
        <source
          media="(min-width: 48rem)"
          srcSet={patternDesktop.src}
          width={1440}
          height={280}
        />
        <img
          src={patternMobile.src}
          alt=""
          width={375}
          height={300}
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      </picture>
      <h1 className="relative text-title font-medium tracking-heading text-white lg:text-title-lg">
        IP Address Tracker
      </h1>
      {children}
    </header>
  );
}
