import type { MetadataRoute } from "next";

const PUBLIC_PATHS = ["/empezar", "/privacidad", "/terminos"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({ url: `https://diariamente.es${path}` }));
}
