import type { NextConfig } from "next";

const WORKER_ORIGIN = "http://127.0.0.1:8787";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactCompiler: true,
  turbopack: { root: import.meta.dirname },
  ...(process.env.NODE_ENV === "development" && {
    rewrites: async () => [
      { source: "/api/:path*", destination: `${WORKER_ORIGIN}/api/:path*` },
    ],
  }),
};

export default nextConfig;
