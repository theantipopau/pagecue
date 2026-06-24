import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PageCue",
    short_name: "PageCue",
    description:
      "A spoiler-safe reading companion that reminds you what's happened in your book so far.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f2e9",
    theme_color: "#1c2a66",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
