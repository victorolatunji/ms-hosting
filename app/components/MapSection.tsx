import Link from "next/link";
import Eyebrow from "./ui/Eyebrow";
import MapArt from "./MapArt"; // generated vintage GTA basemap (static SVG)
import { PROPERTIES, type Property } from "@/lib/properties";
import { toWords } from "@/lib/words";

// Stylized GTA map. The basemap (MapArt) is decorative static SVG; the city
// pins below are the interactive layer — native <Link>s to each city page.
// Server component, no client JS: hover + focus states are pure CSS.
//
// x/y are in MapArt's 1200x720 viewBox space, projected from real lon/lat.
// Pins position by percentage (left = x/12, top = y/7.2) so they line up with
// the basemap at every size. The frame's 5:3 aspect matches the viewBox.
//
// Counts are derived live from lib/properties.ts, so pins stay accurate.
// Sudbury sits ~350 km north of the frame, so it gets a corner inset instead
// of a pin (see SUDBURY below).
type Side = "left" | "right" | "above" | "below";
type City = { slug: string; name: string; x: number; y: number; label: Side };

// Projection used by MapArt: x = 529 + (lon + 79.38) * 852, y = 518 - (lat - 43.65) * 784
const CITIES: City[] = [
  { slug: "brampton",  name: "Brampton",  x: 205, y: 487, label: "below" },
  { slug: "vaughan",   name: "Vaughan",   x: 418, y: 369, label: "below" },
  { slug: "bradford",  name: "Bradford",  x: 376, y: 157, label: "below" },
  { slug: "toronto",   name: "Toronto",   x: 529, y: 518, label: "below" },
  { slug: "pickering", name: "Pickering", x: 780, y: 371, label: "below" },
  { slug: "ajax",      name: "Ajax",      x: 840, y: 359, label: "above" },
  { slug: "whitby",    name: "Whitby",    x: 906, y: 333, label: "below" },
  { slug: "oshawa",    name: "Oshawa",    x: 972, y: 322, label: "right" },
];


const LABEL_POS: Record<Side, string> = {
  below: "top-full mt-2 left-1/2 -translate-x-1/2",
  above: "bottom-full mb-2 left-1/2 -translate-x-1/2",
  left: "right-full mr-2 top-1/2 -translate-y-1/2",
  right: "left-full ml-2 top-1/2 -translate-y-1/2",
};

export default function MapSection({ properties = PROPERTIES }: { properties?: Property[] }) {
  const countIn = (slug: string) => properties.filter((p) => p.citySlug === slug).length;
  const SUDBURY_COUNT = countIn("sudbury");
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
            All {toWords(properties.length)}, <span className="italic text-clay">in one view.</span>
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
              aria-label={`${c.name}, ${countIn(c.slug)} ${countIn(c.slug) === 1 ? "stay" : "stays"}`}
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
                {countIn(c.slug)}
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

          {/* Sudbury inset: off the top of the map, about four hours north */}
          {SUDBURY_COUNT > 0 && (
            <Link
              href="/cities/sudbury"
              aria-label={`Sudbury, ${SUDBURY_COUNT} stays, about four hours north`}
              className="group absolute right-3 top-3 z-10 flex items-center gap-2.5 rounded-xl border border-line bg-bone/90 px-3 py-2 shadow-[0_6px_18px_-8px_rgba(31,37,33,0.45)] backdrop-blur-sm transition-colors hover:border-clay md:right-5 md:top-5"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full bg-clay text-bone ring-2 ring-bone md:h-8 md:w-8"
                style={{ font: "500 12px var(--font-mono, monospace)" }}
              >
                {SUDBURY_COUNT}
              </span>
              <span className="leading-tight">
                <span className="block text-ink group-hover:text-clay" style={{ font: "600 11px var(--font-mono, monospace)", letterSpacing: "0.1em" }}>
                  ↑ SUDBURY
                </span>
                <span className="block text-ink-soft" style={{ font: "400 10px var(--font-mono, monospace)" }}>
                  About 4 hrs north
                </span>
              </span>
            </Link>
          )}
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
              {c.name} · {countIn(c.slug)}
            </Link>
          ))}
          {SUDBURY_COUNT > 0 && (
            <Link
              href="/cities/sudbury"
              className="rounded-full border border-line bg-bone-soft px-3 py-1.5 text-ink-soft"
              style={{ font: "500 11px var(--font-mono, monospace)", letterSpacing: "0.08em" }}
            >
              Sudbury · {SUDBURY_COUNT}
            </Link>
          )}
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