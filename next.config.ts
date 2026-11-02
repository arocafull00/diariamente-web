import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.137", "127.0.0.1"],
  experimental: {
    staleTimes: {
      dynamic: 31_536_000,
    },
  },
};

const uploadToSentry = process.env.VERCEL_ENV === "production";

export default withSentryConfig(nextConfig, {
  org: "adrian-rocafull",
  project: "diariamente",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  telemetry: false,
  sourcemaps: { disable: !uploadToSentry },
  release: { create: uploadToSentry },
  widenClientFileUpload: true,
  tunnelRoute: "/relay",
});
