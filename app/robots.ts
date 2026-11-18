// /robots.txt: let search engines in, keep private and functional pages out.
import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/booking/", "/saved"] }],
    sitemap: abs("/sitemap.xml"),
  };
}
