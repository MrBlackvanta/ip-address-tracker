import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";

import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://ip-address-tracker.abdelrhman-ahmed8881.workers.dev";

const name = "IP Address Tracker";
const title = `${name} | Locate any IP address or domain`;
const description =
  "Look up any IP address or domain and see its location, timezone and internet provider, pinned on a map.";

const shareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "IP Address Tracker, showing an address with its location, timezone and provider above a map.",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: name,
    locale: "en_US",
    type: "website",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [shareImage],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#505ab9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rubik.variable} antialiased`}>
      <body className="relative flex min-h-dvh flex-col bg-white">
        {children}
      </body>
    </html>
  );
}
