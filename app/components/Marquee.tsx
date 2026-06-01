// Marquee, the thin band of stats that scrolls infinitely under the hero.
// Server component, pure CSS animation, zero JavaScript.
//
// Trick: we render the same list of stats TWICE inside one track.
// The CSS animation translates the track from 0 to -50% over 50 seconds,
// then loops. Because the second copy is already in view when the first
// copy scrolls off, it looks like one endless stream.

// Each stat is a [number, label] pair. Numbers and labels match the brief.
const STATS: [string, string][] = [
  ["11",        "Curated homes"],
  ["7",         "GTA cities"],
  ["4.9",       "Average rating"],
  ["Superhost", "Status held"],
  ["In person", "Hosting"],
  ["Family",    "Run"],
];

export default function Marquee() {
  return (
    <section className="border-y border-line py-[22px] bg-bone-soft overflow-hidden">
      {/* The track holds two duplicate copies of the stats list.
          .marquee-track applies the looping CSS animation. */}
      <div className="marquee-track">
        {[0, 1].map((duplicateIndex) => (
          <div
            key={duplicateIndex}
            className="flex gap-[60px] items-center shrink-0 pr-[60px]"
          >
            {STATS.map(([number, label], i) => (
              <div key={i} className="flex items-baseline gap-3.5 shrink-0">
                {/* Big italic serif number */}
                <span className="font-display italic text-[28px] text-moss">
                  {number}
                </span>

                {/* Small uppercase mono label */}
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-soft">
                  {label}
                </span>

                {/* Terracotta diamond separator between items */}
                <span className="w-[5px] h-[5px] bg-clay rotate-45 ml-3.5" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}