import { Wifi, Car, Wind, Coffee, Bath, Award, Quote, Phone } from "lucide-react";
import Eyebrow from "./ui/Eyebrow";

// About section, the Maddie & Sam story.
// Server component, no interactivity.
// Lives on a dark moss background, so most text uses bone/amber colors instead of ink.

// Amenity tiles on the right side.
// Each is an [icon component, label, sub-label] tuple.
const AMENITIES: [React.ComponentType<{ size?: number; className?: string }>, string, string][] = [
  [Wifi,   "Fast Wi-Fi",     "In every home"],
  [Car,    "Free parking",   "On site"],
  [Wind,   "AC and heat",    "Year round"],
  [Coffee, "Espresso bar",   "Beans included"],
  [Bath,   "Plush linens",   "Hotel grade"],
  [Award,  "Superhost",      "Multiple homes"],
];

export default function About() {
  return (
    // id="about" so the header's #about nav link scrolls here
    <section
      id="about"
      className="px-6 py-[120px] bg-moss text-bone relative overflow-hidden max-md:px-5 max-md:py-[70px]"
    >
      {/* Decorative thin circles, top-right and bottom-left.
          Just outlines, no fill, very low opacity. Pure visual texture. */}
      <div className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full border border-bone/10" />
      <div className="absolute -bottom-[150px] -left-[150px] w-[500px] h-[500px] rounded-full border border-bone/5" />

      {/* Main two-column grid. The "relative" puts content above the decorative circles. */}
      <div
        className="max-w-[1320px] mx-auto grid gap-[72px] items-center relative max-sm:gap-10"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
      >

        {/* LEFT COLUMN: story */}
        <div>
          {/* Amber eyebrow because we're on dark background */}
          <Eyebrow color="amber">Meet your hosts</Eyebrow>

          <h2
            className="font-display m-0 mb-8 leading-[1.08] text-bone"
            style={{ fontSize: "clamp(34px, 4.5vw, 56px)" }}
          >
            Madeline and Samuel{" "}
            <span className="italic text-amber block mt-1">Jean-Louis.</span>
          </h2>

          {/* Decorative quote mark above the story */}
          <Quote size={28} className="text-amber opacity-50 mb-2" />

          {/* The two paragraphs of story.
              Updated to use "Maddie" per the client preference. */}
          <p className="text-[17px] leading-[1.75] text-bone/82 mb-[18px]">
            We are a husband and wife team who started M&amp;S Hosting Solutions
            because we love the part of travel that has nothing to do with the
            booking page. The kettle that works. The towel folded just so. The
            text that gets answered the same hour you send it.
          </p>
          <p className="text-[17px] leading-[1.75] text-bone/82 mb-8">
            Eleven homes later, we are still the ones who set up your check-in,
            restock the coffee, and pick up when you call. That part will not
            change.
          </p>

          {/* Sign-off block: MS monogram circle + name + phone */}
          <div className="flex items-center gap-3.5 pt-7 border-t border-bone/18">
            {/* The little amber circle with "MS" initials */}
            <div className="w-12 h-12 rounded-full bg-amber flex items-center justify-center text-moss-dark font-semibold font-display">
              MS
            </div>
            <div>
              <div className="font-display text-[17px] text-bone italic">
                Maddie &amp; Sam
              </div>
              {/* tel: link so mobile users can tap-to-call */}
              <a
                href="tel:9059226538"
                className="text-[13px] text-bone/70 no-underline flex items-center gap-1.5 mt-0.5"
              >
                <Phone size={11} /> (905) 922 6538
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: amenities grid */}
        <div className="grid grid-cols-2 gap-3">
          {AMENITIES.map(([Icon, label, sub], i) => (
            <div
              key={i}
              className="bg-bone/5 border border-bone/10 rounded-[14px] px-[18px] py-6"
            >
              <Icon size={22} className="text-amber mb-3.5" />
              <div className="text-sm text-bone mb-1">{label}</div>
              <div className="font-mono text-[10px] text-bone/55 tracking-[0.1em] uppercase">
                {sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}