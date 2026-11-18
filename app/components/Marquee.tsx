// Live ticker under the hero. Two rows drifting in opposite directions:
//   row 1: real numbers worked out from the listings data (never hard-coded)
//   row 2: every city, each linking to its page
// Pure CSS animation, pauses on hover, stops for "reduce motion".

import Link from "next/link";
import { CITIES } from "@/lib/cities";
import { siteStats } from "@/lib/perks";
import { toWords } from "@/lib/words";
import { PROPERTIES, type Property } from "@/lib/properties";

function statsFor(s: ReturnType<typeof siteStats>): [string, string][] {
  return [
  [String(s.homes), "Homes under our care"],
  [String(s.cities), "Ontario cities"],
  ...(s.avg ? ([[s.avg.toFixed(2), `Average from ${s.reviews.toLocaleString("en-CA")} reviews`]] as [string, string][]) : []),
  [String(s.hotTubs), "Private hot tubs"],
  [`Up to ${s.sleepsMost}`, "Guests in one home"],
  ["1", "Home you can book direct"],
  ["2", "Hosts, in person"],
  ["~1 hr", "Typical reply time"],
  ];
}

function Row({ children, reverse = false }: { children: React.ReactNode; reverse?: boolean }) {
  return (
    <div className="group overflow-hidden">
      <div className={`${reverse ? "marquee-track-reverse" : "marquee-track"} group-hover:[animation-play-state:paused]`}>
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-10 pr-10 md:gap-[60px] md:pr-[60px]">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Marquee({ properties = PROPERTIES }: { properties?: Property[] }) {
  const s = siteStats(properties);
  const STATS = statsFor(s);
  return (
    <section aria-label={`${toWords(s.homes)} homes across ${toWords(s.cities)} cities`} className="flex flex-col gap-3 overflow-hidden border-y border-line bg-bone-soft py-4 md:py-5">
      <Row>
        {STATS.map(([num, label]) => (
          <div key={label} className="flex shrink-0 items-baseline gap-3">
            <span className="font-display text-[24px] italic text-moss md:text-[28px]">{num}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft md:text-[11px]">{label}</span>
            <span className="ml-3 h-[5px] w-[5px] rotate-45 bg-clay" />
          </div>
        ))}
      </Row>
      <Row reverse>
        {CITIES.map((c) => (
          <Link
            key={c.slug}
            href={`/cities/${c.slug}`}
            tabIndex={-1}
            className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-bone px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft no-underline transition-colors hover:border-clay hover:text-clay md:text-[11px]"
          >
            <span className="h-1 w-1 rotate-45 bg-amber" /> {c.name}
          </Link>
        ))}
      </Row>
    </section>
  );
}
