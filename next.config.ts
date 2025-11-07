import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Module Federation disabled - incompatible with Next.js App Router
  // See: https://github.com/vercel/next.js/issues/54298
  // Alternative: Create separate webpack build for federation
};

export default nextConfig;
