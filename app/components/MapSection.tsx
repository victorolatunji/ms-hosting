import Link from "next/link";
import Eyebrow from "./ui/Eyebrow";
import MapArt from "./MapArt"; // generated vintage GTA basemap (static SVG)

// Stylized GTA map. The basemap (MapArt) is decorative static SVG; the 7 city
// pins below are the interactive layer — native <Link>s to each city page.
// Server component, no client JS: hover + focus states are pure CSS.
//
// x/y are in MapArt's 1200x720 viewBox space, projected from real lon/lat.
// Pins position by percentage (left = x/12, top = y/7.2) so they line up with
// the basemap at every size. The frame's 5:3 aspect matches the viewBox.
//
// `count` = stays in that city (sums to 11). Swap to a derived value once the
// Phase 4 admin can add properties, e.g. properties.filter(p => p.city===slug).length
type Side = "left" | "right" | "above" | "below";
type City = { slug: string; name: string; x: number; y: number; count: number; label: Side };

const CITIES: City[] = [
  { slug: "mississauga", name: "Mississauga", x: 305, y: 569, count: 1, label: "below" },
  { slug: "toronto",     name: "Toronto",     x: 529, y: 518, count: 2, label: "below" },
  { slug: "uxbridge",    name: "Uxbridge",    x: 753, y: 154, count: 1, label: "below" },
  { slug: "pickering",   name: "Pickering",   x: 780, y: 371, count: 1, label: "below" },
  { slug: "ajax",        name: "Ajax",        x: 840, y: 359, count: 2, label: "above" },
  { slug: "whitby",      name: "Whitby",      x: 906, y: 333, count: 2, label: "below" },
  { slug: "oshawa",      name: "Oshawa",      x: 972, y: 322, count: 2, label: "right" },
];

const LABEL_POS: Record<Side, string> = {
  below: "top-full mt-2 left-1/2 -translate-x-1/2",
  above: "bottom-full mb-2 left-1/2 -translate-x-1/2",
  left: "right-full mr-2 top-1/2 -translate-y-1/2",
  right: "left-full ml-2 top-1/2 -translate-y-1/2",
};

export default function MapSection() {
  return (
    <section id="map" className="px-6 py-[110px] max-md:px-5 max-md:py-[70px]">
      <div className="mx-auto max-w-[1320px]">
        {/* Header */}
        <div className="mb-9 max-w-[640px]">
          <Eyebrow>Find us on the map</Eyebrow>
          <h2
            className="m-0 font-display leading-[1.1] text-moss"
            style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
          >
            All eleven, <span className="italic text-clay">in one view.</span>
          </h2>
        </div>

        {/* Framed map. 5:3 aspect matches the SVG viewBox so pins align. */}
        <div className="relative mx-auto aspect-[5/3] w-full max-w-[1180px] overflow-hidden rounded-[22px] border border-line bg-bone-soft shadow-[0_18px_50px_-28px_rgba(31,37,33,0.45)]">

          <MapArt />

          {/* Interactive pin layer (HTML over SVG; % positions track the viewBox) */}
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/cities/${c.slug}`}
              aria-label={`${c.name}, ${c.count} ${c.count === 1 ? "stay" : "stays"}`}
              className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${c.x / 12}%`, top: `${c.y / 7.2}%` }}
            >
              {/* amber halo on hover / keyboard focus */}
              <span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/0 transition-colors duration-300 group-hover:bg-amber/35 group-focus-visible:bg-amber/35" />
              {/* clay dot with stay count */}
              <span
                className="relative flex h-8 w-8 items-center justify-center rounded-full bg-clay text-bone ring-[3px] ring-bone shadow-[0_3px_10px_-1px_rgba(31,37,33,0.5)] transition-transform duration-300 group-hover:scale-110 group-focus-visible:scale-110 md:h-9 md:w-9"
                style={{ font: "500 13px var(--font-mono, monospace)" }}
              >
                {c.count}
              </span>
              {/* name label, backed with bone so it stays legible over the busy map */}
              <span
                className={`pointer-events-none absolute hidden whitespace-nowrap rounded bg-bone/80 px-1.5 py-0.5 text-ink/90 transition-colors group-hover:text-clay group-focus-visible:text-clay md:block ${LABEL_POS[c.label]}`}
                style={{ font: "600 11px var(--font-mono, monospace)", letterSpacing: "0.1em" }}
              >
                {c.name.toUpperCase()}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile-only city chips (labels are hidden on small screens) */}
        <div className="mt-5 flex flex-wrap gap-2 md:hidden">
          {CITIES.map((c) => (
            <Link
              key={c.slug}
              href={`/cities/${c.slug}`}
              className="rounded-full border border-line bg-bone-soft px-3 py-1.5 text-ink-soft"
              style={{ font: "500 11px var(--font-mono, monospace)", letterSpacing: "0.08em" }}
            >
              {c.name} · {c.count}
            </Link>
          ))}
        </div>

        {/* Legend */}
        <p
          className="mt-4 text-ink-soft"
          style={{ font: "400 12px var(--font-mono, monospace)", letterSpacing: "0.03em" }}
        >
          Each number marks the stays in that city. Tap a pin to explore.
        </p>
      </div>
    </section>
  );
}