import { Search, MapPin, Calendar, Users } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";
import SearchField from "./ui/SearchField";

// Hero section, the big landing area at the top of the page.
// Server component (no interactivity needed), so it ships zero JS.
export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center px-6 pt-10 pb-20 md:px-6 md:pt-10 md:pb-20">
      {/* Arched image on the right side.
          The huge border-radius values create the rounded-arch shape.
          On mobile the arch shifts down and shrinks, see the responsive overrides below. */}
      <div
        className="
          absolute overflow-hidden
          right-[-4vw] top-[6%] w-[46vw] max-w-[600px] h-[85%]
          shadow-[0_50px_100px_-40px_rgba(31,37,33,0.45)]
          max-md:right-[-16vw] max-md:top-auto max-md:bottom-[-6vh]
          max-md:w-[86vw] max-md:h-[44vh] max-md:opacity-35
        "
        style={{
          borderRadius: "50% 50% 8px 8px / 30% 30% 8px 8px",
        }}
      >
        {/* Background hero photo, placeholder from Unsplash for now.
            Phase 5 will swap this for a real M&S property photo. */}
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=85"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Subtle dark gradient at the bottom of the image, helps blend into page */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-moss/30" />
      </div>

      {/* "Hosted in person" stamp, the small circular badge in bottom-right.
          Hidden on mobile because there's no room for it. */}
      <div
        className="
          hidden md:flex
          absolute right-[6vw] bottom-[60px]
          w-[130px] h-[130px] rounded-full
          border border-clay text-clay
          items-center justify-center text-center
          text-[10px] tracking-[0.24em] uppercase leading-relaxed
          bg-bone/55 backdrop-blur-sm
        "
        style={{ transform: "rotate(-8deg)" }}
      >
        <span>
          Hosted<br />
          in person<br />
          <span className="font-display italic text-[22px] tracking-normal">
            by Maddy &amp; Sam
          </span>
        </span>
      </div>

      {/* Main content, positioned above the arch image via z-index */}
      <div className="relative z-[2] max-w-[1320px] mx-auto w-full">
        <div className="max-w-[660px]">
          {/* Section label with the terracotta diamond */}
          <div className="fade-up mb-7">
            <Eyebrow>A GTA Collection</Eyebrow>
          </div>

          {/* The big two-line headline.
              clamp() makes the font size fluid between mobile and desktop.
              The "Stay a while." line is italic and clay-colored. */}
          <h1
            className="
              font-display fade-up text-moss
              font-medium leading-[0.98] mb-8
            "
            style={{
              fontSize: "clamp(46px, 8vw, 92px)",
              animationDelay: ".1s",
            }}
          >
            Settle in.<br />
            <span className="italic text-clay font-normal">Stay a while.</span>
          </h1>

          {/* Subhead paragraph */}
          <p
            className="fade-up leading-[1.65] text-ink-soft max-w-[520px] mb-12"
            style={{
              fontSize: "clamp(16px, 1.6vw, 19px)",
              animationDelay: ".2s",
            }}
          >
            Eleven carefully kept homes across seven cities in the Greater Toronto Area,
            hosted in person by Madeline and Samuel Jean-Louis.
          </p>

          {/* Search box, the inline booking-search-style row.
              On mobile each field stacks; on desktop they sit side by side.
              The CTA button spans full width at the bottom. */}
          <div
            className="
              fade-up bg-bone border border-line rounded-[18px] p-2
              shadow-[0_30px_80px_-30px_rgba(31,37,33,0.25)]
              grid gap-1 max-w-[600px]
            "
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              animationDelay: ".3s",
            }}
          >
            <SearchField icon={<MapPin size={14} />}  label="Where"     value="Greater Toronto" />
            <SearchField icon={<Calendar size={14} />} label="Check in"  value="Add dates" />
            <SearchField icon={<Calendar size={14} />} label="Check out" value="Add dates" />
            <SearchField icon={<Users size={14} />}    label="Guests"    value="2 guests" />

            {/* CTA button, spans all columns. */}
            <button
              className="
                bg-clay text-bone border-none rounded-xl px-[18px] py-3.5
                flex items-center justify-center gap-2
                font-medium cursor-pointer text-sm
                col-span-full
              "
            >
              <Search size={15} /> Find a stay to book
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}