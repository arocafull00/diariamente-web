import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 31_536_000,
    },
  },
};

export default nextConfig;
