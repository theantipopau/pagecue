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
    theme_color: "#2f4d3a",
    icons: [
      {
        src: "/icons/icon.png",
        sizes: "1254x1254",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
