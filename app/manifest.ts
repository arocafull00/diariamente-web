import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Diariamente",
    short_name: "Diariamente",
    description: "Registro emocional diario",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8f3",
    theme_color: "#fff8f3",
    related_applications: [
      {
        platform: "webapp",
        url: "/manifest.webmanifest",
      },
    ],
    icons: [
      {
        src: "/icon-192x192.png?v=5",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png?v=5",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-maskable-512x512.png?v=5",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
