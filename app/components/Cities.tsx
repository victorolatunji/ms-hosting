import { ChevronRight } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";

// Cities section, the seven-city grid.
// Server component, no interactivity beyond CSS hover effects.

// The seven GTA cities M&S manages homes in.
// Property counts hardcoded for now, will be Supabase-driven in Phase 3.
const CITIES = [
  { name: "Toronto",      count: 2, img: "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?w=800&q=80" },
  { name: "Oshawa",       count: 2, img: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&q=80" },
  { name: "Ajax",         count: 2, img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80" },
  { name: "Whitby",       count: 2, img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800&q=80" },
  { name: "Pickering",    count: 1, img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80" },
  { name: "Uxbridge",     count: 1, img: "https://images.unsplash.com/photo-1507371341162-763b5e419408?w=800&q=80" },
  { name: "Mississauga",  count: 1, img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80" },
];

export default function Cities() {
  return (
    // id="cities" so the header's #cities nav link scrolls here
    <section id="cities" className="px-6 py-[110px] max-md:px-5 max-md:py-[70px]">
      <div className="max-w-[1320px] mx-auto">

        {/* Header row: eyebrow + heading on the left, "View all stays" link on the right */}
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

        {/* The grid itself.
            auto-fit + minmax means it adapts: as many columns as fit at 240px+ each.
            On big screens you get 5-6 columns, on tablets 3-4, on small phones 1. */}
        <div
          className="grid gap-4 max-sm:grid-cols-1"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
        >
          {CITIES.map((city, i) => (
            <a
              key={city.name}
              href="#stays"
              // .lift = our hover lift + image zoom helper from globals.css
              className="lift relative h-[360px] rounded-[18px] overflow-hidden no-underline block cursor-pointer max-sm:h-[280px]"
            >
              {/* Background city photo. .img-zoom scales on parent hover */}
              <img
                src={city.img}
                alt={city.name}
                className="img-zoom absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark gradient overlay, makes the white text at the bottom readable */}
              <div className="absolute inset-0 bg-gradient-to-b from-moss/0 from-30% to-moss-dark/90 to-100%" />

              {/* "No. 01" label, top-left */}
              <div className="absolute top-[18px] left-[18px] font-mono text-bone text-[10px] tracking-[0.22em] uppercase opacity-85">
                No. {String(i + 1).padStart(2, "0")}
              </div>

              {/* Homes count pill, top-right */}
              <div className="absolute top-4 right-4 bg-bone/95 backdrop-blur-sm text-moss px-3 py-1 rounded-full text-[11px] font-medium">
                {city.count} {city.count === 1 ? "home" : "homes"}
              </div>

              {/* City name and "Explore stays" CTA, bottom-left */}
              <div className="absolute bottom-0 left-0 right-0 px-[22px] py-6 text-bone">
                <div className="font-display text-[32px] font-medium mb-1.5 leading-none">
                  {city.name}
                </div>
                <div className="text-[13px] opacity-85 flex items-center gap-1.5">
                  Explore stays <ChevronRight size={13} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}