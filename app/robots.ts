import type { MetadataRoute } from "next";

const CRAWLERS = [
  "*",
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: CRAWLERS.map((userAgent) => ({
      userAgent,
      allow: "/",
      disallow: "/api/",
    })),
    sitemap: "https://diariamente.es/sitemap.xml",
  };
}
