// Web app manifest: lets guests (and Sam and Maddie) add the site to their
// phone's home screen, where it opens full-screen like an app.
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "M&S Hosting Solutions",
    short_name: "M&S Hosting",
    description: "Boutique stays across Ontario, hosted in person by Sam and Maddie Jean-Louis.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F5EFE5",
    theme_color: "#3D4A3D",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Book Hot Tub Oasis", url: "/stays/hot-tub-oasis" },
      { name: "All stays", url: "/#stays" },
    ],
  };
}
