import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import { CITIES } from "@/lib/cities";
import { PROPERTIES } from "@/lib/properties";

// Cities section on the homepage. Each card links to /cities/[slug].
// Server component, only CSS hover effects for interactivity.

// Count properties per city for the "2 homes" pill on each card.
// Derived live from the properties data so it stays accurate as
// properties are added or removed.
function countPropertiesInCity(citySlug: string): number {
  return PROPERTIES.filter((p) => p.citySlug === citySlug).length;
}

export default function Cities() {
  return (
    <section id="cities" className="px-6 py-[110px] max-md:px-5 max-md:py-[70px]">
      <div className="max-w-[1320px] mx-auto">

        {/* Header row */}
        <div className="flex items-end justify-between mb-14 flex-wrap gap-6">
          <div className="max-w-[640px]">
            <Eyebrow>Browse by city</Eyebrow>
            <h2
              className="font-display m-0 leading-[1.05] text-moss"
              style={{ fontSize: "clamp(34px, 5vw, 60px)" }}
            >
              Seven cities,{" "}
              <span className="italic text-clay">eleven doorsteps.</span>
            </h2>
          </div>
          <a
            href="#stays"
            className="underline-link text-ink no-underline text-sm font-medium inline-flex items-center gap-1.5"
          >
            View all stays <ChevronRight size={14} />
          </a>
        </div>

        {/* City grid */}
        <div
          className="grid gap-4 max-sm:grid-cols-1"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
        >
          {CITIES.map((city, i) => {
            const count = countPropertiesInCity(city.slug);
            return (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                className="lift relative h-[360px] rounded-[18px] overflow-hidden no-underline block cursor-pointer max-sm:h-[280px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={city.img}
                  alt={city.name}
                  className="img-zoom absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-moss/0 from-30% to-moss-dark/90 to-100%" />

                {/* "No. 01" label, top-left */}
                <div className="absolute top-[18px] left-[18px] font-mono text-bone text-[10px] tracking-[0.22em] uppercase opacity-85">
                  No. {String(i + 1).padStart(2, "0")}
                </div>

                {/* Homes count pill, top-right */}
                <div className="absolute top-4 right-4 bg-bone/95 backdrop-blur-sm text-moss px-3 py-1 rounded-full text-[11px] font-medium">
                  {count} {count === 1 ? "home" : "homes"}
                </div>

                {/* City name and CTA, bottom-left */}
                <div className="absolute bottom-0 left-0 right-0 px-[22px] py-6 text-bone">
                  <div className="font-display text-[32px] font-medium mb-1.5 leading-none">
                    {city.name}
                  </div>
                  <div className="text-[13px] opacity-85 flex items-center gap-1.5">
                    Explore stays <ChevronRight size={13} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}