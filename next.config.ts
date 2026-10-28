import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.137", "127.0.0.1"],
  experimental: {
    staleTimes: {
      dynamic: 31_536_000,
    },
  },
};

export default nextConfig;
