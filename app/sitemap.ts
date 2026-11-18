// /sitemap.xml: every public page, so Google finds all stays and cities.
import type { MetadataRoute } from "next";
import { getPublicProperties } from "@/lib/listing-status";
import { CITIES } from "@/lib/cities";
import { abs } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const properties = await getPublicProperties();
  return [
    { url: abs("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...properties.filter((p) => !p.unavailable).map((p) => ({
      url: abs(`/stays/${p.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p.bookingMode === "direct" ? 0.9 : 0.8,
      images: [abs(p.img)],
    })),
    ...CITIES.map((c) => ({ url: abs(`/cities/${c.slug}`), lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    { url: abs("/become-a-host"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...["/cancellations", "/terms", "/privacy", "/cookies"].map((u) => ({ url: abs(u), lastModified: now, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
