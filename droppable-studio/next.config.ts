import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* the old pre-order page lives on in bios and DMs */
  async redirects() {
    return [
      { source: "/preorder", destination: "/school", permanent: true },
      { source: "/preorder/:path*", destination: "/school", permanent: true },
    ];
  },
};

export default nextConfig;
