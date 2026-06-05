import Eyebrow from "./ui/Eyebrow";

// Map section, placeholder for the eventual Google Maps embed.
// Server component, no interactivity.
//
// Phase 2 (or whenever Maps API access is set up) will swap the
// background image for a real <iframe> or Google Maps JS API mount,
// and the static dots for real markers tied to property coordinates.

// Pin positions, hand-tuned to roughly match the GTA layout in the
// placeholder map image. These are percentages so they scale with
// the container. Will be replaced with real lat/lng coords later.
const PIN_POSITIONS: { top: string; left: string }[] = [
  { top: "38%", left: "32%" },
  { top: "40%", left: "36%" },
  { top: "46%", left: "50%" },
  { top: "48%", left: "54%" },
  { top: "50%", left: "60%" },
  { top: "52%", left: "64%" },
  { top: "46%", left: "68%" },
  { top: "38%", left: "70%" },
  { top: "30%", left: "62%" },
];

export default function MapSection() {
  return (
    <section id="map" className="px-6 py-[110px] max-md:px-5 max-md:py-[70px]">
      <div className="max-w-[1320px] mx-auto">

        {/* Header */}
        <div className="mb-9 max-w-[640px]">
          <Eyebrow>Find us on the map</Eyebrow>
          <h2
            className="font-display m-0 leading-[1.1] text-moss"
            style={{ fontSize: "clamp(30px, 4vw, 48px)" }}
          >
            All eleven, <span className="italic text-clay">in one view.</span>
          </h2>
        </div>

        {/* The map placeholder. Fixed height, rounded corners, brand border. */}
        <div className="rounded-[22px] overflow-hidden border border-line h-[480px] relative bg-bone-soft">
          {/* Placeholder map image, sepia-filtered to feel warm and on-brand.
              Will be replaced with the real Google Maps embed in Phase 2. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80"
            alt="Map of the Greater Toronto Area"
            className="w-full h-full object-cover"
            style={{ filter: "sepia(.3) saturate(.6) hue-rotate(-10deg)" }}
          />

          {/* Subtle moss-tinted overlay to harmonize the photo with the brand */}
          <div className="absolute inset-0 bg-moss/18" />

          {/* The 9 placeholder pins. .pulse-dot animates infinitely. */}
          {PIN_POSITIONS.map((pos, i) => (
            <div
              key={i}
              className="pulse-dot absolute w-3.5 h-3.5 rounded-full bg-clay"
              style={{
                top: pos.top,
                left: pos.left,
                border: "3px solid var(--color-bone)",
                boxShadow: "0 4px 12px rgba(31, 37, 33, 0.4)",
              }}
            />
          ))}

          {/* "Coming soon" callout in the bottom-left corner of the map */}
          <div
            className="
              absolute bottom-6 left-6 bg-bone px-5 py-4 rounded-[14px]
              text-[13px] text-ink max-w-[280px]
              border border-line
              shadow-[0_14px_36px_-10px_rgba(31,37,33,0.3)]
            "
          >
            <div className="font-display text-[17px] font-medium mb-1 text-moss">
              Live map coming soon
            </div>
            <div className="text-ink-soft text-[12px] leading-[1.5]">
              Google Maps embed with all 11 properties pinned and clickable.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}